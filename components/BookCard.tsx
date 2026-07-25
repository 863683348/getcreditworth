'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, DollarSign, Headphones, ExternalLink } from 'lucide-react';
import type { Book } from '@/lib/types';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { buildRedirectUrl } from '@/lib/utils/affiliate';
import {
  formatDuration,
  formatPrice,
  formatRating,
  formatNumber,
} from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';

interface BookCardProps {
  book: Book;
  rank?: number;
  variant?: 'default' | 'compact' | 'detailed';
}

export function BookCard({ book, rank, variant = 'default' }: BookCardProps) {
  const { t } = useI18n();
  const redirectUrl = buildRedirectUrl(book.asin);

  return (
    <article className="card p-4 flex gap-4">
      {/* Rank */}
      {rank !== undefined && (
        <div className="flex-shrink-0 flex items-start pt-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary font-mono font-bold text-sm">
            {rank}
          </span>
        </div>
      )}

      {/* Cover */}
      <div className="flex-shrink-0 w-16 sm:w-20">
        <Link href={`/books/${book.asin}`} className="block">
          <div className="aspect-ratio-book-cover relative overflow-hidden rounded-md bg-bg-surface">
            <Image
              src={book.coverImageUrl}
              alt={t.bookCard.coverAlt.replace('{title}', book.title)}
              fill
              sizes="(max-width: 640px) 64px, 80px"
              className="object-cover"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0 flex-1">
            <Link href={`/books/${book.asin}`}>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-text-primary hover:text-primary line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-text-secondary mt-0.5">
              {t.bookCard.by} {book.author}
            </p>
          </div>
          <ValueScoreBadge score={book.valueScore} size="sm" showLabel={false} />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary mt-2">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
            <span className="font-mono font-medium text-text-primary">
              {formatRating(book.starRating)}
            </span>
            <span className="text-text-muted">
              ({formatNumber(book.reviewCount)})
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono">{formatDuration(book.runtimeMinutes)}</span>
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            <span className="font-mono">{formatPrice(book.price)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Headphones className="h-3.5 w-3.5" />
            <span className="font-mono">${book.costPerHour.toFixed(2)}{t.bookCard.perHour}</span>
          </span>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center gap-2">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn btn-primary text-xs py-1.5 px-3"
          >
            {t.bookCard.useCredit}
            <ExternalLink className="h-3 w-3" />
          </a>
          <Link
            href={`/books/${book.asin}`}
            className="btn btn-outline text-xs py-1.5 px-3"
          >
            {t.bookCard.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
