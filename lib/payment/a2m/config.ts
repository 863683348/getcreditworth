/**
 * A2M 运行时配置。
 *
 * 规则来自支付宝 SDK 接入要求：
 * - 私钥用语言匹配的格式。Node.js 取 PKCS#1（裸 Base64，不带 PEM 头尾），不做任何转换。
 * - 网关沙箱 `openapi-sandbox.dl.alipaydev.com`，生产 `openapi.alipay.com`。
 * - 配置缺失或模式错配时明确失败，不回退示例值或占位密钥。
 */

const SANDBOX_GATEWAY = 'https://openapi-sandbox.dl.alipaydev.com/gateway.do';
const PRODUCTION_GATEWAY = 'https://openapi.alipay.com/gateway.do';

/** 沙箱联调固定值，生产必须替换为服务市场注册所得的真实 serviceId。 */
export const MOCK_SERVICE_ID = 'api_mock_service_id';

export interface A2mConfig {
  appId: string;
  /** PKCS#1 裸 Base64（无 PEM 头尾），同时用于 SDK 签名与账单 seller_signature */
  privateKey: string;
  alipayPublicKey: string;
  gateway: string;
  /** 卖家支付宝用户 ID，2088 开头 */
  sellerId: string;
  sellerName: string;
  /** 生产为服务市场 serviceId，沙箱为 api_mock_service_id */
  serviceId: string;
}

export class A2mConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'A2mConfigError';
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new A2mConfigError(
      `缺少环境变量 ${name}。A2M 付费链路必须读取真实支付宝配置，不提供占位兜底。`
    );
  }
  return value.trim();
}

let cached: A2mConfig | null = null;

export function readA2mConfig(): A2mConfig {
  if (cached) return cached;

  const gateway = (process.env.ALIPAY_GATEWAY || SANDBOX_GATEWAY).trim();
  if (gateway !== SANDBOX_GATEWAY && gateway !== PRODUCTION_GATEWAY) {
    throw new A2mConfigError(
      `ALIPAY_GATEWAY 取值非法：${gateway}。只允许沙箱 ${SANDBOX_GATEWAY} 或生产 ${PRODUCTION_GATEWAY}。`
    );
  }

  cached = {
    appId: required('ALIPAY_APP_ID'),
    privateKey: required('ALIPAY_APP_PRIVATE_KEY'),
    alipayPublicKey: required('ALIPAY_PUBLIC_KEY'),
    gateway,
    sellerId: required('ALIPAY_SELLER_ID'),
    sellerName: process.env.ALIPAY_SELLER_NAME?.trim() || 'GetCreditWorth',
    serviceId: required('ALIPAY_SERVICE_ID'),
  };
  return cached;
}

/**
 * 严格沙箱模式：网关与 serviceId 同时为沙箱取值。
 * 只有该模式允许在验付响应缺字段时用本地订单补值，生产不允许。
 */
export function isSandboxMode(config: A2mConfig): boolean {
  return config.gateway === SANDBOX_GATEWAY && config.serviceId === MOCK_SERVICE_ID;
}

/** 单价（元），两位小数。契约要求与支付宝服务登记价、SkillHub 展示价三者一致。 */
export function unitPriceCny(): string {
  const raw = (process.env.CREDITWORTH_PRICE_CNY || '0.30').trim();
  const match = /^(\d{1,2})(?:\.(\d{1,2}))?$/.exec(raw);
  if (!match) {
    throw new A2mConfigError(`CREDITWORTH_PRICE_CNY 取值非法：${raw}。要求 0.01～50，最多两位小数。`);
  }
  const amount = `${BigInt(match[1]).toString()}.${(match[2] || '').padEnd(2, '0')}`;
  if (Number(amount) < 0.01 || Number(amount) > 50) {
    throw new A2mConfigError(`CREDITWORTH_PRICE_CNY 超出 0.01～50 区间：${amount}`);
  }
  return amount;
}

/** 每身份每日免费调用次数。免费额度与支付宝侧无关，是本地防误用措施。 */
export function freeDailyQuota(): number {
  const raw = Number(process.env.CREDITWORTH_FREE_DAILY);
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 5;
}

export const A2M_RESOURCE_PATH = '/api/v1/credit-worth';
