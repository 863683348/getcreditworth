/**
 * Amazon 区域市场定义 - 用于区域切换器与 affiliate 链接路由
 *
 * 重要说明：
 * - amazon.se（瑞典）已于 2023 年关闭，无瑞典 Associates 程序，故未列入。
 * - amazon.ie（爱尔兰）为较新站点，列入但需确认其 Associates 可用性。
 * - 区域切换仅改变 Amazon TLD 与 affiliate tag；书籍数据使用书名+作者搜索链接，
 *   无需按区域重新填充（某书在某区域是否存在由 Amazon 搜索结果决定）。
 */

export type AmazonRegion =
  | "us"
  | "uk"
  | "de"
  | "fr"
  | "it"
  | "es"
  | "ca"
  | "au"
  | "in"
  | "ie";

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
}

export const AMAZON_REGIONS: AmazonRegionInfo[] = [
  { id: "us", tld: "com", domain: "amazon.com", label: "United States", code: "US" },
  { id: "uk", tld: "co.uk", domain: "amazon.co.uk", label: "United Kingdom", code: "UK" },
  { id: "de", tld: "de", domain: "amazon.de", label: "Germany", code: "DE" },
  { id: "fr", tld: "fr", domain: "amazon.fr", label: "France", code: "FR" },
  { id: "it", tld: "it", domain: "amazon.it", label: "Italy", code: "IT" },
  { id: "es", tld: "es", domain: "amazon.es", label: "Spain", code: "ES" },
  { id: "ca", tld: "ca", domain: "amazon.ca", label: "Canada", code: "CA" },
  { id: "au", tld: "com.au", domain: "amazon.com.au", label: "Australia", code: "AU" },
  { id: "in", tld: "in", domain: "amazon.in", label: "India", code: "IN" },
  { id: "ie", tld: "ie", domain: "amazon.ie", label: "Ireland", code: "IE" },
];

export const AMAZON_TLD: Record<AmazonRegion, string> = AMAZON_REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r.tld;
    return acc;
  },
  {} as Record<AmazonRegion, string>
);

/** 从浏览器语言推测默认区域（首访且 localStorage 无记录时使用） */
export function detectRegionFromLocale(locale: string): AmazonRegion {
  const lower = locale.toLowerCase();
  const map: Record<string, AmazonRegion> = {
    "en-gb": "uk",
    "en-ca": "ca",
    "en-au": "au",
    "en-in": "in",
    "de": "de",
    "fr": "fr",
    "it": "it",
    "es": "es",
    "ca": "ca",
    "ga": "ie",
  };
  if (map[lower]) return map[lower];
  // 其他 en-* 归美国
  if (lower.startsWith("en")) return "us";
  // 其他语言回退美国
  return "us";
}
