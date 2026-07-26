import { getAllBooks } from "@/lib/data/books";
import { HomeContent } from "@/components/HomeContent";
import { SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'How Much Is an Audible Credit Worth? ($14.95 Real Value)',
  description:
    'How much is an Audible credit worth? Each credit costs $14.95 — find out the real value with our free calculator. See which of 300+ audiobooks are worth a credit and which to buy directly. Stop wasting credits today.',
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
      'Find out the real value of an Audible credit with our free calculator. 300+ audiobooks ranked by Value Score, cost per hour, and credit worth.',
    type: 'website',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Much Is an Audible Credit Worth? ($14.95 Real Value)',
    description:
      'Free Audible credit value calculator. 300+ audiobooks ranked by Value Score to help you stop wasting credits.',
  },
};

export default function HomePage() {
  const topBooks = getAllBooks();

  return <HomeContent topBooks={topBooks} />;
}

