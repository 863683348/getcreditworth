/**
 * 种子合并脚本
 * 读取 books.json + 所有 seeds-*.json → 去重 → 输出 books-merged.json
 *
 * 运行: node scripts/merge-seeds.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "..", "data");
const BOOKS_PATH = path.join(DATA, "books.json");
const OUT_PATH = path.join(DATA, "books-merged.json");

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// 1. 读已有书
const existing = readJson(BOOKS_PATH) || [];
const existingTitles = new Set(existing.map((b) => b.title.toLowerCase().trim()));
const existingAsins = new Set(existing.map((b) => b.asin));

console.log("Existing books:", existing.length);

// 2. 读所有 seeds-*.json
const seedFiles = fs.readdirSync(DATA).filter((f) => f.startsWith("seeds-") && f.endsWith(".json"));
console.log("Seed files found:", seedFiles.join(", "));

let totalSeeds = 0;
let addedSeeds = 0;

for (const sf of seedFiles) {
  const seeds = readJson(path.join(DATA, sf));
  if (!Array.isArray(seeds)) continue;

  for (const s of seeds) {
    totalSeeds++;
    const title = String(s[0]).toLowerCase().trim();
    if (existingTitles.has(title)) continue;

    const asin = "PENDING_" + Math.random().toString(36).slice(2, 10);
    const newBook = {
      asin,
      title: s[0],
      author: s[1] || "",
      narrator: "",
      runtimeMinutes: 0,
      price: 0,
      currency: "USD",
      starRating: 0,
      reviewCount: 0,
      coverImageUrl: "",
      detailPageUrl: "",
      categories: s.slice(2).filter(Boolean),
      releaseDate: "",
      publisher: "",
    };

    existing.push(newBook);
    existingTitles.add(title);
    addedSeeds++;
  }
}

console.log("Total seeds read:", totalSeeds);
console.log("New seeds added:", addedSeeds);
console.log("Total books:", existing.length);

// 3. 输出
fs.writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2) + "\n", "utf8");
console.log("Output:", OUT_PATH);
console.log("Done!");
