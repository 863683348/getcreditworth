/**
 * X402 付费门控（微信支付 Agent Pay）
 *
 * 用途：给 /api/v1/* 这类「有真实远程交付物」的端点加一层按次计费闸门。
 * 免费额度内直接放行；超出额度返回 HTTP 402，并在响应头写入 WeixinPay-Required，
 * 由客户端（Agent / SkillHub）识别后弹出支付卡片；用户付款后带凭据重试。
 *
 * 对外只暴露四个函数：
 *   getIdentity(request)        识别调用方（用于额度计数）
 *   consumeQuota(identity)      消耗一次额度，返回是否放行
 *   createOrder(...)            生成 WeixinPay-Required 取值（即 payment_code）
 *   verifyPayment(...)          校验重试时的付款凭据
 *
 * 环境变量（全部可选；不配置时走本地签名模式，用于开发与端到端自测）：
 *   X402_SIGNING_SECRET     本地签名密钥（生产必配）
 *   X402_PREORDER_URL       真实预下单服务地址；配置后由它下发 payment_code
 *   X402_PREORDER_TOKEN     调用预下单服务的 Bearer 凭据
 *   X402_VERIFY_URL         真实付款核销地址；配置后由它确认是否已付款
 *   X402_VERIFY_TOKEN       调用核销服务的 Bearer 凭据
 *   CREDITWORTH_FREE_DAILY  每身份每日免费调用次数（默认 5）
 *   X402_PRICE_CNY          单价，元（默认 0.3）
 *
 * ⚠️ 额度是进程内计数。Vercel 上每个实例各自计数，重启即清零，
 *    只能挡住误用，挡不住刷量。要真正限住需接持久化存储（KV / Redis）。
 *    付费判断本身不依赖额度：凭据校验是服务端做的，改额度不影响收费正确性。
 */

import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';

export const X402_PROTOCOL = 'wechat-x402';
export const X402_RESOURCE = '/api/v1/credit-worth';

/** 每日免费额度，可用环境变量覆盖 */
export function freeDailyLimit(): number {
  const raw = Number(process.env.CREDITWORTH_FREE_DAILY);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 5;
}

/** 单价（元），可用环境变量覆盖 */
export function unitPriceCny(): string {
  return process.env.X402_PRICE_CNY || '0.3';
}

export interface QuotaState {
  identity: string;
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
}

export interface PaymentOrder {
  order_id: string;
  /** 写入 WeixinPay-Required 响应头的值，客户端把它当 paymentCode 复用 */
  payment_code: string;
  amount: string;
  currency: string;
  resource: string;
  expires_at: string;
}

export interface PaymentVerdict {
  paid: boolean;
  reason: string;
  order_id?: string;
}

// ── 额度计数 ───────────────────────────────────────────────────────────────

const quotaBuckets = new Map<string, { used: number; day: string }>();

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function nextMidnightUtc(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return d.toISOString();
}

/**
 * 识别调用方。优先取显式的客户端标识头，退化为 IP。
 * 不采集用户身份，只做额度分桶。
 */
export function getIdentity(request: Request): string {
  const explicit =
    request.headers.get('x-client-id') ||
    request.headers.get('x-skillhub-client') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';
  return explicit.slice(0, 120);
}

export function peekQuota(identity: string, now = new Date()): QuotaState {
  const day = todayKey(now);
  const limit = freeDailyLimit();
  const bucket = quotaBuckets.get(identity);
  const used = bucket && bucket.day === day ? bucket.used : 0;
  return {
    identity,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetAt: nextMidnightUtc(now),
  };
}

export function consumeQuota(identity: string, now = new Date()): { allowed: boolean; quota: QuotaState } {
  const state = peekQuota(identity, now);
  if (state.used >= state.limit) {
    return { allowed: false, quota: state };
  }
  quotaBuckets.set(identity, { used: state.used + 1, day: todayKey(now) });
  return { allowed: true, quota: { ...state, used: state.used + 1, remaining: state.remaining - 1 } };
}

// ── 签名与订单 ─────────────────────────────────────────────────────────────

function base64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlEncode(text: string): string {
  return base64url(new TextEncoder().encode(text));
}

function base64urlDecode(token: string): string {
  const pad = token.replace(/-/g, '+').replace(/_/g, '/');
  return new TextDecoder().decode(Uint8Array.from(atob(pad), (c) => c.charCodeAt(0)));
}

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return base64url(new Uint8Array(sig));
}

function signingSecret(): string {
  return process.env.X402_SIGNING_SECRET || 'local-dev-only-not-for-production';
}

function randomId(prefix: string): string {
  return `${prefix}_${base64url(crypto.getRandomValues(new Uint8Array(12)))}`;
}

export interface OrderInput {
  identity: string;
  /** 本次计费对应的可读描述，写进订单便于对账 */
  summary?: string;
  quantity?: number;
}

/**
 * 生成支付订单。
 * 配置了 X402_PREORDER_URL 时由上游预下单服务下发真实凭据；
 * 否则用本地 HMAC 签一个自包含令牌，供开发与自测跑通全链路。
 */
export async function createOrder(input: OrderInput): Promise<PaymentOrder> {
  const amount = (Number(unitPriceCny()) * (input.quantity || 1)).toFixed(2);
  const preorder = process.env.X402_PREORDER_URL;

  if (preorder) {
    const resp = await fetch(preorder, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.X402_PREORDER_TOKEN
          ? { Authorization: `Bearer ${process.env.X402_PREORDER_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        protocol: X402_PROTOCOL,
        resource: X402_RESOURCE,
        amount,
        currency: 'CNY',
        identity: input.identity,
        summary: input.summary || '',
      }),
    });
    const data = (await resp.json()) as {
      order_id?: string;
      payment_code?: string;
      WeixinPayRequired?: string;
      expires_at?: string;
    };
    const code = data.payment_code || data.WeixinPayRequired;
    if (!resp.ok || !code) {
      throw new Error(`预下单失败：${resp.status}`);
    }
    return {
      order_id: data.order_id || randomId('order'),
      payment_code: code,
      amount,
      currency: 'CNY',
      resource: X402_RESOURCE,
      expires_at: data.expires_at || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  const orderId = randomId('order');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const claims = {
    v: 1,
    protocol: X402_PROTOCOL,
    resource: X402_RESOURCE,
    order_id: orderId,
    amount,
    currency: 'CNY',
    nonce: randomId('nonce'),
    exp: Math.floor(Date.parse(expiresAt) / 1000),
  };
  const body = base64urlEncode(JSON.stringify(claims));
  const sig = await hmacSign(signingSecret(), body);
  return {
    order_id: orderId,
    payment_code: `${body}.${sig}`,
    amount,
    currency: 'CNY',
    resource: X402_RESOURCE,
    expires_at: expiresAt,
  };
}

// 已用过的 nonce（防同一凭据重复放行）。进程内，语义同额度计数。
const spentNonces = new Set<string>();

/**
 * 校验付款凭据。
 * 配置了 X402_VERIFY_URL 时以官方核销结果为准；
 * 否则校验本地签名令牌的有效期与是否已被用过。
 */
export async function verifyPayment(paymentCode: string | null | undefined): Promise<PaymentVerdict> {
  const code = (paymentCode || '').trim();
  if (!code) return { paid: false, reason: 'missing_payment_code' };

  const verifyUrl = process.env.X402_VERIFY_URL;
  if (verifyUrl) {
    try {
      const resp = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.X402_VERIFY_TOKEN
            ? { Authorization: `Bearer ${process.env.X402_VERIFY_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ payment_code: code, resource: X402_RESOURCE }),
      });
      const data = (await resp.json()) as {
        paid?: boolean;
        status?: string;
        order_id?: string;
        message?: string;
      };
      const paid = data.paid === true || data.status === 'paid';
      return { paid, reason: data.message || (paid ? 'verified' : 'not_paid'), order_id: data.order_id };
    } catch (err) {
      return { paid: false, reason: `verify_upstream_error:${err instanceof Error ? err.message : 'unknown'}` };
    }
  }

  const [body, sig] = code.split('.');
  if (!body || !sig) return { paid: false, reason: 'malformed_payment_code' };
  const expected = await hmacSign(signingSecret(), body);
  if (expected !== sig) return { paid: false, reason: 'bad_signature' };

  let claims: { exp?: number; nonce?: string; amount?: string; order_id?: string };
  try {
    claims = JSON.parse(base64urlDecode(body));
  } catch {
    return { paid: false, reason: 'unreadable_payment_code' };
  }
  if (!claims.exp || claims.exp * 1000 < Date.now()) {
    return { paid: false, reason: 'payment_code_expired' };
  }
  if (claims.nonce && spentNonces.has(claims.nonce)) {
    return { paid: false, reason: 'payment_code_already_used' };
  }
  if (claims.nonce) spentNonces.add(claims.nonce);
  return { paid: true, reason: 'local_signature_ok', order_id: claims.order_id };
}

/** 免费额度用尽时的引导文案，客户端可直接转述给用户 */
export function paywallMessage(quota: QuotaState, price: string): string {
  return [
    `免费额度已用完（每日 ${quota.limit} 次，UTC 次日 ${quota.resetAt.slice(11, 16)} 重置）。`,
    `批量决策与换书建议按次计费 ¥${price}。`,
    `付款完成后携带 payment_code 重试同一请求即可放行。`,
    `1 个 Audible 信用点按 $${AUDIBLE_CREDIT_VALUE} 计。`,
  ].join('');
}
