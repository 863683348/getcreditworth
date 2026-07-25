/**
 * GET /api/books
 * 获取书籍列表，支持过滤、排序、分页
 *
 * Query params:
 * - keyword: 搜索关键词
 * - duration: 时长范围 (all|0-8|8-20|20-40|40-999)
 * - rating: 最低评分 (0|4.0|4.5)
 * - category: 分类
 * - sort: 排序 (valueScore|rating|duration|price)
 * - page: 页码 (default 1)
 * - pageSize: 每页数量 (default 50)
 * - limit: 限制返回数量（不分页，直接取前N条）
 */

import { NextResponse } from 'next/server';
import { getBookList, getTopBookList } from '@/lib/api/controllers/book.controller';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { SortOption } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 特殊模式：limit 参数直接返回 Top N（不分页）
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (limit > 0 && limit <= 200) {
        const books = getTopBookList(limit);
        return NextResponse.json(successResponse(books, `Top ${limit} books`));
      }
    }

    // 标准分页模式
    const sort = (searchParams.get('sort') || 'valueScore') as SortOption;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);

    const result = getBookList({
      keyword: searchParams.get('keyword') || '',
      durationRange: searchParams.get('duration') || 'all',
      minRating: parseFloat(searchParams.get('rating') || '0'),
      category: searchParams.get('category') || 'all',
      sort,
      page: Math.max(1, page),
      pageSize: Math.min(200, Math.max(1, pageSize)),
    });

    return NextResponse.json(successResponse(result));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
