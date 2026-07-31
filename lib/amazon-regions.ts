/**
 * Amazon 区域市场定义 - 用于区域切换器与 affiliate 链接路由
 *
 * 当前仅支持美国 + 欧盟 5 国（us / uk / de / fr / it / es）。
 * 区域切换仅改变 Amazon TLD 与 affiliate tag；书籍数据使用书名+作者搜索链接，
 * 无需按区域重新填充（某书在某区域是否存在由 Amazon 搜索结果决定）。
 *
 * visible 字段控制是否在切换器 UI 中展示：隐藏的区域仍保留 tag 路由逻辑，
 * 仅不渲染按钮，后续注册完成/临时下线改一个字段即可恢复。
 */

export type AmazonRegion = "us" | "uk" | "de" | "fr" | "it" | "es";

export const DEFAULT_REGION: AmazonRegion = "us";

export interface AmazonRegionInfo {
  /** 区域标识 */
  id: AmazonRegion;
  /** amazon.{tld} 中的 tld 部分 */
  tld: string;
  /** 完整展示域名，如 amazon.co.uk */
  domain: string;
  /** 国家/地区英文名 */
  label: string;
  /** 两位国家代码，用于紧凑展示 */
  code: string;
  /** 是否在区域切换器中展示（false = 隐藏，但链接路由逻辑保留） */
  visible: boolean;
}

export const AMAZON_REGIONS: AmazonRegionInfo[] = [
  { id: "us", tld: "com", domain: "amazon.com", label: "United States", code: "US", visible: true },
  { id: "uk", tld: "co.uk", domain: "amazon.co.uk", label: "United Kingdom", code: "UK", visible: true },
  { id: "de", tld: "de", domain: "amazon.de", label: "Germany", code: "DE", visible: false },
  { id: "fr", tld: "fr", domain: "amazon.fr", label: "France", code: "FR", visible: true },
  { id: "it", tld: "it", domain: "amazon.it", label: "Italy", code: "IT", visible: false },
  { id: "es", tld: "es", domain: "amazon.es", label: "Spain", code: "ES", visible: true },
];

/** 切换器中实际展示的区域（过滤 hidden） */
export const VISIBLE_REGIONS: AmazonRegionInfo[] = AMAZON_REGIONS.filter((r) => r.visible);

export const AMAZON_TLD: Record<AmazonRegion, string> = AMAZON_REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r.tld;
    return acc;
  },
  {} as Record<AmazonRegion, string>
);

const VALID_REGION_IDS = new Set(AMAZON_REGIONS.map((r) => r.id));

/** 校验区域是否有效（用于 localStorage 或浏览器语言推测的防御性校验） */
export function isValidRegion(region: string): region is AmazonRegion {
  return VALID_REGION_IDS.has(region as AmazonRegion);
}

/** 校验区域是否可在切换器中展示 */
export function isRegionVisible(region: AmazonRegion): boolean {
  const info = AMAZON_REGIONS.find((r) => r.id === region);
  return info ? info.visible : false;
}

/** 从浏览器语言推测默认区域（首访且 localStorage 无记录时使用）
 *  仅返回可见区域，隐藏区域一律回退美国 */
export function detectRegionFromLocale(locale: string): AmazonRegion {
  const lower = locale.toLowerCase();
  const map: Record<string, AmazonRegion> = {
    "en-gb": "uk",
    "de": "de",
    "fr": "fr",
    "it": "it",
    "es": "es",
    "ca": "es", // 加泰罗尼亚语 -> 西班牙
  };
  const candidate = map[lower];
  if (candidate && isRegionVisible(candidate)) return candidate;
  // 其他 en-* 归美国
  if (lower.startsWith("en")) return "us";
  // 其他语言回退美国
  return "us";
}
