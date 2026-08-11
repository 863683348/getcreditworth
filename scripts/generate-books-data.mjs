#!/usr/bin/env node
/**
 * scripts/generate-books-data.mjs
 * 构建时生成 public/data/books-list.json 和 books-compare.json，
 * 供 BookExplorer / CompareContent 客户端懒加载使用。
 *
 * 替代之前的 force-static API 路由（每个部署都会产生 ISR Write，超额爆表）；
 * public/ 静态文件构建时直接进 origin，零 ISR Write，且可加 immutable 强缓存。
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

/** 从源 .ts/.tsx 直接 import：注册 tsx loader，避免拉 ts-node 依赖 */
async function loadBooks() {
  const dataPath = join(process.cwd(), 'lib', 'data', 'books.ts');
  const url = pathToFileURL(dataPath).href;
  return await import(url);
}

const outDir = join(process.cwd(), 'public', 'data');
mkdirSync(outDir, { recursive: true });

const { getAllBooks, toListBook, toCompareBook } = await loadBooks();
const allBooks = getAllBooks();
const list = allBooks.map(toListBook);
const compare = allBooks.map(toCompareBook);

const listPath = join(outDir, 'books-list.json');
const comparePath = join(outDir, 'books-compare.json');
writeFileSync(listPath, JSON.stringify(list));
writeFileSync(comparePath, JSON.stringify(compare));

console.log(`[generate-books-data] wrote ${list.length} list books (${(JSON.stringify(list).length / 1024).toFixed(0)}KB) -> ${listPath}`);
console.log(`[generate-books-data] wrote ${compare.length} compare books (${(JSON.stringify(compare).length / 1024).toFixed(0)}KB) -> ${comparePath}`);
