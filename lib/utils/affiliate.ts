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
 */

import { SITE_CONFIG } from '@/lib/config';

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'amzreviewer20-20';
const AMAZON_SEARCH_URL = 'https://www.amazon.com/s';

/**
 * 生成带 Affiliate Tag 的 Amazon 链接
 * 优先用书名+作者搜索（最精准），fallback 用 ASIN 搜索
 * 全部走搜索链接，避免 Audible ASIN 在 /dp/ 上 404
 */
export function buildAffiliateUrl(asin: string, bookTitle?: string, bookAuthor?: string): string {
  // 如果有书名和作者，用书名+作者搜索（最精准）
  if (bookTitle) {
    const searchQuery = encodeURIComponent(
      `${bookTitle} ${bookAuthor || ''} audible audiobook`.trim().replace(/\s+/g, ' ')
    );
    return `${AMAZON_SEARCH_URL}?k=${searchQuery}&i=audible&tag=${AFFILIATE_TAG}`;
  }

  // Fallback: 用 ASIN 作为搜索词（比 /dp/ 直链更安全，不会 404）
  // Audible ASIN 在 /dp/ 上会 404，但用搜索至少能到达 Amazon 搜索页
  const asinQuery = encodeURIComponent(`${asin} audible audiobook`);
  return `${AMAZON_SEARCH_URL}?k=${asinQuery}&i=audible&tag=${AFFILIATE_TAG}`;
}

/**
 * 跳转中转 URL
 * 走 /api/redirect/[asin] → 301 → Amazon
 */
export function buildRedirectUrl(asin: string): string {
  return `/api/redirect/${asin}`;
}

/**
 * 生成 canonical URL（用于 SEO）
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
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
 * 推荐使用 Amazon.com Audible 注册落地页链接（含 affiliate tag）。
 * 这与 Amazon Associates 后台自动关联，bounty 在客户开始试听即计入。
 *
 * 链接格式：amazon.com Audible 注册页 + tag 参数
 */
export function buildAudibleTrialUrl(): string {
  return `https://www.amazon.com/hz/audible/mlp/mdp/?tag=${AFFILIATE_TAG}`;
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
