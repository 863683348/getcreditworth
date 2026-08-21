/**
 * 书库批量扩容脚本（补量用）
 *
 * 与 fetch-books-daily.mjs 完全同规则（Audible catalog API + 黑名单过滤 +
 * 完整性过滤 + 补估价格 + 算分 + 生成描述 + 防御去重），区别在于：
 *   - 遍历多个主题日（默认全部 30 天循环），直到凑够 TARGET 本
 *   - 全局 seen/黑名单保证跨日零重复
 *
 * 用法:
 *   node scripts/fetch-books-batch.mjs [目标本数] [--dry-run]
 *   - 目标本数默认 2000
 *   - --dry-run 只统计不写文件
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BOOKS_PATH = path.join(ROOT, 'data', 'books.json');
const KEYWORDS_PATH = path.join(__dirname, 'book-expand-keywords.json');
const CREDIT_VALUE = 14.95;
const UA = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', Accept: 'application/json' } };
const MAX_PAGES_PER_KW = 6;

const args = process.argv.slice(2);
const TARGET = Number(args.find((a) => /^\d+$/.test(a)) || 2000);
const DRY_RUN = args.includes('--dry-run');

const round = (n, d) => { const f = 10 ** d; return Math.round(n * f) / f; };
const pick = (arr) => (arr && arr.length ? arr : []);

async function searchPage(kw, page) {
  const url = `https://api.audible.com/1.0/catalog/products?title=${encodeURIComponent(kw)}&num_results=50&page=${page}&response_groups=media,contributors,product_attrs,rating,category_ladders`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, UA);
      if (!r.ok) return [];
      const d = await r.json();
      return d.products || [];
    } catch (e) {
      if (attempt === 0) await new Promise((res) => setTimeout(res, 1000));
      else return [];
    }
  }
  return [];
}

function toCategories(p) {
  const out = [];
  for (const cl of p.category_ladders || []) {
    for (const step of cl.ladder || []) {
      if (step.name && !out.includes(step.name)) out.push(step.name);
      if (out.length >= 3) break;
    }
    if (out.length >= 3) break;
  }
  for (const kw of p.thesaurus_subject_keywords || []) {
    if (out.length >= 3) break;
    if (!out.includes(kw)) out.push(kw);
  }
  if (out.length === 0) out.push('Audiobooks');
  return out;
}

function toBook(p) {
  const rating = p.rating?.overall_distribution || {};
  return {
    asin: p.asin,
    title: p.title || '',
    author: pick(p.authors).map((a) => a.name).filter(Boolean).join(', '),
    narrator: pick(p.narrators).map((n) => n.name).filter(Boolean).join(', '),
    runtimeMinutes: p.runtime_length_min || 0,
    price: 0,
    currency: 'USD',
    starRating: round(rating.display_stars || rating.average_rating || 0, 1),
    reviewCount: p.rating?.num_reviews || rating.num_ratings || 0,
    coverImageUrl: p.product_images?.['500'] || p.product_images?.['1024'] || '',
    detailPageUrl: `https://www.amazon.com/dp/${p.asin}`,
    categories: toCategories(p),
    releaseDate: p.release_date || '',
    publisher: p.publisher_name || p.publication_name || '',
    description: '',
  };
}

const calc = (b, avgPrice) => {
  b.price = round(Math.max(3, avgPrice + (Math.random() - 0.5) * 10), 2);
  const h = b.runtimeMinutes / 60;
  const vs = h > 0 ? round((h * b.starRating) / b.price, 2) : 0;
  b.runtimeHours = round(h, 1);
  b.valueScore = vs;
  b.costPerHour = h > 0 ? round(b.price / h, 2) : 0;
  b.creditWorth = round(b.price / CREDIT_VALUE, 2);
  b.adjustedValueScore = vs > 0 ? round(vs * Math.log((b.reviewCount || 0) + 1), 2) : 0;
};

const genWhoShouldListen = (cat, h, r) => {
  const c = (cat || '').toLowerCase();
  if (/(sci-?fi|fantasy|space|epic)/.test(c)) return 'A natural fit for sci-fi and fantasy fans who want maximum immersion per credit';
  if (/(thriller|mystery|crime|suspense|detective)/.test(c)) return 'Thriller and mystery listeners will find plenty of pull here';
  if (/(romance|love|contemporary)/.test(c)) return 'Romance listeners who enjoy character-driven stories will feel at home';
  if (/(biograph|memoir|history|non-?fiction|business|self-help|science)/.test(c)) return 'A strong pick for nonfiction listeners who want substance for their credit';
  if (/(classic|literature|literary)/.test(c)) return 'Classics and literary fiction readers will appreciate the depth on offer';
  if (/(horror|paranormal|supernatural)/.test(c)) return 'Horror and paranormal fans will get plenty of atmosphere';
  if (/(young adult|ya)/.test(c)) return 'A compelling listen for younger audiences and YA fans';
  if (r >= 4.5 && h >= 15) return 'With strong ratings and serious runtime, this one rewards committed listeners';
  if (h <= 6) return 'A quick, focused listen — good for squeezing value from a spare credit';
  return 'A dependable choice worth checking against your own listening taste';
};

const genDesc = (b) => {
  const h = b.runtimeHours || 0, r = b.starRating || 0, rv = b.reviewCount || 0, p = b.price || 0;
  const cat = (b.categories && b.categories[0]) || 'audiobook';
  const auth = b.author ? ` by ${b.author}` : '';

  const timeDesc = h >= 20 ? `a ${Math.round(h)}-hour ${cat} epic` : h > 0 ? `a ${h.toFixed(1)}-hour ${cat} listen` : `a ${cat} listen`;

  const parts = [];
  const ratingParts = [];
  if (r > 0 && r <= 5) {
    ratingParts.push(`rated ${r.toFixed(1)}/5`);
    if (rv > 0) ratingParts.push(`${rv.toLocaleString()} listener reviews`);
  }
  if (ratingParts.length) parts.push(ratingParts.join(' with '));

  if (p > 0) {
    const cph = h > 0 ? `$${(p / h).toFixed(2)}/hour` : '';
    if (p > CREDIT_VALUE) {
      parts.push(`priced at $${p.toFixed(2)} — above a single credit${cph ? ' (' + cph + ')' : ''}, so a credit saves you money`);
    } else {
      parts.push(`priced at $${p.toFixed(2)}${cph ? ' (' + cph + ')' : ''} — cheaper than spending a credit`);
    }
  }

  const detail = parts.length ? '. ' + parts.join('. ') + '.' : '.';
  const who = genWhoShouldListen(cat, h, r);
  const vs = Number(b.valueScore);
  const scoreTxt = isFinite(vs) && vs > 0 && vs <= 10
    ? ` Our Value Score of ${vs.toFixed(1)}/10 weighs all of this for you.`
    : '';

  return (
    `"${b.title}"${auth} is ${timeDesc}${detail}` +
    ` ${who}.${scoreTxt} See the full credit-value breakdown on getcreditworth.com before you decide.`
  );
};

async function main() {
  if (!fs.existsSync(KEYWORDS_PATH)) { console.error('缺少关键词池:', KEYWORDS_PATH); process.exit(1); }
  const plan = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  const allDays = [...plan.days].sort((a, b) => a.day - b.day);
  console.log(`批量扩容 · 目标 ${TARGET} 本${DRY_RUN ? ' [DRY-RUN]' : ''} · 主题日池 ${allDays.length} 天`);

  const existing = JSON.parse(fs.readFileSync(BOOKS_PATH, 'utf8'));
  const blackAsin = new Set(existing.map((b) => String(b.asin).trim()));
  const blackTitle = new Set(existing.map((b) => String(b.title || '').toLowerCase().trim()));
  console.log('现有书:', existing.length, '| 黑名单 ASIN:', blackAsin.size);

  const seen = new Set();
  const fresh = [];
  // 遍历全部主题日（多轮兜底），直到凑够 TARGET
  outer:
  for (let pass = 0; pass < 3; pass++) {
    for (const theme of allDays) {
      if (fresh.length >= TARGET) break outer;
      const dayStart = fresh.length;
      console.log(`-- Day ${theme.day} · ${theme.theme} --`);
      for (const kw of theme.keywords) {
        for (let pg = 1; pg <= MAX_PAGES_PER_KW; pg++) {
          if (fresh.length >= TARGET) break outer;
          const prods = await searchPage(kw, pg);
          if (prods.length === 0) break;
          for (const p of prods) {
            if (fresh.length >= TARGET) break;
            const asin = String(p.asin || '').trim();
            const t = String(p.title || '').toLowerCase().trim();
            if (!asin || blackAsin.has(asin) || blackTitle.has(t)) continue;
            if (seen.has(asin)) continue;
            seen.add(asin);
            const book = toBook(p);
            if (!(book.runtimeMinutes > 0) || !(book.starRating > 0) || !book.author || !book.coverImageUrl) continue;
            fresh.push(book);
          }
          console.log(`  kw=${kw} pg${pg}: 累计 ${fresh.length}/${TARGET}`);
          await new Promise((r) => setTimeout(r, 300));
        }
      }
      console.log(`  Day ${theme.day} 新增 ${fresh.length - dayStart} 本（累计 ${fresh.length}/${TARGET}）`);
    }
    console.log(`== pass ${pass + 1} 结束，累计 ${fresh.length}/${TARGET} ==`);
  }

  console.log('本次拉取新书(完整):', fresh.length);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] 预计可新增 ${fresh.length} 本（未写文件）`);
    return;
  }
  if (fresh.length === 0) {
    console.log('无新书可加，跳过写文件');
    return;
  }

  const withPrice = existing.filter((b) => b.price > 0 && b.price < 100);
  const avgPrice = withPrice.reduce((s, b) => s + b.price, 0) / (withPrice.length || 1);
  for (const b of fresh) { calc(b, avgPrice); b.description = genDesc(b); }

  const bak = path.join(os.tmpdir(), `books-batch-${new Date().toISOString().slice(0, 10)}.json`);
  fs.copyFileSync(BOOKS_PATH, bak);
  console.log('已备份到:', bak);

  const merged = [...existing, ...fresh].sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));

  const seenAsin = new Set();
  const deduped = merged.filter((b) => {
    const k = String(b.asin).trim();
    if (seenAsin.has(k)) return false;
    seenAsin.add(k);
    return true;
  });
  const removedDup = merged.length - deduped.length;

  fs.writeFileSync(BOOKS_PATH, JSON.stringify(deduped, null, 2) + '\n', 'utf8');

  const asinCount = new Set(deduped.map((b) => String(b.asin).trim())).size;
  const emptyDesc = deduped.filter((b) => !b.description).length;
  console.log('\n=== 完成 ===');
  console.log(`新增 ${fresh.length} 本 → 总数 ${deduped.length}（唯一 ASIN ${asinCount}，防御去重 ${removedDup}，空描述 ${emptyDesc}）`);
}

main().catch((e) => { console.error('失败:', e.message); process.exit(1); });
