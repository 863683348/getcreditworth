/**
 * GET /api/blog/[slug]
 * 获取单篇博客文章
 *
 * 注意：博客文章 content 为 JSX/ReactNode，无法 JSON 序列化
 * 此 API 仅返回元数据；正文在 SSG 页面渲染
 */

import { NextResponse } from 'next/server';
import { getPost } from '@/lib/api/controllers/blog.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

interface RouteParams {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = params;
    const post = getPost(slug);

    if (!post) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', `Blog post '${slug}' not found`),
        { status: 404 }
      );
    }

    // 返回元数据（不含 content，因为 ReactNode 不可序列化）
    const { content, ...meta } = post;
    return NextResponse.json(successResponse(meta));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
