'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Pagination } from '@/components/Pagination';
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
  /** 可选：全量数据 URL（如 /data/books-list.json）。提供时挂载后客户端懒加载替换数据，
   *  搜索/筛选范围扩展为全量；不提供时行为不变（仅用传入 books）。 */
  allBooksUrl?: string;
}

export function BookExplorer({
  books,
  showRank = true,
  title,
  emptyMessage,
  allBooksUrl,
}: BookExplorerProps) {
  const { t } = useI18n();
  const [allBooks, setAllBooks] = useState(books);
  const [keyword, setKeyword] = useState('');
  const [duration, setDuration] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [category, setCategory] = useState('all');
  const [narrator, setNarrator] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  
  const allNarrators = useMemo(() => {
    const set = new Set<string>();
    allBooks.forEach((book) => {
      if (book.narrator) {
        book.narrator.split(',').forEach((n) => {
          const name = n.trim();
          if (name) set.add(name);
        });
      }
    });
    return Array.from(set).sort();
  }, [allBooks]);

  const allCategories = useMemo(() => {
    const counts = new Map<string, number>();
    allBooks.forEach((book) => {
      book.categories.forEach((c) => {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      });
    });
    // Only show categories with 4+ books — hide endangered categories to avoid thin filter pages
    return Array.from(counts.entries())
      .filter(([, count]) => count >= 4)
      .map(([cat]) => cat)
      .sort();
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    return filterBooks(allBooks, {
      keyword,
      durationRange: duration,
      minRating,
      category,
      narrator,
    });
  }, [allBooks, keyword, duration, minRating, category, narrator]);

  // 懒加载全量数据（搜索/筛选用），替换初始 Top N
  useEffect(() => {
    if (!allBooksUrl) return;
    let cancelled = false;
    fetch(allBooksUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: Book[]) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setAllBooks(data);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        // 静默失败：保持初始数据可用（搜索范围缩小但不白屏）
        console.error('BookExplorer: failed to load full list', err);
      });
    return () => {
      cancelled = true;
    };
  }, [allBooksUrl]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, duration, minRating, category, narrator]);

  // Paginate filtered books
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  // Global starting rank for the current page (1-based, continuous across pages)
  const startRank = (currentPage - 1) * pageSize + 1;

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

      <Pagination
        current={currentPage}
        total={filteredBooks.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />

      {title && filteredBooks.length > 0 && (
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      )}

      {viewMode === 'card' ? (
        <BookList
          books={paginatedBooks}
          showRank={showRank}
          startRank={startRank}
          emptyMessage={emptyMessage}
        />
      ) : (
        <BookTable
          books={paginatedBooks}
          showRank={showRank}
          startRank={startRank}
        />
      )}

      <Pagination
        current={currentPage}
        total={filteredBooks.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />
    </div>
  );
}

