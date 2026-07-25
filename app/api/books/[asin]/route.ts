/**
 * GET /api/books/[asin]
 * 获取单本书籍详情
 */

import { NextResponse } from 'next/server';
import { getBookDetail } from '@/lib/api/controllers/book.controller';
import { successResponse, errorResponse } from '@/lib/api/response';

interface RouteParams {
  params: { asin: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { asin } = params;

    // ASIN 格式校验
    if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json(
        errorResponse('INVALID_ASIN', 'ASIN must be 10 alphanumeric characters'),
        { status: 400 }
      );
    }

    const book = getBookDetail(asin);
    if (!book) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', `Book ${asin} not found`),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(book));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(errorResponse('FETCH_ERROR', message), { status: 500 });
  }
}
