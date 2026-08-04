/** 书籍控制器
 * 封装书籍相关业务逻辑，供 API 路由和页面调用 */

import type { Book, BookFilter, SortOption } from '@/lib/types';
import {
  getAllBooks,
  getBookByAsin,
  getBooksByAsins,
  getTopBooks,
  getBooksByCategory,
  filterBooks,
  getAllCategories,
} from '@/lib/data/books';

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookListQuery extends Partial<BookFilter> {
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export function getBookList(query: BookListQuery): BookListResponse {
  const { sort = 'valueScore', page = 1, pageSize = 50, ...filters } = query;
  let books = getAllBooks();
  if (filters.keyword || filters.durationRange || filters.minRating || filters.category) {
    books = filterBooks(books, filters);
  }
  books = sortBooks(books, sort);
  const total = books.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const pagedBooks = books.slice(start, start + pageSize);
  return { books: pagedBooks, total, page, pageSize, totalPages };
}

export function getBookDetail(asin: string): Book | undefined {
  return getBookByAsin(asin);
}

export function getBookAsins(): string[] {
  return getAllBooks().map((b) => b.asin);
}

export function getTopBookList(limit = 20): Book[] {
  return getTopBooks(limit);
}

export function getBooksByCategoryList(category: string): Book[] {
  return getBooksByCategory(category);
}

export function getBooksByAsinList(asins: string[]): Book[] {
  return getBooksByAsins(asins);
}

export function getCategories(): string[] {
  return getAllCategories();
}

function sortBooks(books: Book[], sort: SortOption): Book[] {
  const sorted = [...books];
  switch (sort) {
    case 'valueScore': return sorted.sort((a, b) => b.valueScore - a.valueScore);
    case 'rating': return sorted.sort((a, b) => b.starRating - a.starRating);
    case 'duration': return sorted.sort((a, b) => b.runtimeHours - a.runtimeHours);
    case 'price': return sorted.sort((a, b) => b.price - a.price);
    default: return sorted;
  }
}
