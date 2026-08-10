'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { GitCompare, Search, X } from 'lucide-react';
import type { CompareBook } from '@/lib/types';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { formatDuration, formatPrice, formatRating } from '@/lib/utils/format';

const MAX_COMPARE = 4;

interface CompareContentProps {
  books: CompareBook[];
  /** 可选：全量对比数据 URL（如 /api/books/compare）。提供时挂载后客户端懒加载替换数据，
   *  搜索/选择范围扩展为全量；不提供时行为不变（仅用传入 books）。 */
  allBooksUrl?: string;
}

function CompareRow({ label, books }: { label: string; books: CompareBook[] }) {
  return (
    <tr className='border-b border-border'>
      <td className='p-3 font-medium text-text-secondary bg-bg-surface border border-border whitespace-nowrap'>{label}</td>
      {books.map((book, i) => (
        <td key={i} className='p-3 text-text-primary border border-border'>{getCellValue(label, book)}</td>
      ))}
      {Array.from({ length: MAX_COMPARE - books.length }).map((_, i) => (
        <td key={'empty' + i} className='p-3 border border-border bg-bg-surface/50'></td>
      ))}
    </tr>
  );

  function getCellValue(label: string, book: CompareBook): React.ReactNode {
    switch (label) {
      case 'Author': return book.author;
      case 'Narrator': return book.narrator || '-';
      case 'Price': return formatPrice(book.price);
      case 'Duration': return formatDuration(book.runtimeMinutes);
      case 'Rating': return formatRating(book.starRating);
      case 'Reviews': return book.reviewCount.toLocaleString();
      case 'Cost/Hour': return '$' + book.costPerHour.toFixed(2);
      case 'Credit Worth': return book.creditWorth.toFixed(2);
      case 'Value Score': return <ValueScoreBadge score={book.valueScore} size='sm' />;
      default: return '';
    }
  }
}

export function CompareContent({ books, allBooksUrl }: CompareContentProps) {
  const [allBooks, setAllBooks] = useState(books);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  // 懒加载全量对比数据（搜索/选择用），替换初始 Top N
  useEffect(() => {
    if (!allBooksUrl) return;
    let cancelled = false;
    fetch(allBooksUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: CompareBook[]) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setAllBooks(data);
        }
      })
      .catch((err) => {
        // 静默失败：保持初始数据可用（搜索范围缩小但不白屏）
        console.error('CompareContent: failed to load full list', err);
      });
    return () => {
      cancelled = true;
    };
  }, [allBooksUrl]);

  const filteredBooks = useMemo(() => {
    if (!search) return [];
    const kw = search.toLowerCase();
    return allBooks.filter(function(b) {
      return b.title.toLowerCase().includes(kw) ||
        b.author.toLowerCase().includes(kw) ||
        (b.narrator && b.narrator.toLowerCase().includes(kw));
    }).slice(0, 10);
  }, [allBooks, search]);

  const compareBooks = useMemo(function() {
    return allBooks.filter(function(b) { return selected.includes(b.asin); });
  }, [allBooks, selected]);

  function toggleBook(asin: string) {
    setSelected(function(prev) {
      if (prev.includes(asin)) {
        return prev.filter(function(a) { return a !== asin; });
      }
      if (prev.length < MAX_COMPARE) {
        return [...prev, asin];
      }
      return prev;
    });
  }

  return (
    <div className='container-content py-6 md:py-8'>
      <div className='flex items-center gap-2 mb-2'>
        <GitCompare className='h-5 w-5 text-primary' />
        <h1 className='text-2xl md:text-3xl font-bold text-text-primary'>Compare Audiobooks</h1>
      </div>
      <p className='text-sm text-text-secondary mb-6'>
        Select up to {MAX_COMPARE} audiobooks to compare side by side.
      </p>

      <div className='relative mb-6'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted' />
        <input
          type='text'
          value={search}
          onChange={function(e) { setSearch(e.target.value); }}
          placeholder='Search by title, author, or narrator...'
          className='w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-bg-base text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
        />
      </div>

      {search && (
        <div className='mb-6 p-3 bg-bg-surface rounded-lg border border-border max-h-60 overflow-y-auto'>
          {filteredBooks.length === 0 ? (
            <p className='text-sm text-text-secondary text-center py-4'>No results found.</p>
          ) : (
            filteredBooks.map(function(book) {
              var disabled = !selected.includes(book.asin) && selected.length >= MAX_COMPARE;
              return (
                <label key={book.asin}
                  className={'flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-bg-base transition-colors' +
                    (selected.includes(book.asin) ? ' bg-primary-50' : '') +
                    (disabled ? ' opacity-50' : '')}>
                  <input
                    type='checkbox'
                    checked={selected.includes(book.asin)}
                    onChange={function() { toggleBook(book.asin); }}
                    disabled={disabled}
                    className='accent-primary'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{book.title}</p>
                    <p className='text-xs text-text-secondary'>{book.author} - {formatDuration(book.runtimeMinutes)}</p>
                  </div>
                </label>
              );
            })
          )}
        </div>
      )}

      {compareBooks.length > 0 && (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr>
                <th className='p-3 text-left font-semibold text-text-secondary bg-bg-surface border border-border'></th>
                {compareBooks.map(function(book) {
                  return (
                    <th key={book.asin} className='p-3 text-left bg-bg-surface border border-border min-w-[180px]'>
                      <div className='flex items-start justify-between gap-1'>
                        <Link href={'/books/' + book.asin} className='font-semibold line-clamp-2 text-sm hover:text-primary'>{book.title}</Link>
                        <button onClick={function() { toggleBook(book.asin); }} className='flex-shrink-0 p-1 hover:bg-bg-base rounded'>
                          <X className='h-3 w-3 text-text-muted' />
                        </button>
                      </div>
                    </th>
                  );
                })}
                {Array.from({ length: MAX_COMPARE - compareBooks.length }).map(function(_, i) {
                  return <th key={'empty' + i} className='p-3 border border-border bg-bg-surface/50'></th>;
                })}
              </tr>
            </thead>
            <tbody>
              <CompareRow label='Author' books={compareBooks} />
              <CompareRow label='Narrator' books={compareBooks} />
              <CompareRow label='Price' books={compareBooks} />
              <CompareRow label='Duration' books={compareBooks} />
              <CompareRow label='Rating' books={compareBooks} />
              <CompareRow label='Reviews' books={compareBooks} />
              <CompareRow label='Cost/Hour' books={compareBooks} />
              <CompareRow label='Credit Worth' books={compareBooks} />
              <CompareRow label='Value Score' books={compareBooks} />
            </tbody>
          </table>
        </div>
      )}

      {compareBooks.length === 0 && (
        <div className='text-center py-16'>
          <GitCompare className='h-12 w-12 text-text-muted mx-auto mb-4' />
          <p className='text-text-secondary'>Search and select audiobooks above to compare.</p>
        </div>
      )}
    </div>
  );
}