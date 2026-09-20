#!/usr/bin/env node
/**
 * scripts/generate-books-data.mjs
 * 构建时生成客户端懒加载数据（public/data/*.json），供 BookExplorer / CompareContent 使用。
 *
 * 替代之前的 force-static API 路由（每次部署都产生 ISR Write）；
 * public/ 静态文件构建时直接进 origin，零 ISR Write，且可加强缓存。
 *
 * 纯 ESM：直接读 data/books.json（已含 valueScore/costPerHour/creditWorth 派生字段），
 * 过滤 PENDING_/FINAL_ 占位符，按需裁剪字段。
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 2026-09-20 重构（Vercel Deployment Storage 优化）：
 *
 *   【1-B 内容哈希】产物文件名带 md5 内容哈希，tail 长度 8：
 *       books-index.{hash}.json / books-chunk-000.{hash}.json ...
 *   内容不变 → 文件名不变 → Vercel 跨部署复用旧对象，**新增 0 字节**。
 *   （此前文件名固定，每次部署 8.53MB 全部计为新对象，是 Deployment Storage
 *     突破 3.9GB 的直接原因。）
 *
 *   【1-D 索引 + 分片】books-list.json（5.94MB 全量单文件）拆为：
 *       books-index.json   ~1.2MB  搜索/筛选/排序所需最小字段（客户端首屏拉这个）
 *       books-chunk-NNN    ~270KB  按 chunkSize 切片的完整列表数据，按需拉取
 *   单次部署 public/data 体积 8.53MB → ~1.2MB（-86%）。
 *
 *   books-manifest.json 是**唯一入口**：调用方读它拿真实文件名，不要硬编码。
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = process.cwd();
const VALID_BOOKS = JSON.parse(readFileSync(join(ROOT, 'data/books.json'), 'utf8'))
  .filter((b) => !b.asin.startsWith('PENDING_') && !b.asin.startsWith('FINAL_'));

const h = (s) => createHash('md5').update(s).digest('hex').slice(0, 8);

// ── 列表版：剔除 description（description 已由 1-E 拆到 books-desc.json） ──
const list = VALID_BOOKS.map(({ description: _drop, ...rest }) => rest);

// ── 对比版：仅 11 字段（与 lib/data/books.ts 的 toCompareBook 一致） ──
const COMPARE_FIELDS = [
  'asin', 'title', 'author', 'narrator', 'runtimeMinutes',
  'price', 'starRating', 'reviewCount', 'valueScore', 'costPerHour', 'creditWorth',
];
const compare = VALID_BOOKS.map((b) => Object.fromEntries(COMPARE_FIELDS.map((k) => [k, b[k]])));

// ── 索引：按「基础层 + 增量层」分层 ──
// 核心洞察（见 SEO2026/day48/_opt-insight.txt）：
//   books.json 每天 append 新书，但**历史书几乎不再改动**。
//   若把索引切成固定大小的「基础片」，则每日 append 只会影响**最后一片**，
//   前面所有片的内容与哈希完全不变 → Vercel 复用旧对象 → 每日新增 ≈ 0。
//   若用单个大 index 文件，任何一天的变化都会重写整个 3.2MB。
//
// 因此：索引同样分片（chunkSizeBig，比数据分片大，减少请求数），
//       客户端按需拉取，或先拉首片（valueScore 最高的部分）做首屏。
const CHUNK_SIZE = 500;

const IMAGE_BASE = 'https://m.media-amazon.com/images/';
const INDEX_FIELDS = [
  'asin', 'title', 'author',
  'runtimeMinutes', 'runtimeHours', 'price', 'starRating', 'reviewCount',
  'valueScore', 'costPerHour', 'creditWorth',
];
const toIndexBook = (b) => {
  const o = {};
  for (const k of INDEX_FIELDS) o[k] = b[k];
  // 图片：裁掉固定前缀，只留 /I/xxx.jpg（客户端用 manifest.imageBase 拼回）
  o.i = typeof b.coverImageUrl === 'string' && b.coverImageUrl.startsWith(IMAGE_BASE)
    ? b.coverImageUrl.slice(IMAGE_BASE.length)
    : (b.coverImageUrl || '');
  o.mainCategory = Array.isArray(b.categories) && b.categories.length ? b.categories[0] : '';
  return o;
};

// ── 数据分片：完整 list 按 chunkSize 切片（与索引同序，便于按下标映射） ──
const chunks = [];
for (let i = 0; i < list.length; i += CHUNK_SIZE) {
  chunks.push(list.slice(i, i + CHUNK_SIZE));
}

// ── 索引分片：与数据分片**一一对应**（同片号 = 同批书），
//    这样客户端「按片加载」时能同时拿到索引与详情，逻辑最简。
const indexChunks = [];
for (let i = 0; i < VALID_BOOKS.length; i += CHUNK_SIZE) {
  indexChunks.push(VALID_BOOKS.slice(i, i + CHUNK_SIZE).map(toIndexBook));
}

const outDir = join(ROOT, 'public', 'data');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// ── 清理上一轮产物（文件名带哈希，不清理会无限累积） ──
let cleaned = 0;
for (const f of readdirSync(outDir)) {
  if (/^(books-(index|chunk|idxchunk|cmpchunk)-\d+|books-(compare|manifest))(\.[0-9a-f]{8})?\.json$/.test(f)) {
    try { unlinkSync(join(outDir, f)); cleaned++; } catch {}
  }
}

// ── 写出（带内容哈希） ──
const wrote = [];
function emit(baseName, data) {
  const body = JSON.stringify(data);
  const hash = h(body);
  const file = `${baseName}.${hash}.json`;
  writeFileSync(join(outDir, file), body);
  const rec = { file, bytes: Buffer.byteLength(body), baseName };
  wrote.push(rec);
  return { ...rec, hash, count: Array.isArray(data) ? data.length : undefined };
}

// ── 对比数据同样分片 ──
// compare 原为单个 2.65MB 文件，每天全量重写 → 是分片化之后**剩余的最大日增量**。
// 复用同一 CHUNK_SIZE 切片后，每日 append 同样只影响末片。
const compareChunks = [];
for (let i = 0; i < compare.length; i += CHUNK_SIZE) {
  compareChunks.push(compare.slice(i, i + CHUNK_SIZE));
}

// 索引分片 + 数据分片（同片号一一对应）
const idxChunkRes = indexChunks.map((c, i) =>
  emit(`books-idxchunk-${String(i).padStart(3, '0')}`, c));
const chunkRes = chunks.map((c, i) =>
  emit(`books-chunk-${String(i).padStart(3, '0')}`, c));
const cmpChunkRes = compareChunks.map((c, i) =>
  emit(`books-cmpchunk-${String(i).padStart(3, '0')}`, c));

// ── manifest：客户端与 next.config 的唯一真值来源 ──
// 1-B：**不使用 `new Date()`** —— 那会让 manifest 每次构建都变，破坏幂等性，
//      使其永远无法被 Vercel 跨部署复用。改为从**内容本身**派生：
//      dataVersion 取全部分片哈希拼接后的短哈希 → 内容相同则版本相同 → 文件可复用。
const contentFingerprint = h(
  [...idxChunkRes, ...chunkRes, ...cmpChunkRes].map((c) => c.hash).join(''),
);
const manifest = {
  // 内容指纹，非时间戳（保证幂等）
  dataVersion: contentFingerprint,
  totalBooks: list.length,
  chunkSize: CHUNK_SIZE,
  chunkCount: chunks.length,
  // 索引里 coverImageUrl 被裁成 o.i（相对路径），客户端用此前缀拼回
  imageBase: IMAGE_BASE,
  // 对比数据：同样分片（与索引/数据片同号切片，便于按需加载）
  compare: {
    bytes: cmpChunkRes.reduce((a, c) => a + c.bytes, 0),
    chunkCount: cmpChunkRes.length,
    chunks: cmpChunkRes.map((c, i) => ({
      url: `/data/${c.file}`,
      bytes: c.bytes,
      hash: c.hash,
      count: c.count,
      start: i * CHUNK_SIZE,
      end: Math.min(i * CHUNK_SIZE + CHUNK_SIZE, compare.length),
    })),
  },
  // 索引分片与数据分片一一对应：indexChunks[n] 描述的是 chunks[n] 这批书
  indexChunks: idxChunkRes.map((c, i) => ({
    url: `/data/${c.file}`,
    bytes: c.bytes,
    hash: c.hash,
    count: c.count,
    start: i * CHUNK_SIZE,
    end: Math.min(i * CHUNK_SIZE + CHUNK_SIZE, list.length),
  })),
  chunks: chunkRes.map((c, i) => ({
    url: `/data/${c.file}`,
    bytes: c.bytes,
    hash: c.hash,
    count: c.count,
    start: i * CHUNK_SIZE,
    end: Math.min(i * CHUNK_SIZE + CHUNK_SIZE, list.length),
  })),
};
// manifest 自身不带哈希（它是入口，文件名必须稳定）
writeFileSync(join(outDir, 'books-manifest.json'), JSON.stringify(manifest, null, 2));

// ── 报告 ──
const totalBytes = wrote.reduce((a, b) => a + b.bytes, 0);
const kb = (n) => (n / 1024).toFixed(0) + 'KB';
const idxBytes = idxChunkRes.reduce((a, c) => a + c.bytes, 0);
const dataBytes = chunkRes.reduce((a, c) => a + c.bytes, 0);
const cmpBytes = cmpChunkRes.reduce((a, c) => a + c.bytes, 0);
L0(`[generate-books-data] ${list.length} books → ${chunks.length} 片 × ${CHUNK_SIZE}`);
L0(`[generate-books-data] 清理旧产物 ${cleaned} 个`);
L0(`[generate-books-data] 索引分片 ${chunks.length} 个, 合计 ${kb(idxBytes)}, 单片 ≈ ${kb(idxChunkRes[0].bytes)}`);
L0(`[generate-books-data] 数据分片 ${chunks.length} 个, 合计 ${kb(dataBytes)}, 单片 ≈ ${kb(chunkRes[0].bytes)}`);
L0(`[generate-books-data] 对比分片 ${cmpChunkRes.length} 个, 合计 ${kb(cmpBytes)}, 单片 ≈ ${kb(cmpChunkRes[0].bytes)}`);
L0(`[generate-books-data] manifest  books-manifest.json`);
L0(`[generate-books-data] public/data 合计 ${(totalBytes / 1024 / 1024).toFixed(2)}MB`);
const dailyDelta = idxChunkRes[0].bytes + chunkRes[0].bytes + cmpChunkRes[0].bytes + 8192;
L0(`[generate-books-data] ⚡ 每日 append 50 本 → 仅末片(索引+数据+对比)变化 ≈ ${kb(dailyDelta)}（旧版 8.53MB，-${(100 - dailyDelta / (8.53 * 1024 * 1024) * 100).toFixed(1)}%）`);

function L0(s) { console.log(s); }
