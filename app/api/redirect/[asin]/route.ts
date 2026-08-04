import { NextResponse } from 'next/server';
import { buildAffiliateUrl } from '@/lib/utils/affiliate';
import { getBookByAsin } from '@/lib/data/books';
import { AmazonRegion, AMAZON_REGIONS, DEFAULT_REGION } from '@/lib/amazon-regions';

interface RouteParams {
  params: { asin: string };
}

/**
 * Affiliate 跳转路由
 * GET /api/redirect/[asin] → 301 → Amazon (含 affiliate tag)
 *
 * 重要：books.json 中的 ASIN 是 Audible.com 的内部 ASIN，
 * 在 amazon.com/dp/ 上会返回 404。
 * 因此使用 Amazon 搜索链接作为跳转目标，确保不 404。
 *
 * 跳转目标: amazon.com/s?k={书名+作者+audible}&i=audible&tag={tag}
 */
export async function GET(request: Request, { params }: RouteParams) {
  const { asin } = params;

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return NextResponse.json(
      { error: 'Invalid ASIN format' },
      { status: 400 }
    );
  }

  // 读取区域参数（来自前端 buildRedirectUrl 附加的 ?region=）
  const url = new URL(request.url);
  const regionParam = url.searchParams.get('region');
  const region: AmazonRegion =
    regionParam && AMAZON_REGIONS.some((r) => r.id === regionParam)
      ? (regionParam as AmazonRegion)
      : DEFAULT_REGION;

  // 查找书籍信息，用书名+作者构建搜索链接（按区域路由到对应 Amazon 商店）
  const book = getBookByAsin(asin);
  const targetUrl = buildAffiliateUrl(asin, book?.title, book?.author, region);

  // 301 永久重定向（SEO 友好）
  const response = NextResponse.redirect(targetUrl, {
    status: 301,
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });

  // 记录点击（未来扩展 - 写入数据库）
  if (book) {
    console.log(`[affiliate] redirect: ${asin} - ${book.title} → ${targetUrl.substring(0, 80)}...`);
  } else {
    console.log(`[affiliate] redirect: ${asin} (book not found) → ${targetUrl.substring(0, 80)}...`);
  }

  return response;
}
