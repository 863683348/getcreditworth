/**
 * 从 Audible API 获取每本书的真实封面图 URL
 * 运行: node scripts/fetch-covers.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const booksPath = path.join(projectRoot, 'data', 'books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

console.log(`Fetching cover images for ${books.length} books from Audible API...`);

async function fetchCover(asin) {
  const url = `https://api.audible.com/1.0/catalog/products/${asin}?response_groups=media`;
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GetCreditWorth/1.0)',
        'Accept': 'application/json',
      },
    });
    if (!resp.ok) {
      console.error(`  [FAIL] ${asin}: HTTP ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    const images = data?.product?.product_images;
    if (images) {
      // 优先取 1024 或 500 尺寸
      return images['1024'] || images['500'] || images['2408'] || null;
    }
    console.error(`  [WARN] ${asin}: no product_images in response`);
    return null;
  } catch (err) {
    console.error(`  [ERR] ${asin}: ${err.message}`);
    return null;
  }
}

async function main() {
  const results = {};
  const batchSize = 5;
  
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);
    console.log(`\nBatch ${Math.floor(i / batchSize) + 1}/${Math.ceil(books.length / batchSize)} (${i + 1}-${i + batch.length})`);
    
    const covers = await Promise.all(batch.map(b => fetchCover(b.asin)));
    batch.forEach((book, idx) => {
      const coverUrl = covers[idx];
      if (coverUrl) {
        results[book.asin] = coverUrl;
        console.log(`  [OK] ${book.asin}: ${coverUrl.substring(0, 70)}...`);
      } else {
        console.log(`  [SKIP] ${book.asin}: no cover found`);
      }
    });
    
    // 小延迟，避免 API 限流
    if (i + batchSize < books.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 更新 books.json
  let updated = 0;
  let failed = 0;
  books.forEach(book => {
    const newUrl = results[book.asin];
    if (newUrl) {
      book.coverImageUrl = newUrl;
      updated++;
    } else {
      failed++;
    }
  });

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n', 'utf8');
  console.log(`\n=== Done ===`);
  console.log(`Updated: ${updated} / ${books.length}`);
  console.log(`Failed:  ${failed} / ${books.length}`);
  
  if (updated > 0) {
    console.log(`\nSample URLs:`);
    books.slice(0, 3).forEach(b => {
      console.log(`  ${b.asin}: ${b.coverImageUrl}`);
    });
  }
}

main().catch(console.error);
