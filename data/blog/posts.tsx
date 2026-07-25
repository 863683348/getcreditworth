/**
 * 博客文章数据层
 * 从 page.tsx 抽离，独立模块化管理
 */

import Link from 'next/link';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
}

export interface BlogPostData extends BlogPost {
  content: React.ReactNode;
}

const POSTS: Record<string, BlogPostData> = {
  'how-to-use-audible-credits': {
    slug: 'how-to-use-audible-credits',
    title: 'How to Use Audible Credits: A Complete Guide for 2026',
    description:
      'Everything you need to know about Audible credits — how they work, when they expire, and how to maximize their value.',
    date: '2026-07-25',
    readTime: '8 min read',
    category: 'Guide',
    content: (
      <>
        <p>
          Audible credits are the currency of the Audible subscription ecosystem. Each month,
          Premium Plus members receive credits that can be exchanged for any audiobook —
          regardless of price. But not all audiobooks are worth the same credit. This guide
          explains how credits work and how to get the most value from every one.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          What Are Audible Credits?
        </h2>
        <p>
          An Audible credit is a token that lets you download one audiobook from Audible&apos;s
          catalog of over 200,000 titles. The key insight: a credit is worth the same whether
          you spend it on a $5 short story or a $50 epic novel. This makes credit selection
          a value optimization problem.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">How Credits Work</h2>
        <ul className="space-y-2">
          <li>
            <strong>Monthly plans:</strong> Premium Plus gives 1 credit/month ($14.95). Premium
            Plus 2 gives 2 credits/month ($22.95).
          </li>
          <li>
            <strong>Annual plans:</strong> Premium Plus Annual gives 12 credits upfront ($149.50),
            reducing per-credit cost to $12.46.
          </li>
          <li>
            <strong>Expiration:</strong> Credits expire 12 months after they are issued. Cancel
            your subscription, and unused credits are forfeited.
          </li>
          <li>
            <strong>Rollover:</strong> You can roll over up to 6 credits (or more on some plans)
            into the next billing cycle.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          The Credit Value Problem
        </h2>
        <p>
          Since one credit equals one audiobook, the value of that credit depends entirely on
          which book you choose. Spending a credit on a $15 audiobook with 6 hours of content
          gives you a cost-per-hour of $2.50. But spending the same credit on a $35 audiobook
          with 45 hours of content gives you a cost-per-hour of just $0.33 — nearly 8x better
          value.
        </p>
        <p>
          This is why we created the Value Score: a formula that combines duration, rating,
          and price to rank audiobooks by true credit value.
        </p>

        <div className="bg-bg-surface p-4 rounded-md border border-border my-6">
          <p className="font-mono text-center text-lg text-text-primary">
            Value Score = (Duration in hours × Star Rating) / Price in USD
          </p>
        </div>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          How to Maximize Credit Value
        </h2>
        <ol className="space-y-3">
          <li>
            <strong>1. Check the Value Score first.</strong> Before spending a credit, look up
            the audiobook on GetCreditWorth. A score above 8.0 means excellent value; below 3.0
            suggests you should buy the book directly instead.
          </li>
          <li>
            <strong>2. Favor long audiobooks.</strong> Since credits are fixed-value, longer
            books deliver more listening hours per credit. Aim for 20+ hour audiobooks when
            possible.
          </li>
          <li>
            <strong>3. Use credits on expensive books.</strong> If a book costs more than $14.95
            (your credit&apos;s base value), using a credit saves you money. If it costs less,
            consider paying cash and saving the credit.
          </li>
          <li>
            <strong>4. Read reviews carefully.</strong> High ratings with thousands of reviews
            are more reliable than high ratings with only a handful. Our adjusted Value Score
            weights books with more reviews higher.
          </li>
          <li>
            <strong>5. Don&apos;t let credits expire.</strong> Set a reminder 30 days before
            expiration. Credits that expire are money wasted.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Common Mistakes to Avoid
        </h2>
        <ul className="space-y-2">
          <li>
            <strong>Spending credits on short books:</strong> A 4-hour book for a $14.95 credit
            is a poor deal.
          </li>
          <li>
            <strong>Ignoring narrator quality:</strong> A bad narrator can ruin a great book.
            Check narrator reviews.
          </li>
          <li>
            <strong>Forgetting about the Plus Catalog:</strong> Premium Plus members get access
            to thousands of free titles — use credits only for premium audiobooks.
          </li>
          <li>
            <strong>Hoarding credits:</strong> Credits expire. Better to spend them on decent
            books than lose them entirely.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Frequently Asked Questions
        </h2>
        <p>
          <strong>Can I get a refund on a credit purchase?</strong> Yes, Audible allows returns
          within 365 days if you&apos;re unsatisfied.
        </p>
        <p>
          <strong>Do credits carry over if I cancel?</strong> No. Canceling forfeits unused
          credits. Spend them first.
        </p>
        <p>
          <strong>Can I gift credits?</strong> Yes, but only through Audible&apos;s official
          gifting system.
        </p>

        <p className="mt-6 text-text-secondary">
          By applying these principles and using the Value Score, you can turn every Audible
          credit into maximum listening value. Start by browsing our{' '}
          <Link href="/" className="text-primary underline">
            top-ranked audiobooks
          </Link>
          .
        </p>
      </>
    ),
  },
  'best-audiobooks-for-credits': {
    slug: 'best-audiobooks-for-credits',
    title: 'Best Audiobooks to Spend Audible Credits On',
    description:
      'Top audiobook recommendations ranked by Value Score. Find the highest-value books for your credits.',
    date: '2026-07-25',
    readTime: '10 min read',
    category: 'Recommendations',
    content: (
      <>
        <p>
          When it comes to spending Audible credits, not all audiobooks are created equal. The
          best books for credits are long, highly-rated, and expensive — they give you the most
          listening time per credit. Here are our top picks, ranked by Value Score.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Top 5 Audiobooks by Value Score
        </h2>
        <p>
          These books represent the absolute best value for your Audible credits. Each one
          combines exceptional length, outstanding ratings, and premium pricing to maximize
          your credit&apos;s worth.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
          1. The Way of Kings by Brandon Sanderson
        </h3>
        <p>
          At 45+ hours with a 4.8-star rating, this epic fantasy is the gold standard for
          credit value. Narrated by Kate Reading and Michael Kramer, it kicks off the Stormlight
          Archive series — one of the most ambitious fantasy epics ever written.
        </p>
        <p>
          <strong>Value Score: 5.88+</strong> — Excellent credit investment.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
          2. The Stand by Stephen King
        </h3>
        <p>
          Nearly 47 hours of post-apocalyptic storytelling from the master of horror. The uncut
          version is one of King&apos;s longest works, making it a phenomenal credit value.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
          3. A Game of Thrones by George R.R. Martin
        </h3>
        <p>
          33+ hours of political intrigue, dragons, and betrayal. Roy Dotrice&apos;s narration
          brings Westeros to life with hundreds of distinct character voices.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
          4. Outlander by Diana Gabaldon
        </h3>
        <p>
          32 hours of time-traveling romance and adventure. Davina Porter&apos;s narration is
          widely considered one of the best in audiobook history.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">
          5. The Pillars of the Earth by Ken Follett
        </h3>
        <p>
          40+ hours of medieval cathedral-building drama. A sprawling historical epic that
          earns every minute of its runtime.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Best Value by Genre</h2>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">Fantasy</h3>
        <p>
          Fantasy dominates value rankings because epic series tend to be very long. Look for
          Brandon Sanderson, George R.R. Martin, and Robert Jordan — their books routinely
          exceed 30 hours.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">Science Fiction</h3>
        <p>
          Sci-fi offers excellent value with series like The Expanse and Dune. Project Hail Mary
          by Andy Weir (16 hours, 4.9 stars) is a standout single-book value.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">Historical Fiction</h3>
        <p>
          Ken Follett and Diana Gabaldon are the kings of long historical fiction. Their books
          often exceed 30 hours and maintain high ratings throughout.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2">Non-Fiction</h3>
        <p>
          Non-fiction tends to be shorter (8-15 hours), so be selective. Biographies like Walter
          Isaacson&apos;s Steve Jobs (25 hours) offer good value, while self-help books are often
          better bought directly.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Books to Buy Directly (Not Use Credits)
        </h2>
        <p>
          Some audiobooks are cheap enough that you&apos;re better off paying cash and saving
          your credit for something more expensive:
        </p>
        <ul className="space-y-2">
          <li>Books under $15 — buying direct often costs less than a credit</li>
          <li>Short self-help books (under 8 hours) — limited value per credit</li>
          <li>Plus Catalog titles — free for Premium Plus members, no credit needed</li>
        </ul>

        <p className="mt-6">
          Ready to find your next great listen? Check our{' '}
          <Link href="/" className="text-primary underline">
            full Value Score rankings
          </Link>{' '}
          to see every audiobook ranked by credit value.
        </p>
      </>
    ),
  },
  'audible-credit-value': {
    slug: 'audible-credit-value',
    title: 'How Much Is an Audible Credit Actually Worth?',
    description:
      'Audible credits cost $14.95 each, but their true value depends on how you spend them. Here\'s how to calculate it.',
    date: '2026-07-25',
    readTime: '6 min read',
    category: 'Analysis',
    content: (
      <>
        <p>
          On paper, an Audible credit costs $14.95 — the monthly price of a Premium Plus
          subscription. But the real value of that credit depends entirely on how you spend it.
          Let&apos;s break down the math.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          The Base Value: $14.95
        </h2>
        <p>
          If you&apos;re on the standard Premium Plus plan ($14.95/month, 1 credit), each credit
          has a base value of $14.95. This is the floor — the minimum you should expect to get
          from spending it.
        </p>
        <p>
          But here&apos;s the thing: you can spend a credit on any audiobook, regardless of price.
          A $5 book or a $50 book — either costs exactly one credit. This is where optimization
          comes in.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          The True Value Formula
        </h2>
        <p>
          The true value of a credit isn&apos;t just about price — it&apos;s about what you get
          for that price. We measure this with Value Score:
        </p>
        <div className="bg-bg-surface p-4 rounded-md border border-border my-4">
          <p className="font-mono text-center text-lg text-text-primary">
            Value Score = (Duration in hours × Star Rating) / Price in USD
          </p>
        </div>
        <p>This formula captures three key factors:</p>
        <ul className="space-y-2">
          <li>
            <strong>Duration:</strong> More hours = more entertainment per credit
          </li>
          <li>
            <strong>Rating:</strong> Higher quality = better use of your time
          </li>
          <li>
            <strong>Price:</strong> Higher price = more savings when using a credit
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Credit Value by Plan
        </h2>
        <p>Your subscription plan affects the actual cost per credit:</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-md">
            <thead className="bg-bg-surface">
              <tr>
                <th className="text-left p-3 border-b border-border">Plan</th>
                <th className="text-left p-3 border-b border-border">Monthly Cost</th>
                <th className="text-left p-3 border-b border-border">Credits/Month</th>
                <th className="text-left p-3 border-b border-border">Cost per Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-border">Premium Plus</td>
                <td className="p-3 border-b border-border font-mono">$14.95</td>
                <td className="p-3 border-b border-border font-mono">1</td>
                <td className="p-3 border-b border-border font-mono">$14.95</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-border">Premium Plus 2</td>
                <td className="p-3 border-b border-border font-mono">$22.95</td>
                <td className="p-3 border-b border-border font-mono">2</td>
                <td className="p-3 border-b border-border font-mono">$11.48</td>
              </tr>
              <tr>
                <td className="p-3">Premium Plus Annual</td>
                <td className="p-3 font-mono">$149.50/yr</td>
                <td className="p-3 font-mono">12 upfront</td>
                <td className="p-3 font-mono">$12.46</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The Premium Plus 2 plan offers the lowest per-credit cost ($11.48), but only if you
          consistently use both credits each month.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          Example: Good vs. Bad Credit Use
        </h2>
        <p>Consider two audiobooks:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-success/5 rounded-md border border-success/30">
            <h4 className="font-semibold text-success mb-2">Good Credit Use</h4>
            <p className="text-sm">
              <strong>The Way of Kings</strong>
            </p>
            <p className="text-sm">Price: $38.99 | Duration: 45.5h | Rating: 4.8</p>
            <p className="text-sm mt-2">
              Value Score: <span className="font-mono font-bold">5.59</span>
            </p>
            <p className="text-sm">
              Savings vs. credit: <span className="font-mono font-bold text-success">+$24.04</span>
            </p>
          </div>
          <div className="p-4 bg-warning/5 rounded-md border border-warning/30">
            <h4 className="font-semibold text-warning mb-2">Poor Credit Use</h4>
            <p className="text-sm">
              <strong>Atomic Habits</strong>
            </p>
            <p className="text-sm">Price: $14.99 | Duration: 5.2h | Rating: 4.7</p>
            <p className="text-sm mt-2">
              Value Score: <span className="font-mono font-bold">1.63</span>
            </p>
            <p className="text-sm">
              Savings vs. credit: <span className="font-mono font-bold text-warning">+$0.04</span>
            </p>
          </div>
        </div>
        <p>
          The first book gives you 45 hours of premium content and saves you $24. The second
          book barely beats the credit value and delivers only 5 hours. Same credit, vastly
          different outcome.
        </p>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">
          When to Buy Directly
        </h2>
        <p>
          If a book costs less than your credit&apos;s value ($14.95 for Premium Plus), consider
          buying it directly and saving the credit for a more expensive book. The break-even
          point is simple:
        </p>
        <ul className="space-y-2">
          <li>
            Book price &gt; $14.95 → <strong>Use a credit</strong> (you save money)
          </li>
          <li>
            Book price &lt; $14.95 → <strong>Buy directly</strong> (save the credit)
          </li>
          <li>Book price ≈ $14.95 → Consider duration and rating to decide</li>
        </ul>

        <h2 className="text-xl font-semibold text-text-primary mt-6 mb-3">Conclusion</h2>
        <p>
          An Audible credit is worth $14.95 in cash terms — but it can be worth much more in
          listening value. By choosing long, highly-rated, expensive audiobooks, you can turn
          each credit into 40+ hours of premium entertainment. That&apos;s the power of the
          Value Score.
        </p>
        <p className="mt-4">
          Use our{' '}
          <Link href="/calculator" className="text-primary underline">
            Credit Calculator
          </Link>{' '}
          to see exactly how much your credits are worth, or browse the{' '}
          <Link href="/" className="text-primary underline">
            top-ranked books
          </Link>{' '}
          to start maximizing your value today.
        </p>
      </>
    ),
  },
};

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(POSTS).map(({ content, ...meta }) => meta);
}

export function getBlogPost(slug: string): BlogPostData | undefined {
  return POSTS[slug];
}

export function getBlogSlugs(): string[] {
  return Object.keys(POSTS);
}
