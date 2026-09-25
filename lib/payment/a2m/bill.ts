/**
 * 402 账单构造与商家签名。
 *
 * 依据本地契约「402 与账单」一节：
 * - 无有效 Payment-Proof 时返回 HTTP 402，账单放在 `Payment-Needed` 头，Base64URL 编码。
 * - 签名字段按 key 字典序拼接：amount、currency、goods_name、out_trade_no、
 *   pay_before、resource_id、seller_id、service_id。
 * - 签名只在商家本地完成，不请求支付宝服务端。
 */

import { createPrivateKey, createSign, randomUUID } from 'node:crypto';
import type { PaymentNeeded } from './types';

export const PAYMENT_NEEDED_HEADER = 'Payment-Needed';
export const PAYMENT_PROOF_HEADER = 'Payment-Proof';
export const PAYMENT_VALIDATION_HEADER = 'Payment-Validation';

/** 账单有效期，契约上限 30 分钟，取 30 分钟留足用户操作时间。 */
const PAY_BEFORE_MINUTES = 30;

export function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlDecode(input: string): string {
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4) normalized += '=';
  return Buffer.from(normalized, 'base64').toString('utf8');
}

/** 支付宝要求 `yyyy-MM-dd HH:mm:ss`，禁 ISO 格式。 */
export function formatAlipayTimestamp(date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** 账单 `pay_before` 用带时区偏移的 ISO 8601，如 2026-09-25T09:00:00+08:00。 */
export function formatISO8601WithTimezone(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
  );
}

/** 金额归一化为两位小数字符串，用于比较。非法返回 null。 */
export function normalizeAmount(value: unknown): string | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(value ?? '').trim());
  if (!match) return null;
  return `${BigInt(match[1]).toString()}.${(match[2] || '').padEnd(2, '0')}`;
}

export function amountsEqual(left: unknown, right: unknown): boolean {
  const a = normalizeAmount(left);
  const b = normalizeAmount(right);
  return a !== null && b !== null && a === b;
}

/**
 * 商家账单签名：RSA-SHA256（RSA2）。
 * 私钥为 PKCS#1 裸 Base64，按调用边界要求临时构造密钥对象，不改写原始配置值。
 */
export function generateSellerSignature(
  params: Record<string, string>,
  privateKeyRaw: string
): string {
  const signContent = Object.keys(params)
    .filter((key) => params[key] !== null && params[key] !== undefined && params[key] !== '')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  const key = createPrivateKey({
    key: Buffer.from(privateKeyRaw, 'base64'),
    format: 'der',
    type: 'pkcs1',
  });
  return createSign('RSA-SHA256').update(signContent, 'utf8').sign(key, 'base64');
}

export function createOutTradeNo(): string {
  return `CW_${Date.now()}_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

export interface BuildBillInput {
  outTradeNo: string;
  amount: string;
  resourceId: string;
  goodsName: string;
  payBefore: Date;
  sellerId: string;
  sellerName: string;
  appId: string;
  serviceId: string;
  privateKey: string;
}

/** 组装 `Payment-Needed`，返回可直接写入响应头的 Base64URL 字符串。 */
export function buildPaymentNeededHeader(input: BuildBillInput): string {
  const payBeforeStr = formatISO8601WithTimezone(input.payBefore);
  const sellerSignature = generateSellerSignature(
    {
      amount: input.amount,
      currency: 'CNY',
      goods_name: input.goodsName,
      out_trade_no: input.outTradeNo,
      pay_before: payBeforeStr,
      resource_id: input.resourceId,
      seller_id: input.sellerId,
      service_id: input.serviceId,
    },
    input.privateKey
  );

  const bill: PaymentNeeded = {
    protocol: {
      out_trade_no: input.outTradeNo,
      amount: input.amount,
      currency: 'CNY',
      resource_id: input.resourceId,
      pay_before: payBeforeStr,
      seller_signature: sellerSignature,
      seller_sign_type: 'RSA2',
      seller_unique_id: input.sellerId,
    },
    method: {
      seller_name: input.sellerName,
      seller_id: input.sellerId,
      seller_app_id: input.appId,
      goods_name: input.goodsName,
      seller_unique_id_key: 'seller_id',
      service_id: input.serviceId,
    },
  };

  return base64UrlEncode(JSON.stringify(bill));
}

export function defaultPayBefore(now = new Date()): Date {
  return new Date(now.getTime() + PAY_BEFORE_MINUTES * 60 * 1000);
}

/** 资源交付成功时回填给买家的凭证，与官方示例同构。 */
export function buildPaymentValidationHeader(input: {
  tradeNo: string;
  outTradeNo: string;
  resourceId: string;
}): string {
  return base64UrlEncode(
    JSON.stringify({
      trade_no: input.tradeNo,
      out_trade_no: input.outTradeNo,
      validated: true,
      resource_id: input.resourceId,
    })
  );
}
