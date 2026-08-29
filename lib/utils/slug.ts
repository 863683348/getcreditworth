/**
 * 名字/多值字段 → slug 的纯函数工具
 * 抽离到无副作用的轻量模块，供客户端组件（BookCard / BookDetailContent）
 * 与结构化数据组件复用，避免为了在客户端算 slug 而 import 巨型 books.ts
 * （books.ts 加载 3MB+ books.json，一旦进入客户端 bundle 会拖垮首屏）。
 */

/** 拆分可能含多个作者/旁白的字段（逗号 / & / and 分隔），例如 "A, B & C" -> ["A", "B", "C"] */
export function splitNames(field?: string): string[] {
  if (!field) return [];
  return field
    .split(/,|&|\band\b/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** 单个名字 → URL slug（与 author/narrator 动态页解码逻辑一致：slugify 后再 decode 还原） */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAuthorSlug(author: string): string {
  return nameToSlug(author);
}

export function getNarratorSlug(narrator: string): string {
  return nameToSlug(narrator);
}
