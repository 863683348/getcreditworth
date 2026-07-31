/**
 * Affiliate 链接生成工具
 *
 * 跳转通过后端 API 路由 /api/redirect/[asin] → 301 → Amazon
 * 好处: 可统计点击、可换 tag、对 SEO 友好、不直接暴露 affiliate 链接
 *
 * 重要：Audible.com 的 ASIN 与 Amazon.com 的 ASIN 不同！
 * - books.json 中的 ASIN 来自 Audible.com API（用于封面图）
 * - Amazon.com 上的 Audible 有声书使用不同的 ASIN
 * - amazon.com/dp/{audibleAsin} 会返回 404
 * - 解决方案：全部使用 Amazon 搜索链接，确保不 404
 *
 * 区域化：所有生成函数接受可选的 AmazonRegion 参数，切换 Amazon TLD 与 affiliate tag。
 */

import { SITE_CONFIG } from "@/lib/config";
import { AmazonRegion, AMAZON_TLD, DEFAULT_REGION } from "@/lib/amazon-regions";

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "amzreviewer20-20";

/**
 * 区域专属 affiliate tag。
 * 未配置的区域自动回退到全局 AFFILIATE_TAG（即美国 tag），
 * 这样即使你只注册了美国 Associates，切换器也能工作（仅切换域名）。
 * 注册了某国账号后，在此填入对应 tag 即可生效，无需改动其他代码。
 *
 * 也可通过环境变量覆盖：NEXT_PUBLIC_AMAZON_AFFILIATE_TAG_{REGION}
 * 例如 NEXT_PUBLIC_AMAZON_AFFILIATE_TAG_UK=your-uk-tag-21
 */
const REGION_TAGS: Partial<Record<AmazonRegion, string>> = {
  // us: "amzreviewer20-20",
  // uk: "your-uk-tag-21",
  // de: "your-de-tag-22",
};

/** 取某区域的 affiliate tag，未配置则回退全局 tag */
export function getAffiliateTag(region: AmazonRegion = DEFAULT_REGION): string {
  const envKey = `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG_${region.toUpperCase()}`;
  const envTag = process.env[envKey];
  return envTag || REGION_TAGS[region] || AFFILIATE_TAG;
}

/**
 * 生成带 Affiliate Tag 的 Amazon 链接
 * 优先用书名+作者搜索（最精准），fallback 用 ASIN 搜索
 * 全部走搜索链接，避免 Audible ASIN 在 /dp/ 上 404
 * 区域参数决定 Amazon TLD（amazon.com / amazon.co.uk ...）
 */
export function buildAffiliateUrl(
  asin: string,
  bookTitle?: string,
  bookAuthor?: string,
  region: AmazonRegion = DEFAULT_REGION
): string {
  const tld = AMAZON_TLD[region] || AMAZON_TLD.us;
  const tag = getAffiliateTag(region);
  const base = `https://www.amazon.${tld}/s`;

  // 如果有书名和作者，用书名+作者搜索（最精准）
  if (bookTitle) {
    const searchQuery = encodeURIComponent(
      `${bookTitle} ${bookAuthor || ""} audible audiobook`.trim().replace(/\s+/g, " ")
    );
    return `${base}?k=${searchQuery}&i=audible&tag=${tag}`;
  }

  // Fallback: 用 ASIN 作为搜索词（比 /dp/ 直链更安全，不会 404）
  const asinQuery = encodeURIComponent(`${asin} audible audiobook`);
  return `${base}?k=${asinQuery}&i=audible&tag=${tag}`;
}

/**
 * 跳转中转 URL
 * 走 /api/redirect/[asin]?region={region} → 301 → Amazon
 */
export function buildRedirectUrl(
  asin: string,
  region: AmazonRegion = DEFAULT_REGION
): string {
  return `/api/redirect/${asin}?region=${region}`;
}

/**
 * 生成 canonical URL（用于 SEO）
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * 生成 Audible 30 天试用联盟链接
 *
 * Bounty 规则（Amazon Associates Audible Program）：
 * - $5 bounty 每个合格试听注册（无需完成 30 天）
 * - $10 bounty 每个付费会员注册
 * - $0.50 每本有声书销售
 *
 * 推荐使用 Amazon.{tld} Audible 注册落地页链接（含 affiliate tag）。
 * 这与 Amazon Associates 后台自动关联，bounty 在客户开始试听即计入。
 *
 * 链接格式：amazon.{tld} Audible 注册页 + tag 参数
 * 区域参数决定 Amazon TLD。
 */
export function buildAudibleTrialUrl(
  region: AmazonRegion = DEFAULT_REGION
): string {
  const tld = AMAZON_TLD[region] || AMAZON_TLD.us;
  const tag = getAffiliateTag(region);
  return `https://www.amazon.${tld}/hz/audible/mlp/mdp/?tag=${tag}`;
}

/**
 * 备用方案：直接指向 Audible.com 试听页（含 tag）
 * 用于落地页测试或不同地区
 */
export function buildAudibleTrialDirectUrl(): string {
  return `https://www.audible.com/trial?tag=${AFFILIATE_TAG}`;
}

/**
 * 生成 OG 图片 URL（基于书籍封面或默认）
 */
export function buildOgImageUrl(asin?: string): string {
  if (asin) {
    return `${SITE_CONFIG.url}/api/og/${asin}`;
  }
  return `${SITE_CONFIG.url}/og-default.png`;
}
