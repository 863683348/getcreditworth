/**
 * 前端 API 客户端
 * 封装所有后端 API 调用，供客户端组件使用
 *
 * 架构：前端组件 → apiClient → /api/* → controller → data layer
 *
 * 注意：Server 组件（page.tsx）可直接调用 controller（SSG/ISR 时直连后端）
 *       Client 组件（*Content.tsx）通过 apiClient 调用 API（运行时）
 */

import type { Book, CuratedList, SortOption } from '@/lib/types';
import type { BlogPost } from '@/data/blog/posts';
import type { BookListResponse } from '@/lib/api/controllers/book.controller';
import type { CuratedListWithBooks } from '@/lib/api/controllers/curated.controller';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

interface FetchOptions {
  signal?: AbortSignal;
}

async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    signal: options?.signal,
  });

  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data as T;
}

// ===== Books =====

export const apiClient = {
  /**
   * 获取书籍列表（分页、过滤、排序）
   */
  async getBooks(params: {
    keyword?: string;
    duration?: string;
    rating?: number;
    category?: string;
    sort?: SortOption;
    page?: number;
    pageSize?: number;
  }): Promise<BookListResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        searchParams.set(key, String(value));
      }
    });
    return apiFetch<BookListResponse>(`/api/books?${searchParams.toString()}`);
  },

  /**
   * 获取 Top N 书籍
   */
  async getTopBooks(limit = 20): Promise<Book[]> {
    return apiFetch<Book[]>(`/api/books?limit=${limit}`);
  },

  /**
   * 获取单本书籍详情
   */
  async getBook(asin: string): Promise<Book> {
    return apiFetch<Book>(`/api/books/${asin}`);
  },

  // ===== Curated Lists =====

  /**
   * 获取全部精选榜单
   */
  async getCuratedLists(): Promise<CuratedList[]> {
    return apiFetch<CuratedList[]>(`/api/curated`);
  },

  /**
   * 获取单个精选榜单（含书籍）
   */
  async getCuratedList(slug: string): Promise<CuratedListWithBooks> {
    return apiFetch<CuratedListWithBooks>(`/api/curated/${slug}`);
  },

  // ===== Blog =====

  /**
   * 获取全部博客文章
   */
  async getBlogPosts(): Promise<BlogPost[]> {
    return apiFetch<BlogPost[]>(`/api/blog`);
  },

  // ===== Categories =====

  /**
   * 获取全部分类
   */
  async getCategories(): Promise<string[]> {
    return apiFetch<string[]>(`/api/categories`);
  },
};
