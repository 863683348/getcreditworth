/**
 * 精选榜单控制器
 * 封装精选榜单相关业务逻辑
 */

import type { CuratedList } from '@/lib/types';
import type { Book } from '@/lib/types';
import { getCuratedLists, getCuratedList, getBooksByAsins } from '@/lib/data/books';

export interface CuratedListWithBooks extends CuratedList {
  books: Book[];
}

/**
 * 获取全部精选榜单
 */
export function getAllCuratedLists(): CuratedList[] {
  return getCuratedLists();
}

/**
 * 获取单个精选榜单（含书籍数据）
 */
export function getCuratedListDetail(slug: string): CuratedListWithBooks | undefined {
  const list = getCuratedList(slug);
  if (!list) return undefined;

  const books = getBooksByAsins(list.bookAsins);
  return { ...list, books };
}

/**
 * 获取精选榜单元数据（不含书籍）
 */
export function getCuratedListMeta(slug: string): CuratedList | undefined {
  return getCuratedList(slug);
}
