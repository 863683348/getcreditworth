"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, DollarSign, Headphones, ExternalLink } from "lucide-react";
import type { Book } from "@/lib/types";
import { ValueScoreBadge } from "@/components/ValueScoreBadge";
import { buildRedirectUrl } from "@/lib/utils/affiliate";
import {
  formatDuration,
  formatPrice,
  formatRating,
  formatNumber,
} from "@/lib/utils/format";
import { useI18n } from "@/lib/i18n";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Heart } from "lucide-react";

interface BookCardProps {
  book: Book;
  rank?: number;
  variant?: "default" | "compact" | "detailed";
}

export function BookCard({ book, rank, variant = "default" }: BookCardProps) {
  const { t } = useI18n();
  const { toggleFavorite, isFavorite } = useFavorites();
  const redirectUrl = buildRedirectUrl(book.asin);

  return (
    <article className="card p-3 sm:p-4 flex gap-2 sm:gap-4">
      {/* Rank */}
      {rank !== undefined && (
        <div className="flex-shrink-0 flex items-start pt-0.5 sm:pt-1">
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-primary-50 text-primary font-mono font-bold text-xs sm:text-sm">
            {rank}
          </span>
        </div>
      )}

      {/* Cover */}
      <div className="flex-shrink-0 w-14 sm:w-16 md:w-20">
        <Link href={`/books/${book.asin}`} className="block">
          <div className="aspect-ratio-book-cover relative overflow-hidden rounded-md bg-bg-surface" style={{ aspectRatio: "3/5" }}>
            <Image
              src={book.coverImageUrl}
              alt={t.bookCard.coverAlt.replace("{title}", book.title)}
              fill
              sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
              className="object-cover"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 sm:gap-2 mb-0.5 sm:mb-1">
          <div className="min-w-0 flex-1">
            <Link href={`/books/${book.asin}`}>
              <h3 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-text-primary hover:text-primary line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5 truncate">
              {t.bookCard.by} {book.author}
            </p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(book.asin); }}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-bg-surface transition-colors"
            aria-label={isFavorite(book.asin) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite(book.asin) ? "fill-danger text-danger" : "text-text-muted"}`}
            />
          </button>
          <ValueScoreBadge score={book.valueScore} size="sm" showLabel={false} />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-text-secondary mt-1 sm:mt-2">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Star className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-accent fill-accent" />
            <span className="font-mono font-medium text-text-primary text-xs">
              {formatRating(book.starRating)}
            </span>
            <span className="text-text-muted hidden xs:inline">
              ({formatNumber(book.reviewCount)})
            </span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            <span className="font-mono text-xs">{formatDuration(book.runtimeMinutes)}</span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <DollarSign className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            <span className="font-mono text-xs">{formatPrice(book.price)}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 whitespace-nowrap">
            <Headphones className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">${book.costPerHour.toFixed(2)}{t.bookCard.perHour}</span>
          </span>
        </div>

        {/* CTA */}
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn btn-primary text-xs py-1.5 px-2.5 sm:px-3 min-h-[32px] sm:min-h-[36px]"
          >
            {t.bookCard.useCredit}
            <ExternalLink className="h-3 w-3" />
          </a>
          <Link
            href={`/books/${book.asin}`}
            className="btn btn-outline text-xs py-1.5 px-2.5 sm:px-3 min-h-[32px] sm:min-h-[36px]"
          >
            {t.bookCard.details}
          </Link>
        </div>
      </div>
    </article>
  );
}