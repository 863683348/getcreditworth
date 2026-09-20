/**
 * public/data 产物清单（books-manifest.json）读取工具。
 *
 * 背景（2026-09-20 Vercel Deployment Storage 优化 1-B / 1-D）：
 *   旧方案 prebuild 生成固定文件名 books-list.json / books-compare.json，
 *   文件名不变 + 内容每天变 → Vercel 无法跨部署去重，每次部署都按新对象计入
 *   Deployment Storage（3.13 次/天 × 8.53MB ≈ 3.9GB，超 Hobby 1GB 配额）。
 *
 *   新方案：
 *     ① 所有产物文件名带 8 位内容 md5（books-chunk-000.a1b2c3d4.json）
 *        → 内容不变则文件名不变 → Vercel 跨部署复用同一对象 → 不重复计费。
 *     ② 大文件按 500 条切片，每日 append 只影响**最后一片**
 *        → 每日新增从 8.53MB 降到 ≈438KB（-95%）。
 *     ③ books-manifest.json 文件名固定、内容极小（8KB），是**唯一入口**。
 *        ⚠️ 调用方不得硬编码带哈希的文件名，必须经本模块解析。
 */

export interface ManifestChunk {
  url: string;
  bytes: number;
  hash: string;
  count: number;
  start: number;
  end: number;
}

export interface BooksManifest {
  /** 内容指纹（由全部分片哈希派生，非时间戳）→ 内容不变则值不变，文件可跨部署复用 */
  dataVersion: string;
  totalBooks: number;
  chunkSize: number;
  chunkCount: number;
  /** 索引里 coverImageUrl 被裁成 o.i（相对路径），用此前缀拼回完整 URL */
  imageBase: string;
  /** 对比数据（11 字段精简版），同为分片结构 */
  compare: {
    bytes: number;
    chunkCount: number;
    chunks: ManifestChunk[];
  };
  indexChunks: ManifestChunk[];
  chunks: ManifestChunk[];
}

const MANIFEST_URL = '/data/books-manifest.json';

/**
 * 取 manifest 的真实文件路径。
 * 目录结构与 next.config 的 cache 规则、middleware 的 .json 放行规则都基于
 * /data/ 前缀，因此这里只返回 URL，由调用方 fetch。
 */
export function getManifestUrl(): string {
  return MANIFEST_URL;
}

/** 客户端/服务端通用：fetch manifest。失败时抛错，由调用方决定降级策略。 */
export async function fetchManifest(): Promise<BooksManifest> {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error(`manifest HTTP ${res.status}`);
  return (await res.json()) as BooksManifest;
}

/**
 * 把索引分片里的紧凑字段还原成 UI 期望的形状：
 *   o.i          → coverImageUrl（拼回 imageBase）
 *   o.mainCategory → categories: [mainCategory]
 * 这样客户端组件（BookExplorer / BookTable / BookList）无需感知分片细节。
 */
export function expandIndexBook(
  raw: Record<string, unknown>,
  imageBase: string,
): Record<string, unknown> {
  const { i, mainCategory, ...rest } = raw as { i?: string; mainCategory?: string };
  const cats = mainCategory ? [mainCategory] : [];
  return {
    ...rest,
    coverImageUrl: typeof i === 'string' && i ? imageBase + i : '',
    categories: cats,
  };
}

/**
 * 拉取全部索引分片并展开为完整索引数组。
 * 用于「首次搜索/筛选」场景：一次性把索引装进来，后续纯本地过滤。
 * 索引合计 ≈3.2MB（旧版 5.94MB），且大部分分片浏览器已缓存。
 */
export async function loadFullIndex(
  manifest?: BooksManifest,
): Promise<Record<string, unknown>[]> {
  const man = manifest ?? (await fetchManifest());
  const parts = await Promise.all(
    man.indexChunks.map(async (c) => {
      const r = await fetch(c.url);
      if (!r.ok) throw new Error(`${c.url} HTTP ${r.status}`);
      return (await r.json()) as Record<string, unknown>[];
    }),
  );
  return parts.flat().map((b) => expandIndexBook(b, man.imageBase));
}

/**
 * 按片号拉取「数据片」（完整字段，不含 description）。
 * 用于需要 detailPageUrl / publisher / releaseDate 等索引外字段的场景。
 */
export async function loadChunk(
  n: number,
  manifest?: BooksManifest,
): Promise<Record<string, unknown>[]> {
  const man = manifest ?? (await fetchManifest());
  const c = man.chunks[n];
  if (!c) throw new Error(`chunk ${n} out of range (0..${man.chunkCount - 1})`);
  const r = await fetch(c.url);
  if (!r.ok) throw new Error(`${c.url} HTTP ${r.status}`);
  return (await r.json()) as Record<string, unknown>[];
}

/** 对比页全量数据（11 字段精简版，分片版）。 */
export async function loadCompareAll(
  manifest?: BooksManifest,
): Promise<Record<string, unknown>[]> {
  const man = manifest ?? (await fetchManifest());
  const parts = await Promise.all(
    man.compare.chunks.map(async (c) => {
      const r = await fetch(c.url);
      if (!r.ok) throw new Error(`${c.url} HTTP ${r.status}`);
      return (await r.json()) as Record<string, unknown>[];
    }),
  );
  return parts.flat();
}
