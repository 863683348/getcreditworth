/**
 * 书籍描述访问（server-only）
 *
 * 背景（2026-09-20 Vercel Deployment Storage 优化 1-E）：
 *   books.json 的 description 字段占 55%（拆前 3.89MB），已剥离到
 *   data/books-desc.json。books.json 因此 11.87MB → 5.94MB（-50%）。
 *
 * 为什么单独成模块：
 *   lib/data/books.ts 被多个 'use client' 组件引用。若在那里 import
 *   node:fs，webpack 会在 client bundle 中解析 node 内置模块并报错。
 *   因此把「读文件」的实现隔离到本模块，books.ts 只做 re-export。
 *
 * ⚠️ 本模块依赖 node:fs，只能在 Server Component / API 路由 / 构建期使用。
 *    客户端组件请走 app/api/books/[asin]/route.ts。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DESC_PATH = join(process.cwd(), 'data', 'books-desc.json');

// 模块级缓存（避免每次调用重新读 4.25MB / 重新遍历 ~11000 条）
let _descMap: Record<string, string> | null = null;
let _descAsins: Set<string> | null = null;

function descMap(): Record<string, string> {
  if (_descMap === null) {
    _descMap = JSON.parse(readFileSync(DESC_PATH, 'utf8')) as Record<string, string>;
  }
  return _descMap;
}

/**
 * 读取单本书的描述（异步，兼容调用方的 await）。
 *
 * 返回 Promise 而非同步值：旧的实现用动态 import 切 chunk，调用点已写
 * `await getBookDescription(...)`，这里保持签名不变。
 */
export async function getBookDescription(asin: string): Promise<string | undefined> {
  return descMap()[asin];
}

/**
 * 「有描述」的 ASIN 集合 —— 供 sitemap 的低质量门禁判定使用。
 *
 * 当前唯一调用点：app/sitemap.ts（构建期 / 服务端）。
 * 结果缓存；集合内的 ASIN 顺序不重要。
 *
 * ⚠️ 页面渲染路径请改用 getBookDescription()，不要调用本函数
 *    （它会一次性物化全部 ASIN，只适合构建期批量判定）。
 */
export function getAsinsWithDescription(): Set<string> {
  if (_descAsins === null) {
    _descAsins = new Set<string>();
    for (const [asin, desc] of Object.entries(descMap())) {
      if (typeof desc === 'string' && desc.trim()) _descAsins.add(asin);
    }
  }
  return _descAsins;
}
