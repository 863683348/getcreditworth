import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { CalculatorContent } from "@/components/CalculatorContent";
import { CalculatorWidget } from "@/components/CalculatorWidget";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Audible Credit Value Calculator - Is Your Credit Worth It?',
  description:
    'Free Audible credit value calculator. Enter any Audible book and instantly see if it\'s worth your credit or if you should buy it directly. Stop wasting Audible credits on low-value audiobooks — calculate the real cost per hour now.',
  keywords: [
    'audible credit value calculator',
    'audible credit calculator',
    'how much is my audible credit worth',
    'audible credit optimizer',
    'audible credit worth calculator',
    'is my audible credit worth it',
    'audible credit cost per hour',
    'should i use audible credit',
    'audible credit vs buy directly',
    'calculate audible credit value',
  ],
  alternates: { canonical: buildCanonicalUrl("/calculator") },
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
    title: 'Audible Credit Value Calculator - Is Your Credit Worth It?',
    description:
      'Free Audible credit calculator. See how much your credits are worth and which books to spend them on. Stop wasting credits.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audible Credit Value Calculator - Is Your Credit Worth It?',
    description:
      'Free Audible credit calculator. Instantly see if a book is worth your credit or if you should buy it directly.',
  },
};

export default function CalculatorPage() {
  const topBooks = getTopBookList(200);
  return (
    <div className="container-content py-6 md:py-8">
      <CalculatorContent books={topBooks} />
      <CalculatorWidget books={topBooks} />
    </div>
  );
}

