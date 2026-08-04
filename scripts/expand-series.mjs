/**
 * 系列书自动扩展脚本
 * 读取 books.json → 检查系列映射 → 添加缺失书 → 写出 books-merged.json
 *
 * 运行: node scripts/expand-series.mjs
 * 然后: node scripts/fetch-audible.mjs (补全数据)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(__dirname, "..", "data");
const BOOKS_PATH = path.join(DATA, "books.json");
const OUT_PATH = path.join(DATA, "books-merged.json");

// 系列映射: 系列名 → { author, books: [title, ...] }
const SERIES = {
  "Wheel of Time": {
    author: "Robert Jordan",
    books: [
      "The Great Hunt", "The Dragon Reborn",
      "The Fires of Heaven", "Lord of Chaos",
      "A Crown of Swords", "The Path of Daggers",
      "Winter's Heart", "Crossroads of Twilight",
      "Knife of Dreams", "The Gathering Storm",
      "Towers of Midnight", "A Memory of Light",
    ],
  },
  "Mistborn": {
    author: "Brandon Sanderson",
    books: [
      "The Final Empire", "The Well of Ascension",
      "The Hero of Ages", "Shadows of Self",
      "The Bands of Mourning", "The Lost Metal",
    ],
  },
  "The Expanse": {
    author: "James S.A. Corey",
    books: [
      "Cibola Burn", "Nemesis Games",
      "Babylon's Ashes", "Persepolis Rising",
      "Tiamat's Wrath", "Leviathan Falls",
    ],
  },
  "Dune Chronicles": {
    author: "Frank Herbert",
    books: [
      "God Emperor of Dune", "Heretics of Dune",
      "Chapterhouse Dune",
    ],
  },
  "Farseer Trilogy": {
    author: "Robin Hobb",
    books: ["Assassin's Quest"],
  },
  "Stormlight Archive": {
    author: "Brandon Sanderson",
    books: ["Wind and Truth"],
  },
  "Harry Potter": {
    author: "J.K. Rowling",
    books: [
      "Harry Potter and the Sorcerer's Stone",
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire",
      "Harry Potter and the Order of the Phoenix",
      "Harry Potter and the Half-Blood Prince",
      "Harry Potter and the Deathly Hallows",
    ],
  },
  "The Lord of the Rings": {
    author: "J.R.R. Tolkien",
    books: [
      "The Fellowship of the Ring",
      "The Two Towers",
      "The Return of the King",
    ],
  },
  "His Dark Materials": {
    author: "Philip Pullman",
    books: ["The Amber Spyglass"],
  },
  "Murderbot Diaries": {
    author: "Martha Wells",
    books: [
      "All Systems Red", "Artificial Condition",
      "Rogue Protocol", "Exit Strategy",
      "Network Effect", "Fugitive Telemetry",
      "System Collapse",
    ],
  },
};

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const books = readJson(BOOKS_PATH) || [];
const existingTitles = new Set(books.map((b) => b.title.toLowerCase().trim()));

console.log("Existing books:", books.length);

let totalAdded = 0;

for (const [seriesName, seriesData] of Object.entries(SERIES)) {
  const seriesCats = detectCategories(seriesName);
  const added = [];

  for (const title of seriesData.books) {
    const key = title.toLowerCase().trim();
    if (existingTitles.has(key)) continue;

    const newBook = {
      asin: "PENDING_" + Math.random().toString(36).slice(2, 10),
      title,
      author: seriesData.author,
      narrator: "",
      runtimeMinutes: 0,
      price: 0,
      currency: "USD",
      starRating: 0,
      reviewCount: 0,
      coverImageUrl: "",
      detailPageUrl: "",
      categories: seriesCats,
      releaseDate: "",
      publisher: "",
    };

    books.push(newBook);
    existingTitles.add(key);
    added.push(title);
    totalAdded++;
  }

  if (added.length > 0) {
    console.log(`  ${seriesName}: +${added.length} (${added.join(", ")})`);
  } else {
    console.log(`  ${seriesName}: already complete`);
  }
}

if (totalAdded === 0) {
  console.log("No series books to add.");
  process.exit(0);
}

console.log("\nTotal added:", totalAdded);
console.log("Total books:", books.length);

fs.writeFileSync(OUT_PATH, JSON.stringify(books, null, 2) + "\n", "utf8");
console.log("Wrote:", OUT_PATH);
console.log("Run 'node scripts/fetch-audible.mjs' next to resolve PENDING books.");

function detectCategories(seriesName) {
  const map = {
    "Wheel of Time": ["Fantasy", "Epic Fantasy", "Fiction"],
    "Mistborn": ["Fantasy", "Epic Fantasy", "Fiction"],
    "The Expanse": ["Science Fiction", "Space Opera", "Fiction"],
    "Dune Chronicles": ["Science Fiction", "Classic", "Space Opera"],
    "Farseer Trilogy": ["Fantasy", "Epic Fantasy", "Fiction"],
    "Stormlight Archive": ["Fantasy", "Epic Fantasy", "Fiction"],
    "Harry Potter": ["Fantasy", "Young Adult", "Fiction"],
    "The Lord of the Rings": ["Fantasy", "Classic", "Fiction"],
    "His Dark Materials": ["Fantasy", "Young Adult", "Fiction"],
    "Murderbot Diaries": ["Science Fiction", "Fiction"],
  };
  return map[seriesName] || ["Fiction"];
}
