/**
 * 定期重新生成 curated-lists.json
 *
 * 从 books.json 按类别筛选 + valueScore 排序，生成榜单列表。
 * 每次运行会保留原有列表的 slug/title/description，只更新 bookAsins 和 updatedAt。
 *
 * 用法:
 *   node scripts/regenerate-curated-lists.mjs [--dry-run]
 *   - --dry-run 只输出统计不写文件
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BOOKS_PATH = path.join(ROOT, 'data', 'books.json');
const LISTS_PATH = path.join(ROOT, 'data', 'curated-lists.json');

const DRY_RUN = process.argv.includes('--dry-run');

// 榜单配置：slug -> 筛选规则
const LIST_CONFIGS = [
  {
    slug: 'best-fantasy-for-credits',
    title: 'Best Fantasy Audiobooks',
    categoryKeywords: ['Fantasy', 'Science Fiction & Fantasy', 'Fantasy Science Fiction'],
    maxBooks: 30,
  },
  {
    slug: 'best-science-fiction-for-credits',
    title: 'Best Science Fiction Audiobooks',
    categoryKeywords: ['Science Fiction', 'Science Fiction & Fantasy'],
    maxBooks: 30,
  },
  {
    slug: 'best-mystery-for-credits',
    title: 'Best Mystery Audiobooks',
    categoryKeywords: ['Mystery', 'Mystery, Thriller & Suspense', 'Mystery Cozy'],
    maxBooks: 30,
  },
  {
    slug: 'best-romance-for-credits',
    title: 'Best Romance Audiobooks',
    categoryKeywords: ['Romance', 'Contemporary Romance', 'Paranormal Romance'],
    maxBooks: 30,
  },
  {
    slug: 'best-history-for-credits',
    title: 'Best History Audiobooks',
    categoryKeywords: ['History', 'World History'],
    maxBooks: 30,
  },
  {
    slug: 'best-biography-for-credits',
    title: 'Best Biography Audiobooks',
    categoryKeywords: ['Biographies & Memoirs', 'Biography'],
    maxBooks: 30,
  },
  {
    slug: 'best-business-for-credits',
    title: 'Best Business Audiobooks',
    categoryKeywords: ['Business & Careers', 'Business'],
    maxBooks: 30,
  },
  {
    slug: 'best-thriller-for-credits',
    title: 'Best Thriller Audiobooks',
    categoryKeywords: ['Thriller', 'Mystery, Thriller & Suspense'],
    maxBooks: 30,
  },
  {
    slug: 'best-classic-for-credits',
    title: 'Best Classic Audiobooks',
    categoryKeywords: ['Classic Literature', 'Literature & Fiction', 'Classics'],
    maxBooks: 30,
  },
  {
    slug: 'best-long-audiobooks-for-credits',
    title: 'Best Long Audiobooks (30+ Hours)',
    description: 'Long audiobooks over 30 hours that maximize credit value.',
    minHours: 30,
    maxBooks: 30,
  },
  {
    slug: 'best-self-help-audiobooks',
    title: 'Best Self-Help Audiobooks',
    categoryKeywords: ['Self-Help', 'Personal Development', 'Relationships, Parenting & Personal Development'],
    maxBooks: 30,
  },
];

function matchesCategory(categories, keywords) {
  if (!categories || categories.length === 0) return false;
  return categories.some((c) => keywords.some((kw) => c.toLowerCase().includes(kw.toLowerCase())));
}

function generateList(config, books) {
  let filtered = books;

  // 按类别筛选
  if (config.categoryKeywords) {
    filtered = books.filter((b) => matchesCategory(b.categories, config.categoryKeywords));
  }

  // 按时长筛选
  if (config.minHours) {
    filtered = filtered.filter((b) => {
      const hours = b.runtimeHours || 0;
      return hours >= config.minHours;
    });
  }

  // 按 valueScore 降序排序
  filtered = filtered.sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));

  // 去重 ASIN
  const seen = new Set();
  const unique = filtered.filter((b) => {
    if (seen.has(b.asin)) return false;
    seen.add(b.asin);
    return true;
  });

  return unique.slice(0, config.maxBooks || 30);
}

async function main() {
  console.log('Loading data...');
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
  const existingLists = JSON.parse(fs.readFileSync(LISTS_PATH, 'utf8'));
  console.log(`Books: ${books.length}, Existing lists: ${existingLists.length}`);

  const today = new Date().toISOString().split('T')[0];
  const updates = [];

  for (const config of LIST_CONFIGS) {
    const existing = existingLists.find((l) => l.slug === config.slug);
    const newBooks = generateList(config, books);

    if (existing) {
      const oldAsins = new Set(existing.bookAsins || []);
      const newAsins = new Set(newBooks.map((b) => b.asin));

      // 检测变化
      const added = newAsins.size - oldAsins.size;
      const changed = added !== 0 || existing.updatedAt !== today;

      if (changed) {
        updates.push({
          slug: config.slug,
          oldCount: existing.bookAsins?.length || 0,
          newCount: newBooks.length,
          changed,
        });
      }

      // 更新列表
      existing.bookAsins = newBooks.map((b) => b.asin);
      existing.updatedAt = today;
      if (config.title) existing.title = config.title;
      if (config.categoryKeywords) {
        existing.category = config.categoryKeywords[0];
      }
    } else {
      // 新建列表
      existingLists.push({
        slug: config.slug,
        title: config.title || config.slug,
        description: config.description || '',
        category: config.categoryKeywords?.[0] || 'Other',
        bookAsins: newBooks.map((b) => b.asin),
        updatedAt: today,
      });
      updates.push({
        slug: config.slug,
        oldCount: 0,
        newCount: newBooks.length,
        changed: true,
      });
    }
  }

  // 输出统计
  console.log('\n=== Update Summary ===');
  updates.forEach((u) => {
    const icon = u.changed ? '🔄' : '✓';
    console.log(`${icon} ${u.slug}: ${u.oldCount} → ${u.newCount} books`);
  });

  const totalChanged = updates.filter((u) => u.changed).length;
  console.log(`\nTotal changed: ${totalChanged}/${LIST_CONFIGS.length}`);

  if (!DRY_RUN && totalChanged > 0) {
    fs.writeFileSync(LISTS_PATH, JSON.stringify(existingLists, null, 2) + '\n', 'utf8');
    console.log(`\n✅ Written to ${LISTS_PATH}`);
  } else if (DRY_RUN) {
    console.log('\n(Dry run - no file written)');
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
