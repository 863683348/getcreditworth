'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface SeriesNavProps {
  seriesName: string;
  seriesSlug: string;
  currentTitle: string;
  prevAsin: string | null;
  nextAsin: string | null;
  prevTitle: string | null;
  nextTitle: string | null;
  totalBooks: number;
  currentIndex: number;
}

export function SeriesNav({
  seriesName,
  seriesSlug,
  currentTitle,
  prevAsin,
  nextAsin,
  prevTitle,
  nextTitle,
  totalBooks,
  currentIndex,
}: SeriesNavProps) {
  return (
    <div className="mt-8 p-4 bg-bg-surface rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <Link
          href={'/series/' + seriesSlug}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {seriesName}
        </Link>
        <span className="text-xs text-text-muted">
          Book {currentIndex + 1} of {totalBooks}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        {prevAsin ? (
          <Link
            href={'/books/' + prevAsin}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors group flex-1 min-w-0"
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            <span className="truncate group-hover:underline">{prevTitle ?? ""}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextAsin ? (
          <Link
            href={'/books/' + nextAsin}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors group flex-1 min-w-0 justify-end text-right"
          >
            <span className="truncate group-hover:underline">{nextTitle ?? ""}</span>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
