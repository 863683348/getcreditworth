'use client';

import { BookOpen } from 'lucide-react';
import type { Book } from '@/lib/types';
import { BookExplorer } from '@/components/BookExplorer';
import { ItemListJsonLd } from '@/components/seo/JsonLd';
import { useI18n } from '@/lib/i18n';

interface AllBooksContentProps {
  books: Book[];
}

export function AllBooksContent({ books }: AllBooksContentProps) {
  const { t } = useI18n();

  return (
    <>
      <ItemListJsonLd books={books} name="All Audiobooks" />

      <div className="container-content py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              {t.booksPage.title}
            </h1>
          </div>
          <p className="text-sm text-text-secondary">
            {t.booksPage.subtitle.replace('{count}', String(books.length))}
          </p>
        </div>

        <BookExplorer
          books={books}
          showRank={false}
          emptyMessage={t.home.emptyMessage}
        />
      </div>
    </>
  );
}
