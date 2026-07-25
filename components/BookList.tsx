'use client';

import type { Book } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { useI18n } from '@/lib/i18n';

interface BookListProps {
  books: Book[];
  showRank?: boolean;
  emptyMessage?: string;
}

export function BookList({
  books,
  showRank = true,
  emptyMessage,
}: BookListProps) {
  const { t } = useI18n();

  const message = emptyMessage ?? t.empty.noResults;

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">{message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {books.map((book, index) => (
        <BookCard
          key={book.asin}
          book={book}
          rank={showRank ? index + 1 : undefined}
        />
      ))}
    </div>
  );
}
