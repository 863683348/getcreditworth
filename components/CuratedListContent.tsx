'use client';

import Link from 'next/link';
import { ListChecks, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';
import type { CuratedList } from '@/lib/types';

interface CuratedListContentProps {
  lists: CuratedList[];
}

export function CuratedListContent({ lists }: CuratedListContentProps) {
  const { t } = useI18n();

  return (
    <div className="container-content py-6 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            {t.curatedPage.title}
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          {t.curatedPage.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => (
          <Link
            key={list.slug}
            href={`/curated/${list.slug}`}
            className="card p-5 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="inline-block text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded mb-2">
                  {list.category}
                </span>
                <h2 className="font-serif text-lg font-semibold text-text-primary group-hover:text-primary mb-1">
                  {list.title}
                </h2>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {list.description}
                </p>
                <p className="text-xs text-text-muted mt-3">
                  {t.curatedPage.booksCount.replace('{count}', String(list.bookAsins.length))} • {t.curatedPage.updated.replace('{date}', formatDate(list.updatedAt))}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-primary flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
