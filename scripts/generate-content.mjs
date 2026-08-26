/**
 * 批量生成博客内容脚本
 * 产出 #2 书评 #3 vs对比文 #4 榜单 #5 how-to #6 聚合页数据
 * 直接输出追加到 data/blog/posts.tsx 的 TypeScript 代码片段
 */

import { readFileSync, writeFileSync } from 'fs';

// 直接读 books.json 而不是用 lib/data/books.js
const books = JSON.parse(readFileSync('data/books.json', 'utf8'));
const postsContent = readFileSync('data/blog/posts.tsx', 'utf8');

// 已有 slug 集合
const existingSlugs = new Set();
const slugRegex = /slug:\s*'([^']+)'/g;
let m;
while ((m = slugRegex.exec(postsContent)) !== null) {
  existingSlugs.add(m[1]);
}

// 筛选高质量书
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

console.log(`总书: ${books.length}, 高质量书: ${qualityBooks.length}`);

// ============ #2 书评生成器 ============
function generateReviewPost(book, index) {
  const runtimeHrs = (book.runtimeMinutes / 60).toFixed(1);
  const costPerHour = (book.price / (book.runtimeMinutes / 60)).toFixed(2);
  const slug = `${book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-review`;
  const safeSlug = slug.slice(0, 80);
  if (existingSlugs.has(safeSlug) || safeSlug.length < 5) return null;

  const worthUsingCredit = book.price > 14.95;
  const recommendation = worthUsingCredit
    ? 'This book is one of the best credit uses on Audible.'
    : `At $${book.price}, this book might be cheaper to buy outright than to spend a credit on.`;

  const categorySlug = (book.categories[0] || 'fiction').toLowerCase().replace(/\s+/g, '-');

  const lines = [];
  lines.push(`  '${safeSlug}': {`);
  lines.push(`    slug: '${safeSlug}',`);
  lines.push(`    title: '${book.title} Audiobook Review: ${book.valueScore >= 9 ? 'An Exceptional Credit Pick' : book.valueScore >= 7 ? 'Solid Credit Value' : 'Worth a Listen'}',`);
  lines.push(`    description: '${book.title} by ${book.author}: ${runtimeHrs} hours, ${book.starRating}-star rating, Value Score ${book.valueScore.toFixed(1)}.',`);
  lines.push(`    keywords: ['${book.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} audible review', '${book.author.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} audiobook', 'best ${book.categories[0] || 'audiobook'} for credits'],`);
  lines.push(`    date: '2026-08-22',`);
  lines.push(`    readTime: '${Math.max(3, Math.round(runtimeHrs / 2))} min read',`);
  lines.push(`    category: 'Book Review',`);
  lines.push(`    content: (`);
  lines.push(`      <>`);
  lines.push(`        <p>`);
  lines.push(`          <strong>${book.title}</strong> by ${book.author} (narrated by ${book.narrator || 'various'}) is a ${runtimeHrs}-hour ${(book.categories[0] || 'audiobook')}. It earned a <strong>${book.starRating}-star rating</strong> from ${book.reviewCount} listeners and a <strong>Value Score of ${book.valueScore.toFixed(1)}</strong>.`);
  lines.push(`        </p>`);
  lines.push(`        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">The Numbers at a Glance</h2>`);
  lines.push(`        <ul className="space-y-2">`);
  lines.push(`          <li><strong>Runtime:</strong> ${runtimeHrs} hours (${book.runtimeMinutes} minutes)</li>`);
  lines.push(`          <li><strong>Author:</strong> ${book.author}</li>`);
  lines.push(`          <li><strong>Narrator:</strong> ${book.narrator || 'N/A'}</li>`);
  lines.push(`          <li><strong>Rating:</strong> ${book.starRating} stars from ${book.reviewCount} reviews</li>`);
  lines.push(`          <li><strong>Price:</strong> $${book.price} (or one credit)</li>`);
  lines.push(`          <li><strong>Cost per hour:</strong> $${costPerHour}</li>`);
  lines.push(`          <li><strong>Value Score:</strong> ${book.valueScore.toFixed(1)} — ${book.valueScore >= 9 ? 'excellent' : book.valueScore >= 7 ? 'very good' : 'good'} credit value</li>`);
  lines.push(`        </ul>`);
  lines.push(`        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Is It Worth a Credit?</h2>`);
  lines.push(`        <p>${recommendation} At a cost-per-hour of $${costPerHour}, this ${book.categories[0] || 'book'} ${worthUsingCredit ? 'offers strong value' : 'might be better bought outright'}.</p>`);
  lines.push(`        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Who Should Listen</h2>`);
  lines.push(`        <p>${book.categories[0] || 'Fans of this genre'} who want a well-narrated, highly-rated experience. With ${book.reviewCount} reviews averaging ${book.starRating} stars, this is a solid pick.</p>`);
  lines.push(`        <div className="bg-bg-surface p-4 rounded-md border border-border my-4">`);
  lines.push(`          <p className="text-sm"><strong>Verdict:</strong> ${book.valueScore >= 9 ? 'Must-listen — one of the best credit trades on Audible.' : book.valueScore >= 7 ? 'Strong credit value — worth a listen if you enjoy the genre.' : 'Solid but not exceptional. Consider buying outright if price-sensitive.'}</p>`);
  lines.push(`        </div>`);
  lines.push(`        <p>See the full details on the{" `);
  lines.push(`          <a href={"/books/${book.asin}"} className="text-primary hover:underline">${book.title} page</a>{" `);
  lines.push(`          or browse more <a href={"/category/${categorySlug}"} className="text-primary hover:underline">${book.categories[0] || 'audiobooks'}</a> for credit value comparisons.`);
  lines.push(`        </p>`);
  lines.push(`      </>`);
  lines.push(`    ),`);
  lines.push(`  },`);
  return { slug: safeSlug, content: lines.join('\n') };
}

// ============ #3 vs 对比文生成器 ============
function generateVsPost(bookA, bookB) {
  const slugA = bookA.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const slugB = bookB.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const slug = `${slugA}-vs-${slugB}`;
  const safeSlug = slug.slice(0, 100);
  if (existingSlugs.has(safeSlug) || safeSlug.length < 10) return null;

  const winner = bookA.valueScore >= bookB.valueScore ? bookA : bookB;
  const loser = bookA.valueScore >= bookB.valueScore ? bookB : bookA;

  const lines = [];
  lines.push(`  'vs-${bookA.asin}-${bookB.asin}': {`);
  lines.push(`    slug: '${safeSlug}',`);
  lines.push(`    title: '${bookA.title} vs ${bookB.title}: Which Is the Better Credit Use?',`);
  lines.push(`    description: '${bookA.title} (Value Score ${bookA.valueScore.toFixed(1)}) vs ${bookB.title} (Value Score ${bookB.valueScore.toFixed(1)}). We compare runtime, price, and rating.',`);
  lines.push(`    keywords: ['${bookA.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')} vs ${bookB.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ')}', 'audible book comparison'],`);
  lines.push(`    date: '2026-08-22',`);
  lines.push(`    readTime: '5 min read',`);
  lines.push(`    category: 'Comparison',`);
  lines.push(`    content: (`);
  lines.push(`      <>`);
  lines.push(`        <p>`);
  lines.push(`          <strong>${bookA.title}</strong> (Value Score ${bookA.valueScore.toFixed(1)}) and <strong>${bookB.title}</strong> (Value Score ${bookB.valueScore.toFixed(1)}) are both popular audiobooks. But which one gives you more value per credit?`);
  lines.push(`        </p>`);
  lines.push(`        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Side by Side</h2>`);
  lines.push(`        <div className="overflow-x-auto my-4">`);
  lines.push(`          <table className="w-full text-sm border border-border rounded-md">`);
  lines.push(`            <thead className="bg-bg-surface">`);
  lines.push(`              <tr><th className="p-2 border-b">Metric</th><th className="p-2 border-b">${bookA.title.slice(0, 20)}</th><th className="p-2 border-b">${bookB.title.slice(0, 20)}</th></tr>`);
  lines.push(`            </thead>`);
  lines.push(`            <tbody>`);
  lines.push(`              <tr><td className="p-2 border-b">Runtime</td><td className="p-2 border-b">${(bookA.runtimeMinutes / 60).toFixed(1)} hrs</td><td className="p-2 border-b">${(bookB.runtimeMinutes / 60).toFixed(1)} hrs</td></tr>`);
  lines.push(`              <tr><td className="p-2 border-b">Price</td><td className="p-2 border-b">$${bookA.price}</td><td className="p-2 border-b">$${bookB.price}</td></tr>`);
  lines.push(`              <tr><td className="p-2 border-b">Rating</td><td className="p-2 border-b">${bookA.starRating}★</td><td className="p-2 border-b">${bookB.starRating}★</td></tr>`);
  lines.push(`              <tr><td className="p-2 border-b">Value Score</td><td className="p-2 border-b font-semibold">${bookA.valueScore.toFixed(1)}</td><td className="p-2 border-b font-semibold">${bookB.valueScore.toFixed(1)}</td></tr>`);
  lines.push(`              <tr><td className="p-2 border-b">Cost/hour</td><td className="p-2 border-b">$${(bookA.price / (bookA.runtimeMinutes / 60)).toFixed(2)}</td><td className="p-2 border-b">$${(bookB.price / (bookB.runtimeMinutes / 60)).toFixed(2)}</td></tr>`);
  lines.push(`            </tbody>`);
  lines.push(`          </table>`);
  lines.push(`        </div>`);
  lines.push(`        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">The Verdict</h2>`);
  lines.push(`        <p><strong>${winner.title}</strong> wins on credit value (Value Score ${winner.valueScore.toFixed(1)} vs ${loser.valueScore.toFixed(1)}).</p>`);
  lines.push(`        <div className="bg-bg-surface p-4 rounded-md border border-border my-4">`);
  lines.push(`          <p className="text-sm"><strong>Recommendation:</strong> Choose <a href={"/books/${winner.asin}"} className="text-primary hover:underline">${winner.title}</a> for the best credit value.</p>`);
  lines.push(`        </div>`);
  lines.push(`      </>`);
  lines.push(`    ),`);
  lines.push(`  },`);
  return { slug: safeSlug, content: lines.join('\n') };
}

// ============ #4 榜单 ============
function generateCuratedList(category, count = 30) {
  const catBooks = books
    .filter(b =>
      b.categories.some(c => c.toLowerCase().includes(category.toLowerCase().split(' ')[0])) &&
      b.valueScore >= 6 &&
      !String(b.asin).startsWith('PENDING')
    )
    .sort((a, c) => c.valueScore - a.valueScore)
    .slice(0, count);

  if (catBooks.length < 5) return null;

  return {
    slug: `best-${category.toLowerCase().replace(/\s+/g, '-')}-for-credits`,
    title: `Best ${category} Audiobooks for Your Credits`,
    description: `Top ${catBooks.length} ${category.toLowerCase()} audiobooks ranked by Value Score.`,
    category: category,
    bookAsins: catBooks.map(b => b.asin),
    updatedAt: '2026-08-22',
  };
}

// ============ #5 how-to ============
const HOW_TO_POSTS = [
  {
    slug: 'how-to-get-a-free-30-day-audible-trial',
    title: 'How to Get a Free 30-Day Audible Trial in 2026',
    description: 'Step-by-step guide to signing up for Audible\'s free 30-day trial. Get 1 free audiobook plus access to the Plus Catalog.',
    keywords: ['audible free trial', 'audible 30 day trial', 'how to get audible free'],
    contentLines: [
      `<>`,
      `  <p>Audible's free 30-day trial gives you <strong>1 free audiobook</strong> of your choice plus full access to the <strong>Plus Catalog</strong>.</p>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">What You Get</h2>`,
      `  <ul className="space-y-2">`,
      `    <li>1 free audiobook (keep it even if you cancel)</li>`,
      `    <li>Full access to the Plus Catalog for 30 days</li>`,
      `    <li>No commitment — cancel anytime</li>`,
      `  </ul>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">How to Sign Up</h2>`,
      `  <ol className="list-decimal ml-5 space-y-1">`,
      `    <li>Go to audible.com and click "Start Your Free Trial"</li>`,
      `    <li>Create your account or sign in</li>`,
      `    <li>Pick your free book from the catalog</li>`,
      `    <li>Confirm your trial — no payment upfront</li>`,
      `  </ol>`,
      `  <div className="bg-bg-surface p-4 rounded-md border border-border my-4">`,
      `    <p className="text-sm"><strong>Pro tip:</strong> Use your free book on one of our highest Value Score picks. Check our <a href="/books" className="text-primary hover:underline">best books for credits</a> list.</p>`,
      `  </div>`,
      `</>`,
    ],
  },
  {
    slug: 'how-to-cancel-audible-and-keep-your-books',
    title: 'How to Cancel Audible and Keep Your Books',
    description: 'Cancel your Audible subscription without losing your purchased audiobooks. Complete guide with steps and FAQs.',
    keywords: ['cancel audible', 'audible cancellation', 'keep audible books after cancel'],
    contentLines: [
      `<>`,
      `  <p>Canceling Audible is easy — and <strong>you keep all your purchased audiobooks forever</strong>.</p>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Steps to Cancel</h2>`,
      `  <ol className="list-decimal ml-5 space-y-1">`,
      `    <li>Go to audible.com/my_member_central</li>`,
      `    <li>Click "Change Plan" or "Cancel Membership"</li>`,
      `    <li>Follow the prompts to confirm cancellation</li>`,
      `    <li>You'll keep all previously purchased titles</li>`,
      `  </ol>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">What Happens After Cancellation</h2>`,
      `  <ul className="space-y-2">`,
      `    <li>You lose access to the Plus Catalog</li>`,
      `    <li>Your credits expire — use them before canceling!</li>`,
      `    <li>All purchased books stay in your library</li>`,
      `  </ul>`,
      `</>`,
    ],
  },
  {
    slug: 'how-to-maximize-audible-credits-2026',
    title: 'How to Maximize Your Audible Credits in 2026',
    description: 'Strategic guide to getting the most listening time per credit. Tips on book selection, timing, and avoiding waste.',
    keywords: ['maximize audible credits', 'audible credit value tips', 'get more from audible'],
    contentLines: [
      `<>`,
      `  <p>Not all Audible credits are created equal. Some books give you 3x more listening time per dollar than others.</p>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Rule #1: Pick Long Books</h2>`,
      `  <p>A 20-hour epic fantasy costs the same credit as a 6-hour self-help book. The fantasy gives you 3x the value.</p>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Rule #2: Check the Rating</h2>`,
      `  <p>A 5-star 15-hour book is better than a 3-star 30-hour book. Use our Value Score which factors in both length and rating.</p>`,
      `  <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Rule #3: Time Your Purchases</h2>`,
      `  <p>Watch for sales and promotional credits that stretch your budget further.</p>`,
      `</>`,
    ],
  },
];

// ============ 主逻辑 ============
console.log('\n=== 生成内容 ===');

// #2 书评
const reviewPosts = [];
for (let i = 0; i < qualityBooks.length && reviewPosts.length < 100; i++) {
  const post = generateReviewPost(qualityBooks[i], reviewPosts.length + 1);
  if (post) reviewPosts.push(post);
}
console.log(`书评: ${reviewPosts.length} 篇`);

// #3 vs 对比文
const vsPosts = [];
const top50 = qualityBooks.slice(0, 50);
for (let i = 0; i < top50.length && vsPosts.length < 30; i++) {
  for (let j = i + 1; j < top50.length && vsPosts.length < 30; j++) {
    const catsA = top50[i].categories;
    const catsB = top50[j].categories;
    const differentGenre = !catsA.some(c => catsB.includes(c));
    if (differentGenre) {
      const post = generateVsPost(top50[i], top50[j]);
      if (post) vsPosts.push(post);
    }
  }
}
console.log(`vs对比文: ${vsPosts.length} 篇`);

// #4 榜单
const curatedLists = [];
const topCategories = ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'History', 'Biography', 'Self-Help', 'Business', 'Thriller', 'Classic'];
for (const cat of topCategories) {
  const list = generateCuratedList(cat);
  if (list) curatedLists.push(list);
}
console.log(`榜单: ${curatedLists.length} 个`);

// 保存榜单到 curated-lists.json
const existingLists = JSON.parse(readFileSync('data/curated-lists.json', 'utf8'));
const mergedLists = [...existingLists, ...curatedLists.filter(l => !existingLists.find(e => e.slug === l.slug))];
writeFileSync('data/curated-lists.json', JSON.stringify(mergedLists, null, 2) + '\n', 'utf8');
console.log(`curated-lists.json: ${mergedLists.length} 个榜单`);

// 保存 how-to 数据
writeFileSync('data/how-to-guides.json', JSON.stringify(HOW_TO_POSTS, null, 2), 'utf8');
console.log(`how-to: ${HOW_TO_POSTS.length} 篇`);

// 生成要追加到 posts.tsx 的代码
const lines = [];

// 添加书评
reviewPosts.forEach(p => lines.push(p.content));
console.log(`\n追加书评代码: ${reviewPosts.length} 篇`);

// 添加 vs 对比文
vsPosts.forEach(p => lines.push(p.content));
console.log(`追加 vs 对比文代码: ${vsPosts.length} 篇`);

// 添加 how-to 博客
HOW_TO_POSTS.forEach(post => {
  lines.push(`  '${post.slug}': {`);
  lines.push(`    slug: '${post.slug}',`);
  lines.push(`    title: '${post.title}',`);
  lines.push(`    description: '${post.description}',`);
  lines.push(`    keywords: [${post.keywords.map(k => `'${k}'`).join(', ')}],`);
  lines.push(`    date: '2026-08-22',`);
  lines.push(`    readTime: '5 min read',`);
  lines.push(`    category: '${post.keywords[0] === 'audible free trial' ? 'Guide' : post.keywords[0] === 'cancel audible' ? 'Guide' : 'Guide'}',`);
  lines.push(`    content: (`);
  lines.push(`      <>`);
  post.contentLines.forEach(l => lines.push(l));
  lines.push(`      </>`);
  lines.push(`    ),`);
  lines.push(`  },`);
});
console.log(`追加 how-to 代码: ${HOW_TO_POSTS.length} 篇`);

// 保存追加内容
const appendContent = '\n' + lines.join('\n') + '\n';
writeFileSync('data/blog/append-posts.txt', appendContent, 'utf8');
console.log(`\n已写入 data/blog/append-posts.txt (${appendContent.length} 字符)`);
console.log(`\n总计新增博客: ${reviewPosts.length + vsPosts.length + HOW_TO_POSTS.length} 篇`);
