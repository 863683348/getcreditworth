/**
 * GET /api/curated/[slug]
 * 获取单个精选榜单详情（含书籍数据）
 */

import { NextResponse } from 'next/server';
import { getCuratedListDetail } from '@/lib/api/controllers/curated.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

interface RouteParams {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        errorResponse('INVALID_SLUG', 'Slug is required'),
        { status: 400 }
      );
    }

    const list = getCuratedListDetail(slug);
    if (!list) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', `Curated list '${slug}' not found`),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(list));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
