/**
 * GET /api/books/list
 * 全量书籍列表（供 BookExplorer 客户端懒加载搜索）
 *
 * force-static：构建时生成静态 JSON 响应，edge 直接服务，
 * 运行时零函数调用 = 零 Fast Origin Transfer。
 * 首页不再把 300+ 本书内联进 RSC payload（原来 ~2.3MB）。
 */
import { getAllBooks, toListBook } from '@/lib/data/books';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(getAllBooks().map(toListBook));
}
