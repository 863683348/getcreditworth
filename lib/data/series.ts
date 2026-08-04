/**
 * 系列数据访问层（扩展版，含 ASIN 解析）
 */

import seriesRaw from '@/data/series.json';
import { getAllBooks } from './books';
import type { Book } from '@/lib/types';

export interface SeriesMeta {
  slug: string;
  name: string;
  author: string;
  description: string;
  books: string[];
  totalHours: number;
}

export interface SeriesWithBooks extends SeriesMeta {
  totalBooks: number;
  resolvedBooks: Book[];
}

export interface BookSeriesInfo {
  series: SeriesMeta;
  index: number;
  prevAsin: string | null;
  nextAsin: string | null;
}

const seriesList = seriesRaw as SeriesMeta[];

export function getAllSeries(): SeriesMeta[] {
  return seriesList;
}

export function getSeriesBySlug(slug: string): SeriesMeta | undefined {
  return seriesList.find((s) => s.slug === slug);
}

export function getSeriesSlugs(): string[] {
  return seriesList.map((s) => s.slug);
}

export function getSeriesWithBooks(slug: string): SeriesWithBooks | undefined {
  const meta = getSeriesBySlug(slug);
  if (!meta) return undefined;

  const titleMap = buildTitleMap();
  const resolvedBooks: Book[] = [];
  for (const title of meta.books) {
    const book = titleMap.get(title.toLowerCase().trim());
    if (book) resolvedBooks.push(book);
  }

  return {
    ...meta,
    totalBooks: meta.books.length,
    resolvedBooks,
  };
}

/**
 * 查找一本书所属的系列及前后册 ASIN
 */
export function findBookSeries(bookTitle: string): BookSeriesInfo | undefined {
  const key = bookTitle.toLowerCase().trim();

  for (const series of seriesList) {
    const idx = series.books.findIndex((b) => b.toLowerCase().trim() === key);
    if (idx >= 0) {
      const titleMap = buildTitleMap();
      const prevAsin =
        idx > 0
          ? titleMap.get((series.books[idx - 1] ?? "").toLowerCase().trim())?.asin || null
          : null;
      const nextAsin =
          idx < series.books.length - 1
            ? titleMap.get((series.books[idx + 1] ?? "").toLowerCase().trim())?.asin || null
            : null;

      return { series, index: idx, prevAsin, nextAsin };
    }
  }

  return undefined;
}

function buildTitleMap(): Map<string, Book> {
  const all = getAllBooks();
  const map = new Map<string, Book>();
  for (const b of all) {
    const key = b.title.toLowerCase().trim();
    if (!map.has(key)) map.set(key, b);
  }
  return map;
}

export function getSeriesTotalCount(): number {
  return seriesList.length;
}
