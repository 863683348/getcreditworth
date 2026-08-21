/**
 * books.json 去重脚本（P0 技术债）
 *
 * 问题：books.json 6625 条但唯一 ASIN 仅 4823（204 个重复组 / 2006 条冗余）
 * 后果：sitemap 生成重复书 URL、重复静态页构建、稀释权重
 *
 * 策略：按 ASIN 分组，每组保留「字段完整度」最高的记录
 * 评分：description 非空 +3 / reviewCount>0 +2 / runtime>0 +1 / star>0 +1
 *       / author 非空 +1 / narrator 非空 +1 / cover 非空 +1 / 非 PENDING +1
 * 平局时保留排在后面的（后插入的通常字段更全）
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS_PATH = path.resolve(__dirname, '..', 'data', 'books.json');

function score(b) {
  let s = 0;
  if ((b.description || '').trim()) s += 3;
  if (Number(b.reviewCount) > 0) s += 2;
  if (Number(b.runtimeMinutes) > 0) s += 1;
  if (Number(b.starRating) > 0) s += 1;
  if ((b.author || '').trim()) s += 1;
  if ((b.narrator || '').trim()) s += 1;
  if ((b.coverImageUrl || '').trim()) s += 1;
  if (!String(b.asin).startsWith('PENDING_') && !String(b.asin).startsWith('FINAL_')) s += 1;
  return s;
}

const raw = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
const books = Array.isArray(raw) ? raw : raw.books;

console.log('去重前:', books.length, '条 | 唯一 ASIN:', new Set(books.map((b) => String(b.asin).trim())).size);

// 备份
const bak = path.join(os.tmpdir(), `books-dedupe-${Date.now()}.json`);
fs.copyFileSync(BOOKS_PATH, bak);
console.log('已备份:', bak);

// 按 asin 分组
const byAsin = new Map();
for (const b of books) {
  const k = String(b.asin).trim();
  if (!byAsin.has(k)) byAsin.set(k, []);
  byAsin.get(k).push(b);
}

// 每组保留最高分；平局保留最后一条（后插入）
const deduped = [];
let removed = 0;
for (const [, group] of byAsin) {
  if (group.length === 1) {
    deduped.push(group[0]);
    continue;
  }
  let best = group[0];
  let bestScore = score(group[0]);
  for (let i = 1; i < group.length; i++) {
    const sc = score(group[i]);
    // 严格大于才替换 → 平局保留后插入的（i 越大越靠后）
    if (sc > bestScore) { best = group[i]; bestScore = sc; }
  }
  deduped.push(best);
  removed += group.length - 1;
}

// 保持原有 valueScore 降序排序
deduped.sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));

fs.writeFileSync(BOOKS_PATH, JSON.stringify(deduped, null, 2) + '\n', 'utf8');

console.log('去重后:', deduped.length, '条 | 唯一 ASIN:', new Set(deduped.map((b) => String(b.asin).trim())).size);
console.log('移除冗余:', removed, '条');
console.log('PENDING_* 保留:', deduped.filter((b) => String(b.asin).startsWith('PENDING_')).length);
