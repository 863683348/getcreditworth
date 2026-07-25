/**
 * PA-API 价格/评分更新脚本
 *
 * 当 PA-API 配置可用时，用 PA-API 更新现有书籍的价格和评分。
 * 如果 PA-API 未配置，跳过此步骤（保留现有数据）。
 *
 * 运行: npx tsx scripts/update-books-paapi.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isPaapiConfigured, getItems } from "../lib/paapi/client";
import { PAAPI_RESOURCES } from "../lib/paapi/types";
import { transformPaapiItem, mergePaapiData, hasValidData } from "../lib/paapi/transformer";
import { calculateAllScores } from "../lib/calc/value-score";
import type { BookRawData } from "../lib/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(projectRoot, "data", "books.json");
const BATCH_SIZE = 10;
const RATE_LIMIT_MS = 1100;

async function main(): Promise<void> {
  if (!isPaapiConfigured()) {
    console.log("PA-API not configured (missing env vars). Skipping.");
    process.exit(0);
  }

  const raw = fs.readFileSync(BOOKS_PATH, "utf8");
  const booksRaw = JSON.parse(raw) as BookRawData[];
  const asins = booksRaw.map((b) => b.asin).filter(Boolean);

  console.log("Found " + asins.length + " books. Updating via PA-API...");

  let updated = 0;

  for (let i = 0; i < asins.length; i += BATCH_SIZE) {
    const batch = asins.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(asins.length / BATCH_SIZE);
    console.log("[" + batchNum + "/" + totalBatches + "] Fetching " + batch.length + " ASINs...");

    try {
      const items = await getItems({
        ItemIds: batch,
        Resources: [
          PAAPI_RESOURCES.ITEM_INFO_TITLE,
          PAAPI_RESOURCES.ITEM_INFO_BY_LINE,
          PAAPI_RESOURCES.OFFERS_LISTINGS,
          PAAPI_RESOURCES.OFFERS_LISTINGS_MERCHANT,
          PAAPI_RESOURCES.CUSTOMER_REVIEWS,
          PAAPI_RESOURCES.CUSTOMER_REVIEWS_COUNT,
          PAAPI_RESOURCES.IMAGES_PRIMARY,
          PAAPI_RESOURCES.IMAGES_PRIMARY_LARGE,
        ],
      });

      for (const item of items) {
        const updateData = transformPaapiItem(item);
        if (!hasValidData(updateData)) continue;

        const idx = booksRaw.findIndex((b) => b.asin === item.ASIN);
        if (idx === -1) continue;

        booksRaw[idx] = mergePaapiData(booksRaw[idx]!, updateData);
        updated++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.warn("  Batch failed: " + msg);
    }

    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  if (updated === 0) {
    console.log("No books updated (PA-API returned no valid data)");
    process.exit(0);
  }

  // 重新计算 Value Score
  const scored = calculateAllScores(booksRaw);
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(scored, null, 2) + "\n", "utf8");

  console.log("Updated " + updated + "/" + asins.length + " books via PA-API");
  console.log("Written to: " + BOOKS_PATH);
}

main().catch((err) => {
  console.error("PA-API update failed:", err);
  process.exit(1);
});
