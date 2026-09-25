/**
 * A2M 编排层：把 402 账单、验付、履约串成 route 可用的两个动作。
 *
 * 调用顺序固定，不能调换：
 *   无 Payment-Proof → 建订单并返回 402 账单
 *   有 Payment-Proof → 验付 → 对齐本地订单 → 生成资源 → 履约确认 → 交付
 */

import { createHash } from 'node:crypto';
import {
  buildPaymentNeededHeader,
  buildPaymentValidationHeader,
  createOutTradeNo,
  defaultPayBefore,
} from './bill';
import { A2M_RESOURCE_PATH, isSandboxMode, readA2mConfig, unitPriceCny } from './config';
import { getOrderRepository } from './order-repository';
import {
  PaymentProofError,
  assertVerified,
  confirmFulfillment,
  decodePaymentProof,
  verifyPaymentWithAlipay,
} from './verify';
import type { A2mOrder } from './types';

export { A2M_RESOURCE_PATH, unitPriceCny } from './config';
export { PAYMENT_NEEDED_HEADER, PAYMENT_PROOF_HEADER, PAYMENT_VALIDATION_HEADER } from './bill';
export { getOrderRepository } from './order-repository';

export interface PaymentRequiredResult {
  status: 402;
  neededHeader: string;
  outTradeNo: string;
  amount: string;
  payBefore: string;
}

/**
 * 创建待支付订单并生成 `Payment-Needed` 账单。
 * requestHash 把订单绑定到这一次具体请求，防止用旧凭证换取新结果。
 */
export async function createPaymentRequired(input: {
  goodsName: string;
  requestHash: string;
  identity: string;
}): Promise<PaymentRequiredResult> {
  const config = readA2mConfig();
  const amount = unitPriceCny();
  const outTradeNo = createOutTradeNo();
  const payBefore = defaultPayBefore();

  const order: A2mOrder = {
    outTradeNo,
    amount,
    currency: 'CNY',
    resourceId: A2M_RESOURCE_PATH,
    goodsName: input.goodsName,
    payBefore: payBefore.toISOString(),
    orderStatus: 'PENDING_PAYMENT',
    fulfillStatus: 'UNFULFILLED',
    requestHash: input.requestHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await getOrderRepository().createPending(order);

  const neededHeader = buildPaymentNeededHeader({
    outTradeNo,
    amount,
    resourceId: A2M_RESOURCE_PATH,
    goodsName: input.goodsName,
    payBefore,
    sellerId: config.sellerId,
    sellerName: config.sellerName,
    appId: config.appId,
    serviceId: config.serviceId,
    privateKey: config.privateKey,
  });

  return {
    status: 402,
    neededHeader,
    outTradeNo,
    amount,
    payBefore: payBefore.toISOString(),
  };
}

export type AuthorizeOutcome =
  | {
      status: 'paid';
      tradeNo: string;
      outTradeNo: string;
      payload: string;
      alreadyFulfilled: boolean;
      validationHeader: string;
    }
  | { status: 'payment_required'; reason: string; neededHeader?: string }
  | { status: 'fulfillment_pending'; tradeNo: string; outTradeNo: string; message: string };

export interface AuthorizeInput {
  proofHeader: string | null;
  requestHash: string;
  createResource: () => string;
  /** 验付不通过时是否顺带下发新账单，便于客户端直接重新支付 */
  issueNewBill: () => Promise<string>;
}

export async function authorizeWithProof(input: AuthorizeInput): Promise<AuthorizeOutcome> {
  let decoded;
  try {
    decoded = decodePaymentProof(input.proofHeader);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Payment-Proof 解析失败';
    return { status: 'payment_required', reason, neededHeader: await input.issueNewBill() };
  }

  let outcome;
  try {
    outcome = await verifyPaymentWithAlipay(decoded);
  } catch (err) {
    const reason = err instanceof Error ? err.message : '验付调用失败';
    return { status: 'payment_required', reason, neededHeader: await input.issueNewBill() };
  }

  const repository = getOrderRepository();
  const order = outcome.outTradeNo ? await repository.findByOutTradeNo(outcome.outTradeNo) : null;
  if (!order) {
    return {
      status: 'payment_required',
      reason: `本地无对应订单：${outcome.outTradeNo || '（验付未返回 out_trade_no）'}`,
      neededHeader: await input.issueNewBill(),
    };
  }

  const config = readA2mConfig();
  try {
    assertVerified({
      outcome,
      proofTradeNo: decoded.tradeNo,
      orderAmount: order.amount,
      orderOutTradeNo: order.outTradeNo,
      orderResourceId: order.resourceId,
      requestResourceId: A2M_RESOURCE_PATH,
      sandboxMode: isSandboxMode(config),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : '验付结果校验失败';
    return { status: 'payment_required', reason, neededHeader: await input.issueNewBill() };
  }

  // 支付截止时间只在首次履约前生效。已进入履约的订单必须能重试确认，不能因超时重复生成资源。
  const withinPayWindow = Date.parse(order.payBefore) > Date.now();
  const alreadyFulfilling =
    order.fulfillStatus === 'PENDING_CONFIRM' || order.fulfillStatus === 'FULFILLED';
  if (!alreadyFulfilling && !withinPayWindow) {
    return {
      status: 'payment_required',
      reason: `订单 ${order.outTradeNo} 已超过支付截止时间 ${order.payBefore}`,
      neededHeader: await input.issueNewBill(),
    };
  }

  const tradeNo = outcome.tradeNo || decoded.tradeNo;

  let prepared;
  try {
    prepared = await repository.prepareFulfillment({
      outTradeNo: order.outTradeNo,
      tradeNo,
      expectedAmount: outcome.amount || order.amount,
      expectedResourceId: order.resourceId,
      requestHash: input.requestHash,
      createResource: input.createResource,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : '履约准备失败';
    return { status: 'payment_required', reason, neededHeader: await input.issueNewBill() };
  }

  if (prepared.state === 'FULFILLED') {
    return {
      status: 'paid',
      tradeNo,
      outTradeNo: order.outTradeNo,
      payload: prepared.serviceResult,
      alreadyFulfilled: true,
      validationHeader: buildPaymentValidationHeader({
        tradeNo,
        outTradeNo: order.outTradeNo,
        resourceId: order.resourceId,
      }),
    };
  }

  const confirmed = await confirmFulfillment(tradeNo);
  if (!confirmed) {
    return {
      status: 'fulfillment_pending',
      tradeNo,
      outTradeNo: order.outTradeNo,
      message: '资源已生成但履约确认未成功，请用同一 Payment-Proof 重试',
    };
  }

  await repository.markFulfilled(order.outTradeNo, tradeNo);

  return {
    status: 'paid',
    tradeNo,
    outTradeNo: order.outTradeNo,
    payload: prepared.serviceResult,
    alreadyFulfilled: false,
    validationHeader: buildPaymentValidationHeader({
      tradeNo,
      outTradeNo: order.outTradeNo,
      resourceId: order.resourceId,
    }),
  };
}

/** 请求指纹：把一次调用的业务参数固定下来，履约时按订单里的指纹生成资源。 */
export function buildRequestHash(parts: Record<string, unknown>): string {
  const canonical = Object.keys(parts)
    .sort()
    .map((key) => `${key}=${JSON.stringify(parts[key] ?? null)}`)
    .join('&');
  return createHash('sha256').update(canonical, 'utf8').digest('hex').slice(0, 32);
}

export { PaymentProofError };
