import { getBookList } from "@/lib/api/controllers/book.controller";
import { toListBook } from "@/lib/data/books";
import { AllBooksContent } from "@/components/AllBooksContent";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Best Audiobooks for Audible Credits (700+ Ranked by Value)',
  description:
    'The best audiobooks for Audible credits in 2026. Browse 700+ titles ranked by Value Score, cost per hour, and rating. Filter by genre, length, and rating to find the highest-value books and maximize every credit.',
  keywords: [
    'best audiobooks for credits',
    'audiobooks ranked by value',
    'best audible books to use credit on',
    'highest value audiobooks',
    'audible credit worth books',
    'best books for audible credit 2026',
    'longest audiobooks audible credit',
    'top audiobooks credit value',
    'audiobook value score',
    'audible credit recommendations',
  ],
  alternates: { canonical: buildCanonicalUrl("/books") },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Best Audiobooks for Audible Credits (700+ Ranked by Value)',
    description:
      'Browse 700+ audiobooks ranked by Value Score. Find the best books to spend your Audible credits on and maximize every credit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Audiobooks for Audible Credits (700+ Ranked by Value)',
    description:
      'Browse 700+ audiobooks ranked by Value Score. Filter by length, rating, and genre to find the highest-value books for your Audible credits.',
  },
};

export default function AllBooksPage() {
  // Fast Origin Transfer 优化：初始只渲染 Top 50（排行展示），
  // 全量 3673 本由 BookExplorer 通过 /api/books/list 客户端懒加载（搜索/筛选不受影响）。
  // 原实现全量 pageSize:5000 内联进 RSC payload ~3MB，每次回源都是大 FOT。
  const result = getBookList({ pageSize: 50 });
  return <AllBooksContent books={result.books.map((b) => toListBook(b))} />;
}

