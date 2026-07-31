'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { formatDuration, formatPrice, formatRating } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';
import { useRegion } from '@/components/RegionProvider';
import { buildRedirectUrl } from '@/lib/utils/affiliate';
import type { Book } from '@/lib/types';

interface PaginatedBookTableProps {
  books: Book[];
  pageSize?: number;
  showAuthor?: boolean;
  showDuration?: boolean;
  showPrice?: boolean;
}

const PAGE_SIZES = [50, 100, 200];

export function PaginatedBookTable({
  books,
  pageSize: defaultPageSize = 100,
  showAuthor = true,
  showDuration = true,
  showPrice = true,
}: PaginatedBookTableProps) {
  const { t } = useI18n();
  const { region } = useRegion();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.ceil(books.length / pageSize);
  const start = (page - 1) * pageSize;
  const paged = useMemo(function () {
    return books.slice(start, start + pageSize);
  }, [books, start, pageSize]);

  // Reset page when data changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  if (books.length === 0) {
    return <p className="text-sm text-text-secondary text-center py-8">{t.empty.noResults}</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-bg-surface border-b border-border">
              <th className="p-3 text-left font-semibold text-text-secondary">Rank</th>
              <th className="p-3 text-left font-semibold text-text-secondary">Title</th>
              {showAuthor && (
                <th className="p-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Author</th>
              )}
              {showDuration && (
                <th className="p-3 text-left font-semibold text-text-secondary hidden sm:table-cell">Duration</th>
              )}
              {showPrice && (
                <th className="p-3 text-left font-semibold text-text-secondary hidden md:table-cell">Price</th>
              )}
              <th className="p-3 text-left font-semibold text-text-secondary">Score</th>
              <th className="p-3 text-left font-semibold text-text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(function (book, idx) {
              return (
                <tr key={book.asin} className="border-b border-border hover:bg-bg-surface/50">
                  <td className="p-3 text-text-muted font-mono">{start + idx + 1}</td>
                  <td className="p-3">
                    <Link
                      href={"/books/" + book.asin}
                      className="font-medium text-text-primary hover:text-primary"
                    >
                      {book.title}
                    </Link>
                  </td>
                  {showAuthor && (
                    <td className="p-3 text-text-secondary hidden sm:table-cell">{book.author}</td>
                  )}
                  {showDuration && (
                    <td className="p-3 text-text-secondary hidden sm:table-cell">
                      {formatDuration(book.runtimeMinutes)}
                    </td>
                  )}
                  {showPrice && (
                    <td className="p-3 text-text-secondary hidden md:table-cell">
                      {formatPrice(book.price)}
                    </td>
                  )}
                  <td className="p-3">
                    <ValueScoreBadge score={book.valueScore} size="sm" />
                  </td>
                  <td className="p-3">
                    <a
                      href={buildRedirectUrl(book.asin, region)}
                      rel="nofollow sponsored"
                      className="inline-block px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark transition-colors"
                    >
                      {t.table.buy}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>{t.pagination.showing.replace("{from}", String(start + 1)).replace("{to}", String(Math.min(start + pageSize, books.length))).replace("{total}", String(books.length))}</span>
          <span className="hidden sm:inline">| {t.pagination.perPage}:</span>
          <select
            className="hidden sm:inline-block bg-bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary"
            value={pageSize}
            onChange={function (e) { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZES.map(function (s) {
              return <option key={s} value={s}>{s}</option>;
            })}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="btn btn-outline text-xs py-1.5 px-2.5 disabled:opacity-30"
            disabled={page <= 1}
            onClick={function () { setPage(page - 1); }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="ml-1 hidden sm:inline">{t.pagination.prev}</span>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, function (_, i) {
            var p: number;
            if (totalPages <= 5) p = i + 1;
            else if (page <= 3) p = i + 1;
            else if (page >= totalPages - 2) p = totalPages - 4 + i;
            else p = page - 2 + i;
            return (
              <button key={p}
                className={"w-8 h-8 text-xs rounded-md font-mono " + (p === page ? "bg-primary text-white" : "bg-bg-surface text-text-secondary hover:bg-border")}
                onClick={function () { setPage(p); }}
              >{p}</button>
            );
          })}

          <button
            className="btn btn-outline text-xs py-1.5 px-2.5 disabled:opacity-30"
            disabled={page >= totalPages}
            onClick={function () { setPage(page + 1); }}
          >
            <span className="mr-1 hidden sm:inline">{t.pagination.next}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
