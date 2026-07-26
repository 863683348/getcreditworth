/**
 * 生成 Audible 300+ 书籍开放数据集 CSV
 *
 * 数据源：data/books.json（300 本 Audible 有声书）
 * 输出：public/dataset/audible-books-dataset.csv
 *
 * 字段：
 *   - asin              : Audible ASIN（主键）
 *   - title             : 书名
 *   - author            : 作者
 *   - narrator           : 朗读者
 *   - runtime_minutes    : 时长（分钟）
 *   - runtime_hours      : 时长（小时）
 *   - price_usd          : 直接购买价（美元）
 *   - star_rating        : 星级评分（1-5）
 *   - review_count       : 评论数
 *   - value_score        : Value Score = (时长h × 评分) / 价格
 *   - cost_per_hour_usd  : 每小时成本 = 价格 / 时长h
 *   - credit_worth_ratio: 1 积分价值倍数 = 价格 / $14.95
 *   - worth_using_credit : 是否值得用积分（价格 > $14.95）
 *   - categories         : 分类（管道分隔）
 *   - cover_image_url    : 封面图 URL
 *   - detail_page_url   : 详情页 URL
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOKS_PATH = join(__dirname, "..", "data", "books.json");
const OUT_DIR = join(__dirname, "..", "public", "dataset");
const OUT_PATH = join(OUT_DIR, "audible-books-dataset.csv");

// 1. 读源数据
const books = JSON.parse(readFileSync(BOOKS_PATH, "utf8"));

// 2. CSV 表头
const HEADERS = [
  "asin",
  "title",
  "author",
  "narrator",
  "runtime_minutes",
  "runtime_hours",
  "price_usd",
  "star_rating",
  "review_count",
  "value_score",
  "cost_per_hour_usd",
  "credit_worth_ratio",
  "worth_using_credit",
  "categories",
  "cover_image_url",
  "detail_page_url",
];

// 3. CSV 转义（RFC 4180）：含逗号 / 双引号 / 换行 → 加双引号包裹，内部双引号转义为两个双引号
function escapeCSV(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 4. 积分常数
const AUDIBLE_CREDIT_VALUE = 14.95;

// 5. 行数据
const rows = books.map((b) => {
  const worthUsingCredit = b.price > AUDIBLE_CREDIT_VALUE ? "Yes" : "No";
  const creditWorthRatio = (b.price / AUDIBLE_CREDIT_VALUE).toFixed(2);
  const categories = Array.isArray(b.categories) ? b.categories.join(" | ") : "";
  return [
    b.asin,
    b.title,
    b.author,
    b.narrator,
    b.runtimeMinutes,
    b.runtimeHours.toFixed(2),
    b.price.toFixed(2),
    b.starRating.toFixed(1),
    b.reviewCount,
    b.valueScore.toFixed(2),
    b.costPerHour.toFixed(2),
    creditWorthRatio,
    worthUsingCredit,
    categories,
    b.coverImageUrl,
    b.detailPageUrl,
  ].map(escapeCSV).join(",");
});

// 6. 组装 CSV
const csv = [HEADERS.join(","), ...rows].join("\r\n") + "\r\n";

// 7. 输出
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, csv, "utf8");

// 8. 统计
console.log("✅ CSV 数据集生成成功");
console.log("   源数据：", BOOKS_PATH);
console.log("   输出：", OUT_PATH);
console.log("   书籍数量：", books.length);
console.log("   字段数：", HEADERS.length);
console.log("   文件大小：", (csv.length / 1024).toFixed(1), "KB");

// 9. 数据集统计摘要
const stats = {
  totalBooks: books.length,
  worthCredit: books.filter((b) => b.price > AUDIBLE_CREDIT_VALUE).length,
  longBooks: books.filter((b) => b.runtimeHours >= 20).length,
  veryLongBooks: books.filter((b) => b.runtimeHours >= 30).length,
  highRated: books.filter((b) => b.starRating >= 4.8).length,
  avgValueScore: (books.reduce((s, b) => s + b.valueScore, 0) / books.length).toFixed(2),
  topBook: books.reduce((max, b) => (b.valueScore > max.valueScore ? b : max)),
};

console.log("\n📊 数据集摘要：");
console.log("   值得用积分的书：", stats.worthCredit, "/", stats.totalBooks);
console.log("   20h+ 长书：", stats.longBooks);
console.log("   30h+ 超长书：", stats.veryLongBooks);
console.log("   4.8★ 高评分：", stats.highRated);
console.log("   平均 Value Score：", stats.avgValueScore);
console.log("   Value Score 最高：", stats.topBook.title, `(${stats.topBook.valueScore.toFixed(2)})`);