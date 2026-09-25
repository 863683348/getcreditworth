/**
 * 支付宝 AI 按量付费（A2M）协议类型
 *
 * 协议依据：SkillHub 个人接入指南 + 支付宝 AI 按量付费本地接口契约。
 * 核心三条：402 返回 `Payment-Needed` 账单 → 携 `Payment-Proof` 重试验付 → 履约确认。
 */

/** 本地订单状态。CANCELED 由 pay_before 过期判定，不单独落库。 */
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID';

/** 履约状态。进入 PENDING_CONFIRM 后，即使 pay_before 已过也必须能重试确认。 */
export type FulfillStatus = 'UNFULFILLED' | 'PENDING_CONFIRM' | 'FULFILLED';

export interface A2mOrder {
  outTradeNo: string;
  /** 元，两位小数字符串，如 "0.30" */
  amount: string;
  currency: 'CNY';
  /** 本单绑定的资源标识，履约时须与支付宝校验返回值一致 */
  resourceId: string;
  goodsName: string;
  /** ISO 8601 带时区偏移，如 2026-09-25T09:00:00+08:00 */
  payBefore: string;
  orderStatus: OrderStatus;
  fulfillStatus: FulfillStatus;
  /** 支付宝交易号，验付成功后写入 */
  tradeNo?: string;
  /**
   * 请求指纹。同一笔订单只兑付下单时约定的那份资源，
   * 防止用 A 订单的付款凭证换取 B 请求的结果。
   */
  requestHash: string;
  /** 已生成的资源内容，履约确认成功后可原样重放 */
  serviceResult?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrepareFulfillmentInput {
  outTradeNo: string;
  tradeNo: string;
  expectedAmount: string;
  expectedResourceId: string;
  requestHash: string;
  createResource: () => string;
}

export interface PrepareFulfillmentResult {
  state: Extract<FulfillStatus, 'PENDING_CONFIRM' | 'FULFILLED'>;
  serviceResult: string;
}

/**
 * 订单仓储。必须由部署环境提供真实持久化实现。
 * 进程内 Map 在 Serverless 上会随实例回收丢失，禁止用于生产。
 */
export interface OrderRepository {
  createPending(order: A2mOrder): Promise<void>;
  findByOutTradeNo(outTradeNo: string): Promise<A2mOrder | null>;
  prepareFulfillment(input: PrepareFulfillmentInput): Promise<PrepareFulfillmentResult>;
  markFulfilled(outTradeNo: string, tradeNo: string): Promise<void>;
}

/** `Payment-Needed` 头解码后的结构。 */
export interface PaymentNeeded {
  protocol: {
    out_trade_no: string;
    amount: string;
    currency: 'CNY';
    resource_id: string;
    pay_before: string;
    seller_signature: string;
    seller_sign_type: 'RSA2';
    seller_unique_id: string;
  };
  method: {
    seller_name: string;
    seller_id: string;
    seller_app_id: string;
    goods_name: string;
    seller_unique_id_key: 'seller_id';
    service_id: string;
  };
}

/** `Payment-Proof` 头解码后取出的验付入参。 */
export interface DecodedProof {
  paymentProof: string;
  tradeNo: string;
  clientSession?: string;
}

/** 验付接口返回的业务字段（已归一化，兼容 SDK 的两种命名）。 */
export interface VerifyOutcome {
  active: boolean;
  tradeNo: string;
  outTradeNo: string;
  amount: string;
  resourceId: string;
}
