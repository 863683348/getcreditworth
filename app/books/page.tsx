import { getAllBooks, toListBook } from "@/lib/data/books";
import { AllBooksContent } from "@/components/AllBooksContent";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Best Audiobooks for Audible Credits (3,900+ Ranked by Value)',
  description:
    'The best audiobooks for Audible credits in 2026. Browse 3,900+ titles ranked by Value Score, cost per hour, and rating. Filter by genre, length, and rating to find the highest-value books and maximize every credit.',
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
    title: 'Best Audiobooks for Audible Credits (3,900+ Ranked by Value)',
    description:
      'Browse 3,900+ audiobooks ranked by Value Score. Find the best books to spend your Audible credits on and maximize every credit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Audiobooks for Audible Credits (3,900+ Ranked by Value)',
    description:
      'Browse 3,900+ audiobooks ranked by Value Score. Filter by length, rating, and genre to find the highest-value books for your Audible credits.',
  },
};

export default function AllBooksPage() {
  // /books 是静态页（无 dynamic 导出），全量数据在构建期渲染进静态 HTML，
  // 不计入每次请求回源的 FOT。直接喂全量 3945 本给 BookExplorer，
  // 翻页 + 搜索/筛选立即基于完整数据集生效，与 /category/[slug] 行为一致。
  const allBooks = getAllBooks();
  return <AllBooksContent books={allBooks.map(toListBook)} />;
}

