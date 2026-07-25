/**
 * 通过书名搜索 Audible API，获取真实 ASIN + 封面图 URL
 * 运行: node scripts/search-covers.mjs
 *
 * 策略：
 * 1. 用书名搜索 Audible API
 * 2. 匹配标题最接近的结果
 * 3. 获取真实 ASIN 和 product_images
 * 4. 更新 books.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const booksPath = path.join(projectRoot, 'data', 'books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

console.log(`Searching Audible API for ${books.length} books...`);

function normalizeTitle(title) {
  return title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleMatch(searchTitle, resultTitle) {
  const a = normalizeTitle(searchTitle);
  const b = normalizeTitle(resultTitle);
  // 精确匹配或包含匹配
  return a === b || b.includes(a) || a.includes(b);
}

async function searchBook(title, author) {
  // 用书名搜索，取前5个结果匹配
  const query = encodeURIComponent(title.substring(0, 80));
  const url = `https://api.audible.com/1.0/catalog/products?title=${query}&response_groups=media,contributors&num_results=5`;
  
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GetCreditWorth/1.0)',
        'Accept': 'application/json',
      },
    });
    if (!resp.ok) {
      console.error(`  [FAIL] HTTP ${resp.status}: ${title.substring(0, 40)}`);
      return null;
    }
    const data = await resp.json();
    const products = data?.products || [];
    
    if (products.length === 0) {
      console.error(`  [EMPTY] No results: ${title.substring(0, 40)}`);
      return null;
    }
    
    // 匹配标题最接近的结果
    let bestMatch = null;
    for (const p of products) {
      if (titleMatch(title, p.title)) {
        // 优先匹配作者
        if (author && p.authors) {
          const authorMatch = p.authors.some(a => 
            a.name && a.name.toLowerCase().includes(author.split(' ').pop().toLowerCase())
          );
          if (authorMatch) {
            bestMatch = p;
            break;
          }
        }
        if (!bestMatch) bestMatch = p;
      }
    }
    
    // 如果没精确匹配，取第一个结果
    if (!bestMatch && products.length > 0) {
      bestMatch = products[0];
    }
    
    if (bestMatch?.product_images) {
      const img = bestMatch.product_images['1024'] || bestMatch.product_images['500'] || null;
      return {
        asin: bestMatch.asin,
        coverUrl: img,
        matchedTitle: bestMatch.title,
      };
    }
    
    console.error(`  [NOIMG] ${title.substring(0, 40)} -> matched "${bestMatch?.title?.substring(0, 30)}" but no image`);
    return null;
  } catch (err) {
    console.error(`  [ERR] ${title.substring(0, 40)}: ${err.message}`);
    return null;
  }
}

async function main() {
  const results = {};
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    process.stdout.write(`[${i + 1}/${books.length}] ${book.title.substring(0, 40)}... `);
    
    const result = await searchBook(book.title, book.author);
    if (result) {
      results[book.asin] = result;
      console.log(`OK`);
      console.log(`  -> ASIN: ${result.asin}, Cover: ${result.coverUrl?.substring(0, 60)}...`);
    } else {
      console.log(`SKIP`);
    }
    
    // 延迟避免限流
    if ((i + 1) % 10 === 0) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // 更新 books.json
  let updated = 0;
  let failed = 0;
  books.forEach(book => {
    const result = results[book.asin];
    if (result) {
      // 更新 ASIN 和封面 URL
      book.asin = result.asin;
      book.coverImageUrl = result.coverUrl;
      // 更新 detail page URL
      book.detailPageUrl = `https://www.amazon.com/dp/${result.asin}`;
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
    console.log(`\nSample results:`);
    books.slice(0, 5).forEach(b => {
      console.log(`  ${b.asin} - ${b.title.substring(0, 30)}`);
      console.log(`    Cover: ${b.coverImageUrl}`);
    });
  }
}

main().catch(console.error);
