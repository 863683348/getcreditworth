/**
 * GET /api/curated
 * 获取全部精选榜单列表
 */

import { NextResponse } from 'next/server';
import { getAllCuratedLists } from '@/lib/api/controllers/curated.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET() {
  try {
    const lists = getAllCuratedLists();
    return NextResponse.json(successResponse(lists));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
