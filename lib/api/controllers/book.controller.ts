/**
 * 书籍控制器
 * 封装书籍相关业务逻辑，供 API 路由和页面调用
 *
 * 职责：
 * - 调用数据层获取数据
 * - 应用业务规则（过滤、排序、分页）
 * - 返回标准化响应
 */

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

/**
 * 获取书籍列表（支持过滤、排序、分页）
 */
export function getBookList(query: BookListQuery): BookListResponse {
  const { sort = 'valueScore', page = 1, pageSize = 50, ...filters } = query;

  let books = getAllBooks();

  // 应用过滤
  if (filters.keyword || filters.durationRange || filters.minRating || filters.category) {
    books = filterBooks(books, filters);
  }

  // 应用排序
  books = sortBooks(books, sort);

  // 分页
  const total = books.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const pagedBooks = books.slice(start, start + pageSize);

  return {
    books: pagedBooks,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * 获取单个书籍详情
 */
export function getBookDetail(asin: string): Book | undefined {
  return getBookByAsin(asin);
}

/**
 * 获取 Top N 书籍
 */
export function getTopBookList(limit = 20): Book[] {
  return getTopBooks(limit);
}

/**
 * 按分类获取书籍
 */
export function getBooksByCategoryList(category: string): Book[] {
  return getBooksByCategory(category);
}

/**
 * 批量获取书籍（按 ASIN 列表）
 */
export function getBooksByAsinList(asins: string[]): Book[] {
  return getBooksByAsins(asins);
}

/**
 * 获取全部分类
 */
export function getCategories(): string[] {
  return getAllCategories();
}

/**
 * 排序逻辑
 */
function sortBooks(books: Book[], sort: SortOption): Book[] {
  const sorted = [...books];
  switch (sort) {
    case 'valueScore':
      return sorted.sort((a, b) => b.valueScore - a.valueScore);
    case 'rating':
      return sorted.sort((a, b) => b.starRating - a.starRating);
    case 'duration':
      return sorted.sort((a, b) => b.runtimeHours - a.runtimeHours);
    case 'price':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}
