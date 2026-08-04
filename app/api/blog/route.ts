/**
 * GET /api/blog
 * 获取全部博客文章列表（元数据）
 */

import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/api/controllers/blog.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(successResponse(posts));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
