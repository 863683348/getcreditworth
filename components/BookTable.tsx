'use client';

import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import type { Book } from '@/lib/types';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { buildAudibleProductUrl } from '@/lib/utils/affiliate';
import { formatDuration, formatPrice, formatRating, formatNumber } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';
import { useRegion } from '@/components/RegionProvider';
import { trackAffiliateClick } from '@/components/analytics/GoogleAnalytics';

interface BookTableProps {
  books: Book[];
  showRank?: boolean;
  startRank?: number;
}

export function BookTable({ books, showRank = true, startRank = 1 }: BookTableProps) {
  const { t } = useI18n();
  const { region } = useRegion();

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">{t.empty.noResults}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-bg-surface text-left">
            {showRank && (
              <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap">
                {t.table.rank}
              </th>
            )}
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap">
              {t.table.title}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap hidden md:table-cell">
              {t.table.author}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right">
              {t.table.duration}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right">
              {t.table.rating}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right hidden sm:table-cell">
              {t.table.price}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right">
              {t.table.valueScore}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right hidden lg:table-cell">
              {t.table.costPerHour}
            </th>
            <th className="py-2 px-2 sm:px-3 font-semibold text-text-secondary whitespace-nowrap text-right">
              {t.table.action}
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr
              key={book.asin}
              className="border-b border-border hover:bg-bg-surface transition-colors duration-100"
            >
              {showRank && (
                <td className="py-2 px-2 sm:px-3 text-text-muted font-mono text-xs">
                  {startRank + index}
                </td>
              )}
              <td className="py-2 px-2 sm:px-3">
                <Link
                  href={`/books/${book.asin}`}
                  className="font-serif font-medium text-text-primary hover:text-primary line-clamp-1"
                >
                  {book.title}
                </Link>
              </td>
              <td className="py-2 px-2 sm:px-3 text-text-secondary hidden md:table-cell">
                <span className="line-clamp-1">{book.author}</span>
              </td>
              <td className="py-2 px-2 sm:px-3 text-text-secondary font-mono text-xs text-right whitespace-nowrap">
                {formatDuration(book.runtimeMinutes)}
              </td>
              <td className="py-2 px-2 sm:px-3 text-right whitespace-nowrap">
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-accent fill-accent" />
                  <span className="font-mono font-medium text-text-primary text-xs">
                    {formatRating(book.starRating)}
                  </span>
                  <span className="text-text-muted text-xs hidden lg:inline">
                    ({formatNumber(book.reviewCount)})
                  </span>
                </span>
              </td>
              <td className="py-2 px-2 sm:px-3 text-text-secondary font-mono text-xs text-right whitespace-nowrap hidden sm:table-cell">
                {formatPrice(book.price)}
              </td>
              <td className="py-2 px-2 sm:px-3 text-right">
                <ValueScoreBadge score={book.valueScore} size="sm" showLabel={false} />
              </td>
              <td className="py-2 px-2 sm:px-3 text-text-secondary font-mono text-xs text-right whitespace-nowrap hidden lg:table-cell">
                ${book.costPerHour.toFixed(2)}/h
              </td>
              <td className="py-2 px-2 sm:px-3 text-right">
                <a
                  href={buildAudibleProductUrl(book.asin, region, book.title)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-0.5 text-xs text-primary hover:text-primary-hover font-medium whitespace-nowrap"
                  onClick={() => trackAffiliateClick({ linkType: "product", region, asin: book.asin })}
                >
                  {t.table.buy}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
