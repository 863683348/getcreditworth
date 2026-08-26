/**
 * 批量生成博客内容脚本 v3
 * 使用字符串拼接避免模板字符串中的反引号问题
 */

import { readFileSync, writeFileSync } from 'fs';

const books = JSON.parse(readFileSync('data/books.json', 'utf8'));
const postsContent = readFileSync('data/blog/posts.tsx', 'utf8');

const existingSlugs = new Set();
const slugRegex = /slug:\s*'([^']+)'/g;
let m;
while ((m = slugRegex.exec(postsContent)) !== null) {
  existingSlugs.add(m[1]);
}

const qualityBooks = books
  .filter(b =>
    b.valueScore >= 7 &&
    b.price > 0 &&
    b.runtimeMinutes > 0 &&
    b.starRating >= 4 &&
    b.description && b.description.length > 100 &&
    !String(b.asin).startsWith('PENDING')
  )
  .sort((a, c) => c.valueScore - a.valueScore);

console.log('高质量书:', qualityBooks.length);

// 安全转义：处理单引号、反引号、换行
function esc(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    // 反引号在单引号字符串中不需要转义，保留原样
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

const lines = [];

// ============ #2 书评 ============
let reviewCount = 0;
for (const book of qualityBooks) {
  if (reviewCount >= 60) break;
  const titleSafe = esc(book.title);
  const slug = `${book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-review`;
  if (existingSlugs.has(slug) || slug.length < 5) continue;
  reviewCount++;

  const runtimeHrs = (book.runtimeMinutes / 60).toFixed(1);
  const costPerHour = (book.price / (book.runtimeMinutes / 60)).toFixed(2);
  const worthUsingCredit = book.price > 14.95;
  const verdict = book.valueScore >= 9
    ? 'Must-listen — one of the best credit trades on Audible.'
    : book.valueScore >= 7
      ? 'Strong credit value — worth a listen if you enjoy the genre.'
      : 'Solid but not exceptional. Consider buying outright if price-sensitive.';
  const categorySlug = (book.categories[0] || 'fiction').toLowerCase().replace(/\s+/g, '-');
  const catEscaped = esc(book.categories[0] || 'Audiobook');
  const authorEscaped = esc(book.author);
  const narratorEscaped = esc(book.narrator || 'various');

  lines.push("  '" + slug + "': {");
  lines.push("    slug: '" + slug + "',");
  lines.push("    title: '" + titleSafe + " Audiobook Review: " + (book.valueScore >= 9 ? 'An Exceptional Credit Pick' : book.valueScore >= 7 ? 'Solid Credit Value' : 'Worth a Listen') + "',");
  lines.push("    description: '" + esc(book.title) + " by " + esc(book.author) + ": " + runtimeHrs + " hours, " + book.starRating + "-star rating, Value Score " + book.valueScore.toFixed(1) + ".',");
  lines.push("    keywords: ['" + esc(book.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')) + " audible review', '" + esc(book.author.toLowerCase().replace(/[^a-z0-9]+/g, ' ')) + " audiobook', 'best " + catEscaped + " for credits'],");
  lines.push("    date: '2026-08-22',");
  lines.push("    readTime: '" + Math.max(3, Math.round(runtimeHrs / 2)) + " min read',");
  lines.push("    category: 'Book Review',");
  lines.push("    content: (");
  lines.push("      <>");
  lines.push("        <p>");
  lines.push("          <strong>" + titleSafe + "</strong> by " + authorEscaped + " (narrated by " + narratorEscaped + ") is a " + runtimeHrs + "-hour " + catEscaped.toLowerCase() + ". It earned a <strong>" + book.starRating + "-star rating</strong> from " + book.reviewCount + " listeners and a <strong>Value Score of " + book.valueScore.toFixed(1) + "</strong>.");
  lines.push("        </p>");
  lines.push("        <h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>The Numbers at a Glance</h2>");
  lines.push("        <ul className='space-y-2'>");
  lines.push("          <li><strong>Runtime:</strong> " + runtimeHrs + " hours (" + book.runtimeMinutes + " minutes)</li>");
  lines.push("          <li><strong>Author:</strong> " + authorEscaped + "</li>");
  lines.push("          <li><strong>Narrator:</strong> " + narratorEscaped + "</li>");
  lines.push("          <li><strong>Rating:</strong> " + book.starRating + " stars from " + book.reviewCount + " reviews</li>");
  lines.push("          <li><strong>Price:</strong> $" + book.price + " (or one credit)</li>");
  lines.push("          <li><strong>Cost per hour:</strong> $" + costPerHour + "</li>");
  lines.push("          <li><strong>Value Score:</strong> " + book.valueScore.toFixed(1) + " — " + (book.valueScore >= 9 ? 'excellent' : book.valueScore >= 7 ? 'very good' : 'good') + " credit value</li>");
  lines.push("        </ul>");
  lines.push("        <h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Is It Worth a Credit?</h2>");
  const recText = worthUsingCredit
    ? 'This book is one of the best credit uses on Audible.'
    : 'At $' + book.price + ', this book might be cheaper to buy outright than to spend a credit on.';
  lines.push("        <p>" + recText + " At a cost-per-hour of $" + costPerHour + ", this " + catEscaped.toLowerCase() + " " + (worthUsingCredit ? 'offers strong value' : 'might be better bought outright') + ".</p>");
  lines.push("        <h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Who Should Listen</h2>");
  lines.push("        <p>" + catEscaped + " fans who want a well-narrated, highly-rated experience. With " + book.reviewCount + " reviews averaging " + book.starRating + " stars, this is a solid pick.</p>");
  lines.push("        <div className='bg-bg-surface p-4 rounded-md border border-border my-4'>");
  lines.push("          <p className='text-sm'><strong>Verdict:</strong> " + verdict + "</p>");
  lines.push("        </div>");
  lines.push("        <p>See the full details on the <a href='/books/" + book.asin + "' className='text-primary hover:underline'>" + titleSafe + " page</a> or browse more <a href='/category/" + categorySlug + "' className='text-primary hover:underline'>" + catEscaped + "</a> for credit value comparisons.");
  lines.push("        </p>");
  lines.push("      </>");
  lines.push("    ),");
  lines.push("  },");
}
console.log('书评:', reviewCount, '篇');

// ============ #3 vs 对比文 ============
let vsCount = 0;
const top50 = qualityBooks.slice(0, 50);
for (let i = 0; i < top50.length && vsCount < 20; i++) {
  for (let j = i + 1; j < top50.length && vsCount < 20; j++) {
    const catsA = top50[i].categories;
    const catsB = top50[j].categories;
    if (!catsA.some(c => catsB.includes(c))) {
      vsCount++;
      const slug = 'vs-' + top50[i].asin + '-' + top50[j].asin;
      const winner = top50[i].valueScore >= top50[j].valueScore ? top50[i] : top50[j];
      const loser = top50[i].valueScore >= top50[j].valueScore ? top50[j] : top50[i];

      lines.push("  '" + slug + "': {");
      lines.push("    slug: '" + slug + "',");
      lines.push("    title: '" + esc(top50[i].title) + " vs " + esc(top50[j].title) + ": Which Is the Better Credit Use?',");
      lines.push("    description: '" + esc(top50[i].title) + " (Value Score " + top50[i].valueScore.toFixed(1) + ") vs " + esc(top50[j].title) + " (Value Score " + top50[j].valueScore.toFixed(1) + ").',");
      lines.push("    keywords: ['" + esc(top50[i].title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')) + " vs " + esc(top50[j].title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')) + "', 'audible book comparison'],");
      lines.push("    date: '2026-08-22',");
      lines.push("    readTime: '5 min read',");
      lines.push("    category: 'Comparison',");
      lines.push("    content: (");
      lines.push("      <>");
      lines.push("        <p><strong>" + esc(top50[i].title) + "</strong> (Value Score " + top50[i].valueScore.toFixed(1) + ") and <strong>" + esc(top50[j].title) + "</strong> (Value Score " + top50[j].valueScore.toFixed(1) + "). Which gives more value per credit?</p>");
      lines.push("        <h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Side by Side</h2>");
      lines.push("        <div className='overflow-x-auto my-4'>");
      lines.push("          <table className='w-full text-sm border border-border rounded-md'>");
      lines.push("            <thead className='bg-bg-surface'><tr><th className='p-2 border-b'>Metric</th><th className='p-2 border-b'>" + esc(top50[i].title.slice(0, 15)) + "</th><th className='p-2 border-b'>" + esc(top50[j].title.slice(0, 15)) + "</th></tr></thead>");
      lines.push("            <tbody>");
      lines.push("              <tr><td className='p-2 border-b'>Runtime</td><td className='p-2 border-b'>" + (top50[i].runtimeMinutes / 60).toFixed(1) + " hrs</td><td className='p-2 border-b'>" + (top50[j].runtimeMinutes / 60).toFixed(1) + " hrs</td></tr>");
      lines.push("              <tr><td className='p-2 border-b'>Price</td><td className='p-2 border-b'>$" + top50[i].price + "</td><td className='p-2 border-b'>$" + top50[j].price + "</td></tr>");
      lines.push("              <tr><td className='p-2 border-b'>Rating</td><td className='p-2 border-b'>" + top50[i].starRating + "★</td><td className='p-2 border-b'>" + top50[j].starRating + "★</td></tr>");
      lines.push("              <tr><td className='p-2 border-b'>Value Score</td><td className='p-2 border-b font-semibold'>" + top50[i].valueScore.toFixed(1) + "</td><td className='p-2 border-b font-semibold'>" + top50[j].valueScore.toFixed(1) + "</td></tr>");
      lines.push("            </tbody>");
      lines.push("          </table>");
      lines.push("        </div>");
      lines.push("        <div className='bg-bg-surface p-4 rounded-md border border-border my-4'>");
      lines.push("          <p className='text-sm'><strong>Verdict:</strong> <a href='/books/" + winner.asin + "' className='text-primary hover:underline'>" + esc(winner.title) + "</a> wins on credit value.</p>");
      lines.push("        </div>");
      lines.push("      </>");
      lines.push("    ),");
      lines.push("  },");
    }
  }
}
console.log('vs对比文:', vsCount, '篇');

// ============ #5 how-to ============
const HOW_TOS = [
  {
    slug: 'how-to-get-a-free-30-day-audible-trial',
    title: 'How to Get a Free 30-Day Audible Trial in 2026',
    desc: esc("Step-by-step guide to signing up for Audible's free 30-day trial. Get 1 free audiobook plus access to the Plus Catalog."),
    kws: ['audible free trial', 'audible 30 day trial', 'how to get audible free'],
    content: [
      esc("<p>Audible's free 30-day trial gives you <strong>1 free audiobook</strong> plus full access to the <strong>Plus Catalog</strong>.</p>"),
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>What You Get</h2>",
      "<ul className='space-y-2'><li>1 free audiobook (keep it even if you cancel)</li><li>Full access to the Plus Catalog for 30 days</li><li>No commitment — cancel anytime</li></ul>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>How to Sign Up</h2>",
      "<ol className='list-decimal ml-5 space-y-1'><li>Go to audible.com and click \"Start Your Free Trial\"</li><li>Create your account or sign in</li><li>Pick your free book</li><li>Confirm — no payment upfront</li></ol>",
      "<div className='bg-bg-surface p-4 rounded-md border border-border my-4'><p className='text-sm'><strong>Pro tip:</strong> Use your free book from our <a href='/books' className='text-primary hover:underline'>best books for credits</a> list.</p></div>",
    ]
  },
  {
    slug: 'how-to-cancel-audible-and-keep-your-books',
    title: 'How to Cancel Audible and Keep Your Books',
    desc: 'Cancel your Audible subscription without losing your purchased audiobooks. Complete guide with steps and FAQs.',
    kws: ['cancel audible', 'audible cancellation', 'keep audible books after cancel'],
    content: [
      "<p>Canceling Audible is easy — and <strong>you keep all your purchased audiobooks forever</strong>.</p>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Steps to Cancel</h2>",
      "<ol className='list-decimal ml-5 space-y-1'><li>Go to audible.com/my_member_central</li><li>Click \"Cancel Membership\"</li><li>Confirm cancellation</li><li>Keep all purchased titles</li></ol>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>What You Lose</h2>",
      "<ul className='space-y-2'><li>Access to the Plus Catalog</li><li>Unused credits expire</li></ul>",
    ]
  },
  {
    slug: 'how-to-maximize-audible-credits-2026',
    title: 'How to Maximize Your Audible Credits in 2026',
    desc: 'Strategic guide to getting the most listening time per credit. Tips on book selection, timing, and avoiding waste.',
    kws: ['maximize audible credits', 'audible credit value tips', 'get more from audible'],
    content: [
      "<p>Not all Audible credits are created equal. Some books give you 3x more listening time per dollar.</p>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Rule #1: Pick Long Books</h2>",
      "<p>A 20-hour epic costs the same credit as a 6-hour book. The epic gives you 3x the value.</p>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Rule #2: Check the Rating</h2>",
      "<p>A 5-star 15-hour book beats a 3-star 30-hour book. Use our Value Score.</p>",
      "<h2 className='text-xl font-semibold text-text-primary mt-6 mb-3'>Rule #3: Watch for Sales</h2>",
      "<p>Promotional credits and discounted subscriptions stretch your budget further.</p>",
    ]
  },
];

for (const ht of HOW_TOS) {
  lines.push("  '" + ht.slug + "': {");
  lines.push("    slug: '" + ht.slug + "',");
  lines.push("    title: '" + ht.title + "',");
  lines.push("    description: '" + ht.desc + "',");
  lines.push("    keywords: [" + ht.kws.map(k => "'" + k + "'").join(', ') + "],");
  lines.push("    date: '2026-08-22',");
  lines.push("    readTime: '5 min read',");
  lines.push("    category: 'Guide',");
  lines.push("    content: (");
  lines.push("      <>");
  for (const c of ht.content) lines.push("        " + c);
  lines.push("      </>");
  lines.push("    ),");
  lines.push("  },");
}
console.log('how-to:', HOW_TOS.length, '篇');

// 保存追加内容
const appendContent = '\n' + lines.join('\n') + '\n';
writeFileSync('data/blog/append-posts.txt', appendContent, 'utf8');
console.log('\n已写入 data/blog/append-posts.txt (' + appendContent.length + ' 字符)');
console.log('总计新增博客:', reviewCount + vsCount + HOW_TOS.length, '篇');
