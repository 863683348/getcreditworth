/**
 * 通过 Amazon.com 搜索获取正确的 Audible 有声书 ASIN
 * 
 * 问题：books.json 中的 ASIN 来自 Audible.com API，在 amazon.com/dp/ 返回 404
 * 原因：Audible.com 和 Amazon.com 使用不同的 ASIN 体系
 * 
 * 方案：用书名+作者搜索 Amazon.com，从搜索结果页面提取正确的 ASIN
 * 
 * 运行: node scripts/fix-amazon-asins.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const booksPath = path.join(projectRoot, 'data', 'books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

console.log(`Fixing Amazon ASINs for ${books.length} books...`);

/**
 * 从 Amazon 搜索结果页面提取 Audible 有声书 ASIN
 * Amazon 搜索 URL: https://www.amazon.com/s?k={query}&i=audible
 */
async function searchAmazonASIN(title, author) {
  // 构建搜索关键词：书名 + 作者 + audible audiobook
  const searchQuery = encodeURIComponent(`${title} ${author} audible audiobook`);
  const url = `https://www.amazon.com/s?k=${searchQuery}&i=audible`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!resp.ok) {
      console.error(`  [HTTP ${resp.status}] ${title.substring(0, 40)}`);
      return null;
    }

    const html = await resp.text();

    // 从搜索结果中提取 ASIN
    // Amazon 搜索结果中的 ASIN 格式：/dp/BXXXXXXXXX
    // 或者 data-asin="BXXXXXXXXX"
    const asinPattern = /\/dp\/(B[A-Z0-9]{9})(?:\?|\"|\/|$)/g;
    const dataAsinPattern = /data-asin="(B[A-Z0-9]{9})"/g;

    const asins = new Set();
    let match;

    // 从 /dp/ 链接提取
    while ((match = asinPattern.exec(html)) !== null) {
      asins.add(match[1]);
    }

    // 从 data-asin 属性提取
    while ((match = dataAsinPattern.exec(html)) !== null) {
      asins.add(match[1]);
    }

    if (asins.size === 0) {
      // 尝试另一种模式
      const altPattern = /"asin":"(B[A-Z0-9]{9})"/g;
      while ((match = altPattern.exec(html)) !== null) {
        asins.add(match[1]);
      }
    }

    if (asins.size === 0) {
      console.error(`  [NOASIN] No ASIN found: ${title.substring(0, 40)}`);
      return null;
    }

    // 返回第一个找到的 ASIN（搜索结果通常按相关性排序，第一个最可能是正确的）
    const asinArray = Array.from(asins);
    return {
      amazonAsin: asinArray[0],
      allAsins: asinArray.slice(0, 5), // 保存前5个供调试
    };
  } catch (err) {
    console.error(`  [ERR] ${title.substring(0, 40)}: ${err.message}`);
    return null;
  }
}

async function main() {
  const results = {};
  let success = 0;
  let failed = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    process.stdout.write(`[${i + 1}/${books.length}] ${book.title.substring(0, 40)}... `);

    const result = await searchAmazonASIN(book.title, book.author);
    if (result) {
      results[book.asin] = result;
      console.log(`OK -> ${result.amazonAsin}`);
      success++;
    } else {
      console.log('SKIP');
      failed++;
    }

    // 延迟避免被限流（Amazon 对爬取比较敏感）
    await new Promise(r => setTimeout(r, 2000));

    // 每30本暂停一下
    if ((i + 1) % 30 === 0) {
      console.log(`  --- Pausing 5s to avoid rate limit ---`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // 更新 books.json
  let updated = 0;
  books.forEach(book => {
    const result = results[book.asin];
    if (result && result.amazonAsin) {
      // 保存旧的 Audible ASIN 作为参考
      book.audibleAsin = book.asin;
      // 更新为 Amazon.com 的 ASIN
      book.asin = result.amazonAsin;
      // 更新 detail page URL
      book.detailPageUrl = `https://www.amazon.com/dp/${result.amazonAsin}`;
      updated++;
    }
  });

  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2) + '\n', 'utf8');
  console.log(`\n=== Done ===`);
  console.log(`Search success: ${success} / ${books.length}`);
  console.log(`Search failed:  ${failed} / ${books.length}`);
  console.log(`Updated:        ${updated} / ${books.length}`);

  if (updated > 0) {
    console.log(`\nSample results:`);
    books.slice(0, 5).forEach(b => {
      console.log(`  ${b.asin} (was: ${b.audibleAsin || 'N/A'}) - ${b.title.substring(0, 30)}`);
    });
  }
}

main().catch(console.error);
