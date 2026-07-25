import { getBookList } from '@/lib/api/controllers/book.controller';
import { AllBooksContent } from '@/components/AllBooksContent';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import type { Metadata } from 'next';

export const revalidate = 86400; // ISR: 24小时再生

export const metadata: Metadata = {
  title: 'All Audiobooks - Browse and Compare Value Scores',
  description:
    'Browse all audiobooks with Value Scores. Filter by duration, rating, and category to find the best books for your Audible credits.',
  alternates: { canonical: buildCanonicalUrl('/books') },
};

export default function AllBooksPage() {
  const result = getBookList({ pageSize: 200 });

  return <AllBooksContent books={result.books} />;
}
