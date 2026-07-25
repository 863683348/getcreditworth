import { notFound } from "next/navigation";
import {
  getBookDetail,
  getBookAsins,
} from "@/lib/api/controllers/book.controller";
import { BookDetailContent } from "@/components/BookDetailContent";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { formatPrice } from "@/lib/utils/format";
import type { Metadata } from "next";

export const revalidate = 86400;

interface PageProps {
  params: { asin: string };
}

export function generateStaticParams() {
  return getBookAsins().map((asin) => ({ asin }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const book = getBookDetail(params.asin);
  if (!book) return { title: "Book Not Found" };

  const title = `${book.title} by ${book.author} - Audible Credit Value & Value Score`;
  const description = `${book.title} audiobook by ${book.author}: $${book.costPerHour.toFixed(2)}/hr, Value Score ${book.valueScore.toFixed(1)}, ${book.starRating.toFixed(1)} stars from ${book.reviewCount.toLocaleString()} reviews. Is this audiobook worth your Audible credit? View full analysis.`;

  return {
    title,
    description,
    keywords: [
      `${book.title} audible`,
      `${book.title} audiobook value`,
      `${book.author} audiobook credit worth`,
    ],
    alternates: { canonical: buildCanonicalUrl(`/books/${book.asin}`) },
    openGraph: {
      title,
      description,
      type: "book",
      images: [{ url: book.coverImageUrl, alt: `${book.title} audiobook cover` }],
    },
  };
}

export default function BookDetailPage({ params }: PageProps) {
  const book = getBookDetail(params.asin);
  if (!book) notFound();
  return <BookDetailContent book={book} />;
}