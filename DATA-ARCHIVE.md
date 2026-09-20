# 已归档的一次性数据（2026-09-20）

> 归档文件位于 `data/_archive/`。本文件是说明文档，放在仓库根目录以便被
g> 版本控制收录（`data/_archive/` 本身已被 `.gitignore` / `.vercelignore` 排除）。

本目录内容**已从构建路径移出**，用于压缩 Vercel Deployment Storage
（每次部署省 ~10.58 MB）。归档原因与还原方式如下。

## 归档内容

| 类别 | 数量 | 体积 | 说明 |
|---|---|---|---|
| `books-merged.json` | 1 | 8.02 MB | `merge-seeds.mjs` 的中间产物（books.json + seeds → 去重合并）。`expand-series.mjs` / `fetch-audible.mjs` 会读它。 |
| `seeds-*.json` | 29 | 2.34 MB | 2026-08-27/28 及更早的每日抓取快照。内容**已合并进 `books.json`**。 |
| `extra-seeds.json` | 1 | 0.01 MB | 同上，早期种子补充。 |
| `blog/append-posts.txt` | 1 | 0.22 MB | `generate-content*.mjs` 的中间输出（待追加的博客正文）。 |

## 安全性依据

2026-09-20 全量扫描确认：这些文件被 **103 个非 scripts 源文件中的 0 个引用**
（`app/` / `components/` / `lib/` 全部无引用）。仅 `scripts/` 下的数据管道脚本会读写，
且均为**可重跑的中间态**。

## 如需还原

```bash
# 单独还原
cp data/_archive/books-merged.json data/
cp data/_archive/seeds-*.json data/

# 或整体还原
cp -r data/_archive/. data/
```

```bash
# 更推荐：按需重新生成（而非还原旧文件）
node scripts/merge-seeds.mjs      # 重跑 → 重建 books-merged.json
node scripts/seed-healthcheck.mjs # 校验 seeds
```

> ⚠️ 若重新启用 `merge-seeds.mjs` / `expand-series.mjs` / `fetch-audible.mjs` /
> `generate-content*.mjs`，需先把对应输入文件从本目录复制回 `data/`，
> 并在 `.vercelignore` 中保持 `data/_archive/` 的排除。

## 排除规则

以下两处已排除本目录，确保归档内容**不进部署快照、不进 git**：
- `.vercelignore` → `data/_archive/`
- `.gitignore` → `data/_archive/`
