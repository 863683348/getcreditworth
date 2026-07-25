'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Book } from '@/lib/types';
import { BookList } from '@/components/BookList';
import { BookTable } from '@/components/BookTable';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { ViewToggle, type ViewMode } from '@/components/ViewToggle';
import { filterBooks } from '@/lib/data/books';
import { useI18n } from '@/lib/i18n';

interface BookExplorerProps {
  books: Book[];
  showRank?: boolean;
  title?: string;
  emptyMessage?: string;
}

export function BookExplorer({
  books,
  showRank = true,
  title,
  emptyMessage,
}: BookExplorerProps) {
  const { t } = useI18n();
  const [keyword, setKeyword] = useState('');
  const [duration, setDuration] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [category, setCategory] = useState('all');
  const [narrator, setNarrator] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // 所有分类（从传入的 books 提取）
  const allNarrators = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      if (book.narrator) {
        book.narrator.split(',').forEach((n) => {
          const name = n.trim();
          if (name) set.add(name);
        });
      }
    });
    return Array.from(set).sort();
  }, [books]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      book.categories.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return filterBooks(books, {
      keyword,
      durationRange: duration,
      minRating,
      category,
      narrator,
    });
  }, [books, keyword, duration, minRating, category, narrator]);

  const handleSearch = useCallback((kw: string) => setKeyword(kw), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <FilterBar
            duration={duration}
            minRating={minRating}
            category={category}
            categories={allCategories}
            narrator={narrator}
            narrators={allNarrators}
            onDurationChange={setDuration}
            onRatingChange={setMinRating}
            onCategoryChange={setCategory}
            onNarratorChange={setNarrator}
            resultCount={filteredBooks.length}
          />
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {title && filteredBooks.length > 0 && (
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      )}

      {viewMode === 'card' ? (
        <BookList
          books={filteredBooks}
          showRank={showRank}
          emptyMessage={emptyMessage}
        />
      ) : (
        <BookTable books={filteredBooks} showRank={showRank} />
      )}
    </div>
  );
}
