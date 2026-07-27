import { getAllBooks } from '@/lib/data/books';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { CompareContent } from '@/components/CompareContent';
import type { Metadata } from 'next';

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
  const books = getAllBooks();
  return <CompareContent books={books} />;
}