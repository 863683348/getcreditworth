/**
 * 数据访问层
 * 集中加载静态 JSON 数据 + 计算分数
 * 所有页面通过此模块获取数据，避免重复逻辑
 */

import booksRaw from '@/data/books.json';
import curatedListsRaw from '@/data/curated-lists.json';
import categoriesRaw from '@/data/categories.json';
import type { Book, BookRawData, CuratedList } from '@/lib/types';
import { calculateAllScores } from '@/lib/calc/value-score';

// 计算分数后的全量数据（模块级缓存）
const allBooks: Book[] = calculateAllScores(booksRaw as BookRawData[]);

export function getAllBooks(): Book[] {
  return allBooks;
}

export function getBookByAsin(asin: string): Book | undefined {
  return allBooks.find((book) => book.asin === asin);
}

export function getBooksByAsins(asins: string[]): Book[] {
  return asins
    .map((asin) => allBooks.find((book) => book.asin === asin))
    .filter((book): book is Book => Boolean(book));
}

export function getTopBooks(limit = 50): Book[] {
  return [...allBooks]
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, limit);
}

export function getBooksByCategory(category: string): Book[] {
  if (category === 'all') return allBooks;
  return allBooks.filter((book) =>
    book.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  const categorySet = new Set<string>();
  allBooks.forEach((book) => {
    book.categories.forEach((c) => categorySet.add(c));
  });
  return Array.from(categorySet).sort();
}

export function getCuratedLists(): CuratedList[] {
  return curatedListsRaw as CuratedList[];
}

export function getCuratedList(slug: string): CuratedList | undefined {
  return (curatedListsRaw as CuratedList[]).find((list) => list.slug === slug);
}

export function getCategoryConfig() {
  return categoriesRaw;
}

/**
 * 搜索过滤（客户端用）
 */
export function filterBooks(
  books: Book[],
  filters: {
    keyword?: string;
    durationRange?: string;
    minRating?: number;
    category?: string;
  }
): Book[] {
  return books.filter((book) => {
    // 关键词
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(kw);
      const matchAuthor = book.author.toLowerCase().includes(kw);
      const matchNarrator = book.narrator?.toLowerCase().includes(kw) ?? false;
      if (!matchTitle && !matchAuthor && !matchNarrator) return false;
    }

    // 时长范围
    if (filters.durationRange && filters.durationRange !== 'all') {
      const parts = filters.durationRange.split('-').map(Number);
      const min = parts[0] ?? 0;
      const max = parts[1] ?? Number.MAX_SAFE_INTEGER;
      if (book.runtimeHours < min || book.runtimeHours > max) return false;
    }

    // 评分
    if (filters.minRating && filters.minRating > 0) {
      if (book.starRating < filters.minRating) return false;
    }

    // 分类
    if (filters.category && filters.category !== 'all') {
      if (!book.categories.some((c) => c.toLowerCase() === filters.category!.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
