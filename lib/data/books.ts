/**
 * 数据访问层
 * 集中加载静态 JSON 数据 + 计算分数
 * 所有页面通过此模块获取数据，避免重复逻辑
 *
 * 2026-09-20 Vercel Deployment Storage 优化：
 *   books.json 的 description 字段（占 55%，拆前 3.89MB）已剥离到 books-desc.json。
 *   - books.json 11.87MB → 5.94MB（-50%），19 个引用点的静态 import 不再内联大文本
 *   - description 改为**按需动态加载**（见 getBookDescription），仅图书详情页会拉取
 *   详见 data/_archive/README.md 与 SEO2026/day48/vercel-usage-optimization-plan.md
 */

import booksRaw from '@/data/books.json';
import curatedListsRaw from '@/data/curated-lists.json';
import categoriesRaw from '@/data/categories.json';
import type { Book, BookRawData, CompareBook, CuratedList, ListBook } from '@/lib/types';
import { calculateAllScores } from '@/lib/calc/value-score';
import { getAuthorSlug, getNarratorSlug, splitNames } from '@/lib/utils/slug';

// 过滤占位符书籍：PENDING_*/FINAL_* 为数据管道未处理完成的标记，
// 不应出现在站点或 sitemap 中（防止定时任务或脏数据污染线上）
const VALID_BOOKS = (booksRaw as BookRawData[]).filter(
  (b) => !b.asin.startsWith('PENDING_') && !b.asin.startsWith('FINAL_')
);

// 计算分数后的全量数据（模块级缓存）
// 注：类型仍为 Book（BookRawData 的 description 为可选，此处缺失属合法状态）
const allBooks: Book[] = calculateAllScores(VALID_BOOKS);

/**
 * 按需读取书籍描述（异步，避免大 JSON 进入静态 import 图）
 *
 * description 已拆到 data/books-desc.json（~4.06MB），**仅图书详情页调用**。
 * 使用动态 import 使 webpack 将其切成独立 chunk，不进主 bundle / 不内联到
 * 其余 18 个引用 @/lib/data/books 的模块。
 *
 * ⚠️ 必须在 **Server Component** 中 await（客户端组件请改为从接口取）。
 */
export async function getBookDescription(asin: string): Promise<string | undefined> {
  const mod = await import('@/data/books-desc.json');
  const map = (mod.default ?? mod) as Record<string, string>;
  return map[asin];
}

/**
 * 同步取得「有描述」的 ASIN 集合（供 sitemap / 构建期批量判定使用）
 *
 * ⚠️ 会同步加载整个 books-desc.json（~4MB）。仅允许在**构建期**或
 * 低频路径（sitemap 生成、generateStaticParams）调用，**禁止在页面渲染路径**中使用。
 * 页面级描述读取请用 getBookDescription（异步/按需）。
 */
export function getAsinsWithDescription(): Set<string> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const map = require('@/data/books-desc.json') as Record<string, string>;
  const set = new Set<string>();
  for (const [asin, desc] of Object.entries(map)) {
    if (typeof desc === 'string' && desc.trim()) set.add(asin);
  }
  return set;
}

export function getAllBooks(): Book[] {
  return allBooks;
}

/** Real total of valid, scored books (PENDING_/FINAL_ filtered out). */
export function getBookCount(): number {
  return allBooks.length;
}

/**
 * 裁剪为列表/首页版
 * 注：description 已在数据层剥离，此处保留解构是为兼容历史调用点（无害）。
 */
export function toListBook(book: Book): ListBook {
  const { description: _drop, ...rest } = book;
  return rest;
}

/** 裁剪为比较页版：仅保留对比界面所需字段（payload 再降到 ~250KB） */
export function toCompareBook(book: Book): CompareBook {
  return {
    asin: book.asin,
    title: book.title,
    author: book.author,
    narrator: book.narrator,
    runtimeMinutes: book.runtimeMinutes,
    price: book.price,
    starRating: book.starRating,
    reviewCount: book.reviewCount,
    valueScore: book.valueScore,
    costPerHour: book.costPerHour,
    creditWorth: book.creditWorth,
  };
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

export function getNarrators(): string[] {
  const set = new Set<string>();
  allBooks.forEach((book) => {
    if (book.narrator) {
      // Split by comma to get individual narrators
      book.narrator.split(',').forEach((n) => {
        const name = n.trim();
        if (name) set.add(name);
      });
    }
  });
  return Array.from(set).sort();
}

export function getCuratedLists(): CuratedList[] {
  return curatedListsRaw as CuratedList[];
}

/** 首页精选合集 — 按价值评分和覆盖面选择 6 个代表性合集 */
export function getFeaturedCuratedLists(): CuratedList[] {
  const featuredSlugs = [
    'best-fantasy-for-credits',
    'best-science-fiction-for-credits',
    'best-long-audiobooks-for-credits',
    'best-history-for-credits',
    'best-biography-for-credits',
    'best-self-help-audiobooks',
  ];
  return (curatedListsRaw as CuratedList[]).filter((l) =>
    featuredSlugs.includes(l.slug)
  );
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
    narrator?: string;
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

    // Narrator filter
    if (filters.narrator) {
      if (!book.narrator || !book.narrator.toLowerCase().includes(filters.narrator.toLowerCase())) return false;
    }

    return true;
  });
}

/**
 * 获取某本书在其主分类中的 Value Score 排名（从 1 开始）
 * 返回 null 表示未找到或无分类
 */
export function findCategoryRank(asin: string): { rank: number; total: number; category: string } | null {
  const cat = allBooks.find(b => b.asin === asin)?.categories?.[0];
  if (!cat) return null;
  const ranked = [...allBooks].sort((a, b) => b.valueScore - a.valueScore);
  const idx = ranked.findIndex(b => b.asin === asin);
  if (idx < 0) return null;
  return { rank: idx + 1, total: ranked.length, category: cat };
}

/**
 * 获取作者 slug（URL 友好格式）
 */
export { getAuthorSlug, splitNames };

/**
 * 获取所有作者 slug（按个体拆分，避免超长 slug 导致构建失败）
 */
export function getAllAuthorSlugs(): string[] {
  const slugs = new Set<string>();
  for (const book of allBooks) {
    for (const name of splitNames(book.author)) {
      const slug = getAuthorSlug(name);
      if (slug) slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

/**
 * 获取某作者的所有书籍（支持多作者拆分配对）
 */
export function getAuthorBooks(authorName: string): Book[] {
  const target = authorName.toLowerCase();
  return allBooks.filter((b) =>
    splitNames(b.author).some((n) => n.toLowerCase() === target)
  );
}

/**
 * 获取旁白 slug（URL 友好格式）
 */
export { getNarratorSlug };

/**
 * 获取所有旁白 slug（按个体拆分，避免超长 slug 导致构建失败）
 */
export function getAllNarratorSlugs(): string[] {
  const slugs = new Set<string>();
  for (const book of allBooks) {
    for (const name of splitNames(book.narrator)) {
      const slug = getNarratorSlug(name);
      if (slug) slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

/**
 * 获取某旁白朗读了的所有书籍（支持多旁白拆分配对）
 */
export function getNarratorBooks(narratorName: string): Book[] {
  const target = narratorName.toLowerCase();
  return allBooks.filter((b) =>
    b.narrator && splitNames(b.narrator).some((n) => n.toLowerCase() === target)
  );
}