'use client';

import Link from 'next/link';
import { ListChecks, ChevronLeft, Calendar } from 'lucide-react';
import { BookList } from '@/components/BookList';
import { ItemListJsonLd } from '@/components/seo/JsonLd';
import { formatDate } from '@/lib/utils/format';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import { useI18n } from '@/lib/i18n';
import type { Book, CuratedList } from '@/lib/types';

interface CuratedDetailContentProps {
  list: CuratedList;
  books: Book[];
}

export function CuratedDetailContent({ list, books }: CuratedDetailContentProps) {
  const { t } = useI18n();

  return (
    <>
      <ItemListJsonLd books={books} name={list.title} />

      <div className="container-content py-6 md:py-8">
        <nav className="mb-6">
          <Link
            href="/curated"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.curatedDetail.allLists}
          </Link>
        </nav>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded">
              {list.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {list.title}
          </h1>
          <p className="text-sm text-text-secondary mb-2">{list.description}</p>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="h-3.5 w-3.5" />
            {t.curatedDetail.updated.replace('{date}', formatDate(list.updatedAt))} • {t.curatedDetail.booksCount.replace('{count}', String(books.length))}
          </p>
        </div>

        <BookList books={books} showRank={false} />
      </div>
    </>
  );
}
