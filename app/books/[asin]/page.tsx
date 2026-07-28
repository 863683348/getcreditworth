import { notFound } from "next/navigation";
import {
  getBookDetail,
  getBookAsins,
} from "@/lib/api/controllers/book.controller";
import { BookDetailContent } from "@/components/BookDetailContent";
import { BookJsonLd, BreadcrumbListJsonLd, FaqPageJsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { formatPrice } from "@/lib/utils/format";
import { AUDIBLE_CREDIT_VALUE } from "@/lib/config";
import { getBooksByCategoryList } from "@/lib/api/controllers/book.controller";
import { findBookSeries } from "@/lib/data/series";
import { SeriesNav } from "@/components/SeriesNav";
import { getAllBooks } from "@/lib/data/books";
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

  const title = `${book.title} by ${book.author} - Value Score & Audible Credit Review`;
  const verdict = book.valueScore >= 8 ? 'Excellent credit value' : book.valueScore >= 5 ? 'Good credit value' : 'Better to buy directly';
  const description = `Is ${book.title} worth an Audible credit? ${verdict}. Value Score ${book.valueScore.toFixed(1)}, $${book.costPerHour.toFixed(2)}/hr, ${book.starRating.toFixed(1)} stars from ${book.reviewCount.toLocaleString()} reviews, ${book.runtimeHours.toFixed(1)} hours. See the full credit analysis before you spend.`;
  const titleLower = book.title.toLowerCase();
  const keywords = [
    `${book.title} audible`,
    `${book.title} audiobook review`,
    `${book.title} worth a credit`,
    `${book.author} audiobook credit value`,
    `${book.title} value score`,
    `is ${titleLower} worth an audible credit`,
    `${book.title} credit worth it`,
    `${book.title} cost per hour`,
    `audible credit value ${titleLower}`,
    `${book.title} audible review 2026`,
    ...book.categories.slice(0,3).map(c => `${c.toLowerCase()} audiobooks credits`),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: buildCanonicalUrl(`/books/${book.asin}`) },
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
      title,
      description,
      type: "book",
      url: buildCanonicalUrl(`/books/${book.asin}`),
      images: [{ url: book.coverImageUrl, alt: `${book.title} audiobook cover` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [book.coverImageUrl],
    },
  };
}

export default function BookDetailPage({ params }: PageProps) {
  const book = getBookDetail(params.asin);
  if (!book) notFound();

  // Related books: same first category, exclude current, top 5 by value score
  const mainCategory = book.categories[0];
  const relatedBooks = mainCategory
    ? getBooksByCategoryList(mainCategory)
        .filter((b) => b.asin !== book.asin)
        .sort((a, b) => b.valueScore - a.valueScore)
        .slice(0, 5)
    : getAllBooks()
        .filter((b) => b.asin !== book.asin)
        .sort((a, b) => b.valueScore - a.valueScore)
        .slice(0, 5);

  const savingsVsCredit = book.price - AUDIBLE_CREDIT_VALUE;
  const worthUsingCredit = savingsVsCredit > 0;
  const canonicalUrl = buildCanonicalUrl(`/books/${book.asin}`);

  // FAQ structured data for rich snippets — 差异化每本书的 FAQ
  const faqQuestions: { question: string; answer: string }[] = [
    {
      question: `Is ${book.title} worth an Audible credit?`,
      answer: `${book.title} has a Value Score of ${book.valueScore.toFixed(1)}, costs ${formatPrice(book.price)}, and runs ${book.runtimeHours.toFixed(1)} hours. ${worthUsingCredit ? `Using a credit saves you ${formatPrice(savingsVsCredit)} compared to buying directly. This book offers solid credit value.` : `The book costs less than a credit (${formatPrice(AUDIBLE_CREDIT_VALUE)}), so buying directly may be better value.`} See the full analysis on this page.`,
    },
    {
      question: `Who narrates ${book.title} on Audible?`,
      answer: `${book.title} by ${book.author} is narrated by ${book.narrator || 'an Audible narrator'}${book.narrator ? ', bringing the story to life with professional voice performance' : ''}. The audiobook runs ${book.runtimeHours.toFixed(1)} hours (${book.runtimeMinutes} minutes) total.`,
    },
    {
      question: `What genre is ${book.title}?`,
      answer: `${book.title} falls under ${book.categories.slice(0, 3).join(', ')} on Audible. Written by ${book.author}, it has a ${book.starRating.toFixed(1)}-star rating from ${book.reviewCount.toLocaleString()} reviews and a Value Score of ${book.valueScore.toFixed(1)}.`,
    },
    {
      question: `How does ${book.title} compare to other audiobooks on credit value?`,
      answer: `${book.title} has a cost per hour of ${formatPrice(book.costPerHour)} when using an Audible credit. With a Value Score of ${book.valueScore.toFixed(1)} (${book.valueScore >= 8 ? 'excellent' : book.valueScore >= 5 ? 'good' : 'moderate'}), it ranks among ${book.categories[0] || 'popular'} audiobooks. ${book.description ? book.description.split('. ').slice(0, 1).join('. ') + '.' : ''}`,
    },
  ];

  // Remove narrator question if no narrator data
  if (!book.narrator) {
    faqQuestions.splice(1, 1);
  }

  return (
    <>
      <BookDetailContent book={book} relatedBooks={relatedBooks} />
      {function () {
        var info = findBookSeries(book.title);
        if (!info) return null;
        return (
          <div className="container-content">
            <SeriesNav
              seriesName={info.series.name}
              seriesSlug={info.series.slug}
              currentTitle={book.title}
              prevAsin={info.prevAsin}
              nextAsin={info.nextAsin}
              prevTitle={info.prevAsin && info.index > 0 ? info.series.books[info.index - 1] : ""}
              nextTitle={info.nextAsin && info.index < info.series.books.length - 1 ? info.series.books[info.index + 1] : ""}
              totalBooks={info.series.books.length}
              currentIndex={info.index}
            />
          </div>
        );
      }()}
      <BookJsonLd book={book} />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "All Books", url: "/books" },
          { name: book.title, url: `/books/${book.asin}` },
        ]}
      />
      <FaqPageJsonLd questions={faqQuestions} />
    </>
  );
}