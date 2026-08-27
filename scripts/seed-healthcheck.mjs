/**
 * 种子库状态检查与自动补种脚本
 *
 * 当唯一种子数量 < 阈值（默认 300 = 2天用量）时，自动触发补种
 *
 * 用法:
 *   node scripts/seed-healthcheck.mjs [--threshold N] [--dry-run]
 *   - --threshold N: 设置最低种子数量（默认 300）
 *   - --dry-run: 只检查不执行补种
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const BOOKS_PATH = path.join(DATA_DIR, 'books.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const thresholdIdx = args.indexOf('--threshold');
const THRESHOLD = thresholdIdx !== -1 ? Number(args[thresholdIdx + 1]) : 300;

function loadBooks() {
  const raw = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
  return Array.isArray(raw) ? raw : (raw.books || []);
}

function loadSeeds() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('seeds-') && f.endsWith('.json'))
    .map(f => path.join(DATA_DIR, f));
  const seeds = new Set();
  files.forEach(f => {
    try {
      const d = JSON.parse(fs.readFileSync(f, 'utf8'));
      Object.keys(d).forEach(k => seeds.add(k));
    } catch (e) {}
  });
  return seeds;
}

function countSeedFiles() {
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('seeds-') && f.endsWith('.json'))
    .length;
}

function generateSeeds(books, existingSeeds, count = 1000) {
  const themes = [
    'awards', 'bestsellers', 'literature', 'mystery', 'romance',
    'scifi', 'fantasy', 'biography', 'history', 'business'
  ];
  const today = new Date().toISOString().slice(0, 10);
  const available = books.filter(b => !existingSeeds.has(b.asin));
  const newSeeds = new Set();

  themes.forEach(theme => {
    const seed = {};
    for (let i = 0; i < Math.min(100, available.length); i++) {
      seed[available[i].asin] = available[i];
      newSeeds.add(available[i].asin);
    }
    const seedFile = path.join(DATA_DIR, `seeds-${theme}-${today}.json`);
    if (!DRY_RUN) {
      fs.writeFileSync(seedFile, JSON.stringify(seed, null, 2));
    }
    console.log(`  [${theme}] ${Object.keys(seed).length} 本 → seeds-${theme}-${today}.json`);
  });

  return newSeeds;
}

function main() {
  console.log('=== 种子库健康检查 ===');
  console.log(`阈值: ${THRESHOLD} 本（低于此值触发补种）`);
  console.log(`日期: ${new Date().toISOString().slice(0, 10)}`);

  const books = loadBooks();
  const seeds = loadSeeds();
  const seedCount = seeds.size;
  const seedFiles = countSeedFiles();

  console.log(`\n当前状态:`);
  console.log(`  书库总数: ${books.length}`);
  console.log(`  唯一种子: ${seedCount} 本`);
  console.log(`  种子文件: ${seedFiles} 个`);
  console.log(`  剩余天数: ${Math.floor(seedCount / 150)} 天（按150本/天计算）`);

  if (seedCount < THRESHOLD) {
    console.log(`\n⚠️  种子不足！需要补种 ${THRESHOLD - seedCount} 本`);
    if (DRY_RUN) {
      console.log('[DRY-RUN] 将生成 10 个新种子文件（每文件 100 本）');
    } else {
      const newSeeds = generateSeeds(books, seeds, THRESHOLD);
      console.log(`\n✅ 补种完成: 新增 ${newSeeds.size} 本唯一种子`);
    }
  } else {
    console.log(`\n✅ 种子库充足`);
  }
}

main();
