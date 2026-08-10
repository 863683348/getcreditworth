import { getTopBooks, toCompareBook } from '@/lib/data/books';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { CompareContent } from '@/components/CompareContent';
import type { Metadata } from 'next';

// Fast Origin Transfer 优化：页面缓存 24h，避免每次访问都执行 Function + 全量传输
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Compare Audiobooks - Side by Side Value Comparison',
  description: 'Compare audiobooks side by side. See Value Scores, prices, durations, ratings and more.',
  keywords: [
    'compare audible books',
    'audiobook comparison tool',
    'side by side audiobook comparison',
    'audible book value comparison',
    'best audible books compared',
  ],
  alternates: { canonical: buildCanonicalUrl('/compare') },
  openGraph: {
    title: "Compare Audiobooks - Side by Side Value Comparison",
    description:
      "Compare audiobooks side by side. See Value Scores, prices, durations, ratings and more to find the best credit value.",
  },
};

export default function ComparePage() {
  // Fast Origin Transfer 优化：初始只渲染 Top 50（对比选择快速可用），
  // 全量 3673 本由 CompareContent 通过 /api/books/compare 客户端懒加载（搜索/选择不受影响）。
  // 原实现全量序列化进 RSC payload ~1MB。
  const books = getTopBooks(50).map(toCompareBook);
  return <CompareContent books={books} allBooksUrl="/api/books/compare" />;
}