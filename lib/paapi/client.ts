/**
 * PA-API 5.0 客户端
 *
 * 封装对 Amazon Product Advertising API 5.0 的请求，
 * 包含 SigV4 签名、请求发送、响应解析。
 *
 * 环境变量:
 *   AMAZON_PAAPI_ACCESS_KEY
 *   AMAZON_PAAPI_SECRET_KEY
 *   AMAZON_PAAPI_PARTNER_TAG
 *   AMAZON_PAAPI_HOST (默认: webservices.amazon.com)
 *   AMAZON_PAAPI_REGION (默认: us-east-1)
 */

import { signRequest } from "./signer";
import type {
  PaapiConfig,
  SearchItemsRequest,
  GetItemsRequest,
  PaapiResponse,
  PaapiItem,
} from "./types";

const DEFAULT_HOST = "webservices.amazon.com";
const DEFAULT_REGION = "us-east-1";
const SERVICE = "ProductAdvertisingAPI";

function getConfig(): PaapiConfig {
  return {
    accessKey: process.env.AMAZON_PAAPI_ACCESS_KEY || "",
    secretKey: process.env.AMAZON_PAAPI_SECRET_KEY || "",
    partnerTag: process.env.AMAZON_PAAPI_PARTNER_TAG || "",
    partnerType: "Associates",
    host: process.env.AMAZON_PAAPI_HOST || DEFAULT_HOST,
    region: process.env.AMAZON_PAAPI_REGION || DEFAULT_REGION,
  };
}

function assertConfig(config: PaapiConfig): void {
  const missing: string[] = [];
  if (!config.accessKey) missing.push("AMAZON_PAAPI_ACCESS_KEY");
  if (!config.secretKey) missing.push("AMAZON_PAAPI_SECRET_KEY");
  if (!config.partnerTag) missing.push("AMAZON_PAAPI_PARTNER_TAG");
  if (missing.length > 0) {
    throw new Error(
      "PA-API not configured. Missing env vars: " + missing.join(", "),
    );
  }
}

async function request<T>(
  endpoint: string,
  body: Record<string, unknown>,
  config: PaapiConfig,
): Promise<PaapiResponse<T>> {
  const payload = JSON.stringify(body);
  const host = config.host || DEFAULT_HOST;
  const signed = signRequest({
    method: "POST",
    host,
    path: "/paapi5/" + endpoint,
    body: payload,
    service: SERVICE,
    region: config.region || DEFAULT_REGION,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });

  const url = "https://" + host + "/paapi5/" + endpoint;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": signed["content-type"],
      "x-amz-date": signed["x-amz-date"],
      authorization: signed.authorization,
    },
    body: payload,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(
      "PA-API request failed: " +
        resp.status +
        " " +
        resp.statusText +
        (text ? " - " + text.substring(0, 200) : ""),
    );
  }

  return resp.json() as Promise<PaapiResponse<T>>;
}

/**
 * 搜索商品
 */
export async function searchItems(
  req: Omit<SearchItemsRequest, "PartnerTag" | "PartnerType">,
): Promise<PaapiItem[]> {
  const config = getConfig();
  assertConfig(config);

  const body: SearchItemsRequest = {
    ...req,
    PartnerTag: config.partnerTag,
    PartnerType: config.partnerType,
  };

  const result = await request<PaapiItem>("searchitems", body as unknown as Record<string, unknown>, config);

  if (result.Errors && result.Errors.length > 0) {
    throw new Error(
      "PA-API error: " +
        result.Errors.map((e) => e.Code + ": " + e.Message).join("; "),
    );
  }

  return result.ItemsResult?.Items || [];
}

/**
 * 通过 ASIN 获取商品详情
 */
export async function getItems(
  req: Omit<GetItemsRequest, "PartnerTag" | "PartnerType">,
): Promise<PaapiItem[]> {
  const config = getConfig();
  assertConfig(config);

  const body: GetItemsRequest = {
    ...req,
    PartnerTag: config.partnerTag,
    PartnerType: config.partnerType,
  };

  const result = await request<PaapiItem>("getitems", body as unknown as Record<string, unknown>, config);

  if (result.Errors && result.Errors.length > 0) {
    throw new Error(
      "PA-API error: " +
        result.Errors.map((e) => e.Code + ": " + e.Message).join("; "),
    );
  }

  return result.ItemsResult?.Items || [];
}

/**
 * 检查 PA-API 是否已配置
 */
export function isPaapiConfigured(): boolean {
  const config = getConfig();
  return Boolean(
    config.accessKey && config.secretKey && config.partnerTag,
  );
}
