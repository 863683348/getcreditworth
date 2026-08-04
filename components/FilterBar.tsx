'use client';

import { Clock, Star, Tag } from 'lucide-react';
import { FILTER_OPTIONS } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

interface FilterBarProps {
  duration: string;
  minRating: number;
  category: string;
  categories: string[];
  onDurationChange: (value: string) => void;
  onRatingChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
  resultCount: number;
  narrator: string;
  narrators: string[];
  onNarratorChange: (value: string) => void;
}

const SELECT_BASE =
  'appearance-none pl-8 pr-8 py-2 rounded-md border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer';

export function FilterBar({
  duration,
  minRating,
  category,
  categories,
  onDurationChange,
  onRatingChange,
  onCategoryChange,
  resultCount,
  narrator,
  narrators,
  onNarratorChange,
}: FilterBarProps) {
  const { t } = useI18n();

  // Build duration labels with i18n
  const durationLabels: Record<string, string> = {
    all: t.filter.allDurations,
    short: '< 10h',
    medium: '10-20h',
    long: '20-30h',
    epic: '30h+',
  };

  // Build rating labels with i18n
  const ratingLabels: Record<string, string> = {
    '0': t.filter.allRatings,
    '4': '4.0+',
    '4.5': '4.5+',
    '4.7': '4.7+',
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-3 bg-bg-surface rounded-lg border border-border">
      <div className="flex flex-wrap gap-3 flex-1">
        {/* Duration */}
        <div className="relative">
          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <select
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            className={SELECT_BASE}
            aria-label={t.filter.duration}
          >
            {FILTER_OPTIONS.duration.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {durationLabels[opt.value] ?? opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="relative">
          <Star className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <select
            value={minRating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            className={SELECT_BASE}
            aria-label={t.filter.rating}
          >
            {FILTER_OPTIONS.rating.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {ratingLabels[String(opt.value)] ?? opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={SELECT_BASE}
            aria-label={t.filter.allCategories}
          >
            <option value="all">{t.filter.allCategories}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* Narrator */}
        <div className="relative">
          <select
            value={narrator}
            onChange={(e) => onNarratorChange(e.target.value)}
            className={SELECT_BASE}
            aria-label="Narrator"
          >
            <option value="">All Narrators</option>
            {narrators.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

      {/* Result count */}
      <div className="text-xs text-text-muted whitespace-nowrap">
        <span className="font-mono font-medium text-text-secondary">{resultCount}</span> {t.filter.books}
      </div>
    </div>
  );
}
