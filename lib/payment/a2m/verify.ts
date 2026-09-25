/**
 * 支付宝 A2M 服务端调用：验付与履约确认。
 *
 * 只调两个接口，契约「默认范围」明确规定不得混入网页/APP 收单接口或异步通知：
 * - `alipay.aipay.agent.payment.verify`   业务入参 trade_no + payment_proof (+ client_session)
 * - `alipay.aipay.agent.fulfillment.confirm` 业务入参只有 trade_no
 *
 * SDK 版本 alipay-sdk 4.14.0，命名导出。`keyType` 默认 PKCS1，与 Node.js 私钥格式要求一致，
 * 因此不显式改写，也不对私钥做任何格式加工。
 */

import { AlipaySdk } from 'alipay-sdk';
import { base64UrlDecode, normalizeAmount, amountsEqual } from './bill';
import { A2mConfigError, readA2mConfig } from './config';
import type { DecodedProof, VerifyOutcome } from './types';

const VERIFY_METHOD = 'alipay.aipay.agent.payment.verify';
const FULFILLMENT_METHOD = 'alipay.aipay.agent.fulfillment.confirm';
const SUCCESS_CODE = '10000';

let sdkInstance: AlipaySdk | null = null;

function getSdk(): AlipaySdk {
  if (sdkInstance) return sdkInstance;
  const config = readA2mConfig();
  sdkInstance = new AlipaySdk({
    appId: config.appId,
    privateKey: config.privateKey,
    alipayPublicKey: config.alipayPublicKey,
    gateway: config.gateway,
    timeout: 30000,
  });
  return sdkInstance;
}

/** SDK 的响应可能是嵌套结构，也可能直接是业务字段。 */
function unwrap(response: unknown, nestedKey: string): Record<string, unknown> {
  const root = response as Record<string, unknown> | null;
  if (!root) return {};
  const nested = root[nestedKey];
  if (nested && typeof nested === 'object') return nested as Record<string, unknown>;
  return root;
}

function pick(source: Record<string, unknown>, ...names: string[]): string {
  for (const name of names) {
    const value = source[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function isSuccess(source: Record<string, unknown>): boolean {
  const code = source.code;
  return code === SUCCESS_CODE || code === Number(SUCCESS_CODE);
}

export class PaymentProofError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentProofError';
  }
}

/** 解析 `Payment-Proof` 头。格式不合法或缺少必需字段时抛错，由调用方转 402。 */
export function decodePaymentProof(rawHeader: string | null | undefined): DecodedProof {
  if (!rawHeader || !rawHeader.trim()) {
    throw new PaymentProofError('缺少 Payment-Proof');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(base64UrlDecode(rawHeader.trim())) as Record<string, unknown>;
  } catch {
    throw new PaymentProofError('Payment-Proof 不是合法的 Base64URL JSON');
  }

  const protocol = (parsed.protocol ?? {}) as Record<string, unknown>;
  const method = (parsed.method ?? {}) as Record<string, unknown>;

  const paymentProof = pick(protocol, 'payment_proof', 'paymentProof');
  const tradeNo = pick(protocol, 'trade_no', 'tradeNo');
  const clientSession = pick(method, 'client_session', 'clientSession');

  if (!paymentProof) throw new PaymentProofError('Payment-Proof 缺少 protocol.payment_proof');
  if (!tradeNo) throw new PaymentProofError('Payment-Proof 缺少 protocol.trade_no');

  return { paymentProof, tradeNo, clientSession: clientSession || undefined };
}

/**
 * 调支付宝验付。
 * 返回归一化结果；接口失败或字段缺失时抛错，由调用方决定是否回 402。
 */
export async function verifyPaymentWithAlipay(decoded: DecodedProof): Promise<VerifyOutcome> {
  const bizContent: Record<string, string> = {
    payment_proof: decoded.paymentProof,
    trade_no: decoded.tradeNo,
  };
  if (decoded.clientSession) bizContent.client_session = decoded.clientSession;

  const response = await getSdk().exec(VERIFY_METHOD, { bizContent });
  const data = unwrap(response, 'alipay_aipay_agent_payment_verify_response');

  if (!isSuccess(data)) {
    const subCode = pick(data, 'sub_code', 'subCode');
    const message = pick(data, 'sub_msg', 'subMsg', 'msg') || '支付凭证验证失败';
    throw new PaymentProofError(`验付未通过${subCode ? `（${subCode}）` : ''}：${message}`);
  }

  return {
    active: data.active === true,
    tradeNo: pick(data, 'trade_no', 'tradeNo'),
    outTradeNo: pick(data, 'out_trade_no', 'outTradeNo'),
    amount: pick(data, 'amount'),
    resourceId: pick(data, 'resource_id', 'resourceId'),
  };
}

/**
 * 履约确认。资源已生成但确认失败时允许用同一 Payment-Proof 重试，
 * 因此这里返回布尔值而不抛错，让调用方返回 502 而非清空订单状态。
 */
export async function confirmFulfillment(tradeNo: string): Promise<boolean> {
  if (!tradeNo) return false;
  try {
    const response = await getSdk().exec(FULFILLMENT_METHOD, { bizContent: { trade_no: tradeNo } });
    const data = unwrap(response, 'alipay_aipay_agent_fulfillment_confirm_response');
    return isSuccess(data);
  } catch (err) {
    console.error('[a2m] 履约确认异常:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * 验付结果的严格校验。契约要求六项同时成立，缺一不可。
 * 沙箱模式例外：网关与 serviceId 均为沙箱值时，允许用本地订单补足接口未回传的字段。
 */
export interface StrictCheckInput {
  outcome: VerifyOutcome;
  proofTradeNo: string;
  orderAmount: string;
  orderOutTradeNo: string;
  orderResourceId: string;
  requestResourceId: string;
  sandboxMode: boolean;
}

export function assertVerified(input: StrictCheckInput): void {
  const { outcome, sandboxMode } = input;

  const tradeNo = outcome.tradeNo || (sandboxMode ? input.proofTradeNo : '');
  const amount = outcome.amount || (sandboxMode ? input.orderAmount : '');
  const resourceId = outcome.resourceId || (sandboxMode ? input.orderResourceId : '');

  if (outcome.active !== true) {
    throw new PaymentProofError('验付返回 active 不为 true');
  }
  if (!tradeNo || tradeNo !== input.proofTradeNo) {
    throw new PaymentProofError('验付返回的 trade_no 与凭据不一致');
  }
  if (outcome.outTradeNo !== input.orderOutTradeNo) {
    throw new PaymentProofError(
      `验付返回的 out_trade_no（${outcome.outTradeNo}）与本地订单（${input.orderOutTradeNo}）不一致`
    );
  }
  if (!amountsEqual(amount, input.orderAmount)) {
    throw new PaymentProofError(
      `验付金额 ${amount} 与本地订单金额 ${input.orderAmount} 不一致`
    );
  }
  if (!resourceId || resourceId !== input.orderResourceId || resourceId !== input.requestResourceId) {
    throw new PaymentProofError(
      `resource_id 不匹配：验付 ${resourceId}，订单 ${input.orderResourceId}，当前请求 ${input.requestResourceId}`
    );
  }
  const normalized = normalizeAmount(input.orderAmount);
  if (!normalized) {
    throw new A2mConfigError(`本地订单金额非法：${input.orderAmount}`);
  }
}
