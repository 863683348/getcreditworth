import { notFound } from "next/navigation";
import {
  getSeriesBySlug,
  getSeriesSlugs,
  getSeriesWithBooks,
  getAllSeries,
} from "@/lib/data/series";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { formatDuration, formatPrice, formatRating } from "@/lib/utils/format";
import { ValueScoreBadge } from "@/components/ValueScoreBadge";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { RegionAffiliateLink } from "@/components/RegionAffiliateLink";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getSeriesSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const series = getSeriesBySlug(params.slug);
  if (!series) return { title: "Series Not Found" };

  const title = series.name + " Audiobooks - Complete Series List for Audible";
  const description =
    "Every book in " +
    series.name +
    " ranked by Value Score. " +
    series.books.length +
    " books, " +
    series.totalHours +
    "+ hours total. " +
    series.description.substring(0, 100);

  return {
    title,
    description,
    alternates: { canonical: buildCanonicalUrl("/series/" + series.slug) },
    openGraph: {
      title,
      description,
    },
  };
}

export const dynamicParams = false;

export default function SeriesDetailPage({ params }: PageProps) {
  const series = getSeriesWithBooks(params.slug);
  if (!series) notFound();

  const allSeries = getAllSeries();
  const currentIdx = allSeries.findIndex(function (s) { return s.slug === params.slug; });
  const prevSeries = currentIdx > 0 ? allSeries[currentIdx - 1] : null;
  const nextSeries = currentIdx < allSeries.length - 1 ? allSeries[currentIdx + 1] : null;

  return (
    <div className="container-content py-6 md:py-8">
      <Link
        href="/series"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> All Series
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {series.name}
        </h1>
      </div>
      <p className="text-sm text-text-muted mb-1">
        by {series.author} &middot; {series.books.length} books &middot;{" "}
        {series.totalHours}+ hours total
      </p>
      <p className="text-sm text-text-secondary mb-8 max-w-2xl">
        {series.description}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-bg-surface border-b border-border">
              <th className="p-3 text-left font-semibold text-text-secondary">#</th>
              <th className="p-3 text-left font-semibold text-text-secondary">Title</th>
              <th className="p-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Duration</th>
              <th className="p-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Rating</th>
              <th className="p-3 text-left font-semibold text-text-secondary hidden md:table-cell">Price</th>
              <th className="p-3 text-left font-semibold text-text-secondary">Value Score</th>
              <th className="p-3 text-left font-semibold text-text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            {series.resolvedBooks.map(function (book, idx) {
              return (
                <tr key={book.asin} className="border-b border-border hover:bg-bg-surface/50">
                  <td className="p-3 text-text-muted font-mono">{idx + 1}</td>
                  <td className="p-3">
                    <Link
                      href={"/books/" + book.asin}
                      className="font-medium text-text-primary hover:text-primary"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="p-3 text-text-secondary hidden sm:table-cell">
                    {formatDuration(book.runtimeMinutes)}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {formatRating(book.starRating)}
                  </td>
                  <td className="p-3 text-text-secondary hidden md:table-cell">
                    {formatPrice(book.price)}
                  </td>
                  <td className="p-3">
                    <ValueScoreBadge score={book.valueScore} size="sm" />
                  </td>
                  <td className="p-3">
                    <RegionAffiliateLink
                      asin={book.asin}
                      className="inline-block px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Buy
                    </RegionAffiliateLink>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        {prevSeries ? (
          <Link
            href={"/series/" + prevSeries.slug}
            className="text-sm text-text-secondary hover:text-primary"
          >
            &larr; {prevSeries.name}
          </Link>
        ) : (
          <div />
        )}
        {nextSeries ? (
          <Link
            href={"/series/" + nextSeries.slug}
            className="text-sm text-text-secondary hover:text-primary"
          >
            {nextSeries.name} &rarr;
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
