/**
 * validate-posts.mjs
 * 校验 data/blog/posts.tsx 是否健康，防止损坏文件进入部署。
 *
 * 检查项：
 *  1. 重复 slug（会导致对象键覆盖 / 解析错位）
 *  2. 孤立逗号行（^\s*,$）
 *  3. 每个帖子缺必填字段：description / keywords / readTime / content
 *  4. 大括号是否平衡（粗略）
 *
 * 用法：node scripts/validate-posts.mjs [path]
 *  退出码 0 = 健康；1 = 有问题（供 CI / workflow 拦截）
 */

import { readFileSync } from 'fs';

const DEFAULT_PATH = 'data/blog/posts.tsx';

/**
 * @param {string} src  posts.tsx 源码
 * @returns {string[]}  问题描述数组（空 = 健康）
 */
export function validatePostsSource(src) {
  const issues = [];

  // 1. 提取所有帖子 slug（2 空格缩进的键）
  const slugRe = /^  '([^']+)':\s*\{/gm;
  const slugs = [];
  let m;
  while ((m = slugRe.exec(src)) !== null) slugs.push(m[1]);

  if (slugs.length === 0) {
    issues.push('未找到任何帖子条目（POSTS 可能为空或被破坏）');
    return issues;
  }

  // 2. 重复 slug
  const seen = new Set();
  for (const s of slugs) {
    if (seen.has(s)) issues.push(`重复 slug: ${s}`);
    seen.add(s);
  }

  // 3. 孤立逗号行
  if (/^\s*,$/m.test(src)) issues.push('发现孤立逗号行 (^\\s*,$)');

  // 4. 每个帖子必填字段
  const REQUIRED = ['description:', 'keywords:', 'readTime:', 'content:'];
  for (const s of slugs) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const blockRe = new RegExp(
      "^  '" + escaped + "': \\{([\\s\\S]*?)\\n  \\},",
      'm'
    );
    const blk = src.match(blockRe);
    if (!blk) {
      issues.push(`无法解析 slug 块: ${s}（可能缺少闭合 },）`);
      continue;
    }
    const body = blk[1];
    for (const f of REQUIRED) {
      if (!body.includes(f)) issues.push(`slug "${s}" 缺少必填字段: ${f}`);
    }
  }

  // 5. 粗略大括号平衡（仅统计顶级对象）
  const open = (src.match(/{/g) || []).length;
  const close = (src.match(/}/g) || []).length;
  if (open !== close) issues.push(`大括号不平衡: { = ${open}, } = ${close}`);

  return issues;
}

// CLI 入口
const invokedPath = process.argv[1] || '';
if (invokedPath.includes('validate-posts')) {
  const target = process.argv[2] || DEFAULT_PATH;
  let src;
  try {
    src = readFileSync(target, 'utf8');
  } catch (e) {
    console.error(`无法读取 ${target}: ${e.message}`);
    process.exit(1);
  }
  const issues = validatePostsSource(src);
  if (issues.length === 0) {
    console.log(`✅ ${target} 校验通过（${src.match(/^  '[^']+':\s*\{/gm)?.length || 0} 篇帖子）`);
    process.exit(0);
  } else {
    console.error(`❌ ${target} 校验失败，共 ${issues.length} 个问题:`);
    for (const i of issues) console.error('  - ' + i);
    process.exit(1);
  }
}
