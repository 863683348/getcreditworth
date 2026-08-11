#!/usr/bin/env node
/**
 * scripts/generate-books-data.mjs
 * 构建时生成 public/data/books-list.json 和 books-compare.json，
 * 供 BookExplorer / CompareContent 客户端懒加载使用。
 *
 * 替代之前的 force-static API 路由（每次部署都产生 ISR Write）；
 * public/ 静态文件构建时直接进 origin，零 ISR Write，且可加 immutable 强缓存。
 *
 * 纯 ESM：直接读 data/books.json（已含 valueScore/costPerHour/creditWorth 派生字段），
 * 过滤 PENDING_/FINAL_ 占位符，按需裁剪字段。无需 ts loader / tsx / path alias。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const VALID_BOOKS = JSON.parse(readFileSync(join(ROOT, 'data/books.json'), 'utf8'))
  .filter((b) => !b.asin.startsWith('PENDING_') && !b.asin.startsWith('FINAL_'));

// 列表版：剔除 description（保留其他全部字段，含 valueScore 等派生）
const list = VALID_BOOKS.map(({ description: _drop, ...rest }) => rest);

// 对比版：仅 11 字段（与 lib/data/books.ts 的 toCompareBook 一致）
const COMPARE_FIELDS = [
  'asin', 'title', 'author', 'narrator', 'runtimeMinutes',
  'price', 'starRating', 'reviewCount', 'valueScore', 'costPerHour', 'creditWorth',
];
const compare = VALID_BOOKS.map((b) => Object.fromEntries(COMPARE_FIELDS.map((k) => [k, b[k]])));

const outDir = join(ROOT, 'public', 'data');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const listPath = join(outDir, 'books-list.json');
const comparePath = join(outDir, 'books-compare.json');
writeFileSync(listPath, JSON.stringify(list));
writeFileSync(comparePath, JSON.stringify(compare));

console.log(`[generate-books-data] wrote ${list.length} list books (${(JSON.stringify(list).length / 1024).toFixed(0)}KB) -> ${listPath}`);
console.log(`[generate-books-data] wrote ${compare.length} compare books (${(JSON.stringify(compare).length / 1024).toFixed(0)}KB) -> ${comparePath}`);
