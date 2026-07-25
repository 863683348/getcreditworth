/**
 * GET /api/categories
 * 获取全部分类列表
 */

import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/api/controllers/book.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(successResponse(categories));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
