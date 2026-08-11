import { getAllSeries } from "@/lib/data/series";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Audiobook Series - Browse Complete Series for Audible Credits",
  description:
    "Browse complete audiobook series ranked by credit value. Find every book in Wheel of Time, Stormlight Archive, Mistborn, and more.",
  alternates: { canonical: buildCanonicalUrl("/series") },
  openGraph: {
    title: "Audiobook Series for Audible Credits",
    description:
      "Browse complete audiobook series ranked by credit value. Find every book in your favorite series.",
  },
};

export default function SeriesListPage() {
  const seriesList = getAllSeries();

  return (
    <div className="container-content py-6 md:py-8">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Audiobook Series
        </h1>
      </div>
      <p className="text-sm text-text-secondary mb-8">
        Browse complete audiobook series. Each page lists every book in the series
        with Value Scores, so you can decide which books are worth your credits.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {seriesList.map(function (s) {
          return (
            <Link
              key={s.slug}
              href={"/series/" + s.slug}
              className="p-4 rounded-lg border border-border bg-bg-surface hover:border-primary transition-colors group"
            >
              <h2 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                {s.name}
              </h2>
              <p className="text-xs text-text-muted mt-1">
                {s.author} &middot; {s.books.length} books &middot; {s.totalHours}+ hours
              </p>
              <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                {s.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                Browse Series <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
