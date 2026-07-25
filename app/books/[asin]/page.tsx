import { notFound } from 'next/navigation';
import { getBookDetail, getTopBookList } from '@/lib/api/controllers/book.controller';
import { BookJsonLd } from '@/components/seo/JsonLd';
import { BookDetailContent } from '@/components/BookDetailContent';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { formatRating, formatDuration } from '@/lib/utils/format';
import type { Metadata } from 'next';

export const revalidate = 604800; // ISR: 7天再生

interface PageProps {
  params: { asin: string };
}

export function generateStaticParams() {
  return getTopBookList(123).map((book) => ({ asin: book.asin }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const book = getBookDetail(params.asin);
  if (!book) {
    return { title: 'Book Not Found' };
  }
  return {
    title: `${book.title} by ${book.author} - Value Score ${book.valueScore}`,
    description: `Is ${book.title} worth an Audible credit? Value Score ${book.valueScore}, ${formatRating(book.starRating)} rating, ${formatDuration(book.runtimeMinutes)} runtime. Decide with data.`,
    alternates: { canonical: buildCanonicalUrl(`/books/${book.asin}`) },
    openGraph: {
      title: book.title,
      description: `Value Score: ${book.valueScore} | ${formatRating(book.starRating)} stars | ${formatDuration(book.runtimeMinutes)}`,
      images: [{ url: book.coverImageUrl }],
      type: 'book',
    },
  };
}

export default function BookDetailPage({ params }: PageProps) {
  const book = getBookDetail(params.asin);
  if (!book) notFound();

  return (
    <>
      <BookJsonLd book={book} />
      <BookDetailContent book={book} />
    </>
  );
}
