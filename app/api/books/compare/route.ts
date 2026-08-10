/**
 * GET /api/books/compare
 * 全量书籍对比版（11 轻量字段，供 CompareContent 客户端懒加载搜索/选择）
 *
 * force-static：构建时生成静态 JSON，edge 直接服务，零函数调用 = 零 FOT。
 * 比 /api/books/list（含 categories/narrator 等）更轻（~1MB vs ~1.9MB）。
 */
import { getAllBooks, toCompareBook } from '@/lib/data/books';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(getAllBooks().map(toCompareBook));
}
