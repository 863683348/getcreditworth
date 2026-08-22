import { getTopBooks, toListBook, getBookCount, getFeaturedCuratedLists } from "@/lib/data/books";
import { HomeContent } from "@/components/HomeContent";
import { SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";

// trigger rebuild: inline NEXT_PUBLIC_AMAZON_AFFILIATE_TAG_IT into client bundle

export const metadata: Metadata = {
  title: 'How Much Is an Audible Credit Worth? ($14.95 Real Value)',
  description:
    'How much is an Audible credit worth? Find out with our free calculator — see which 3,900+ audiobooks are worth a credit and which to buy directly.',
  keywords: [
    'how much is an audible credit worth',
    'audible credit value',
    'audible credit calculator',
    'best audiobooks for credits',
    'audible credit optimizer',
    'is audible credit worth it',
    'audible credit worth 2026',
    'audible credit value calculator',
    'best books to use audible credit on',
    'audible credit vs buy',
  ],
  alternates: {
    canonical: "/",
  },
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
    title: 'How Much Is an Audible Credit Worth? ($14.95 Real Value)',
    description:
      'Find out the real value of an Audible credit with our free calculator. 3,900+ audiobooks ranked by Value Score, cost per hour, and credit worth.',
    type: 'website',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Audible Credit Calculator — find the real value of your credits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Much Is an Audible Credit Worth? ($14.95 Real Value)',
    description:
      'Free Audible credit value calculator. 3,900+ audiobooks ranked by Value Score to help you stop wasting credits.',
    images: ['/og-image.svg'],
  },
};

export default function HomePage() {
  // Fast Origin Transfer 优化：首页仅渲染 Top 30（排行展示），
  // 全量 3,900+ 本由 BookExplorer 通过 /api/books/list 客户端懒加载（搜索功能不受影响）。
  // 原实现 getAllBooks() 全量内联进 RSC payload ~2.3MB，每次回源都是大 FOT。
  const topBooks = getTopBooks(30).map(toListBook);
  const bookCount = getBookCount();
  const featuredLists = getFeaturedCuratedLists();

  return <HomeContent topBooks={topBooks} totalBooks={bookCount} featuredLists={featuredLists} />;
}

