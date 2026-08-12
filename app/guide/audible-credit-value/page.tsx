import { getAllPosts } from "@/lib/api/controllers/blog.controller";
import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { FaqPageJsonLd, BreadcrumbListJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Audible Credit Value Guide 2026 — How Much Is a Credit Really Worth?",
  description:
    "Complete guide to Audible credit value in 2026. Learn how to maximize every $14.95 credit with our data-driven recommendations, value calculator tips, and top book picks across all genres.",
  keywords: [
    "how much is an audible credit worth",
    "audible credit value",
    "audible credit worth 2026",
    "audible credit value guide",
    "maximize audible credits",
    "best audible books for credits",
    "audible credit optimizer",
    "audible premium plus value",
    "is audible credit worth it",
    "audible credit vs buy directly",
  ],
  alternates: { canonical: buildCanonicalUrl("/guide/audible-credit-value") },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Audible Credit Value Guide 2026 — How Much Is a Credit Really Worth?",
    description:
      "Complete guide to Audible credit value. Learn the math behind $14.95 credits and discover the best audiobooks to spend them on.",
    type: "article",
    url: buildCanonicalUrl("/guide/audible-credit-value"),
    publishedTime: "2026-08-12",
    modifiedTime: "2026-08-12",
    authors: ["GetCreditWorth"],
    section: "Guide",
    tags: ["audible", "credit value", "audiobook guide"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audible Credit Value Guide 2026 — How Much Is a Credit Really Worth?",
    description:
      "Complete guide to Audible credit value. Learn the math behind $14.95 credits and discover the best audiobooks to spend them on.",
  },
};

const guidePosts = [
  {
    slug: "audible-credit-value",
    title: "How Much Is an Audible Credit Actually Worth?",
    excerpt: "The math behind $14.95 credits and how to calculate real value.",
  },
  {
    slug: "how-much-is-audible-credit-worth-2026",
    title: "How Much Is an Audible Credit Worth in 2026?",
    excerpt: "Updated pricing analysis for 2026 with new plan options.",
  },
  {
    slug: "audible-credit-value-calculator-stop-wasting",
    title: "Audible Credit Value Calculator: Stop Wasting Credits",
    excerpt: "Use data-driven scoring to pick books that maximize your credits.",
  },
  {
    slug: "best-audiobooks-for-credits",
    title: "Best Audiobooks for Audible Credits (2026)",
    excerpt: "Top-rated, longest audiobooks that give you the most value per credit.",
  },
  {
    slug: "is-audible-worth-it-2026",
    title: "Is Audible Worth It in 2026? Complete Analysis",
    excerpt: "Honest pros and cons of Audible Premium Plus in 2026.",
  },
  {
    slug: "audible-plus-catalog-vs-credits",
    title: "Audible Plus Catalog vs Credits: Which Is Better?",
    excerpt: "When to use credits vs. when to stream from the Plus catalog for free.",
  },
  {
    slug: "how-to-cancel-audible-subscription",
    title: "How to Cancel Audible Subscription in 2026: Step-by-Step Guide & Full Refund",
    excerpt: "Cancel smart — return books first, avoid fees, get full refund.",
  },
  {
    slug: "audible-return-refund-policy",
    title: "Audible Return & Refund Policy: Complete Guide (2026)",
    excerpt: "365-day return policy explained — how to get credits back easily.",
  },
];

const faqQuestions = [
  {
    question: "How much is an Audible credit worth in 2026?",
    answer:
      "An Audible credit costs $14.95 on the Premium Plus plan (1 credit/month). On the Premium Plus 2 plan, each credit drops to $11.48 (2 credits/month for $22.95). On the annual plan, each credit costs about $12.46. The actual value depends on which book you choose — a $40 bestseller gives you $25+ in savings, while a $5 book wastes most of the credit.",
  },
  {
    question: "Should I use an Audible credit or buy the book directly?",
    answer:
      "Use a credit for books priced above $14.95 — you save money. Buy directly for books under $10, especially bestsellers on sale. The key metric is Value Score: books with a Value Score above 5.0 are excellent credit uses, 3.0–5.0 are good, and below 3.0 are better bought directly.",
  },
  {
    question: "What is the best way to maximize Audible credit value?",
    answer:
      "1) Pick long audiobooks (20+ hours) with high ratings (4.5+ stars). 2) Focus on expensive titles ($25–$50) that would cost more than a credit. 3) Consider the Premium Plus 2 plan if you listen to 2+ books/month. 4) Return books you don't love within 365 days and reuse the credit. 5) Use our Value Score calculator to compare options before spending.",
  },
  {
    question: "Can I get a refund if I don't like a book I used a credit for?",
    answer:
      "Yes. Audible allows returns within 365 days of purchase — far longer than most retailers. Simply go to Account Details → Purchase History, find the audiobook, and click Return. If you paid with a credit, it's restored instantly. If you paid cash, the refund goes back to your original payment method within 5–7 business days.",
  },
  {
    question: "What's the difference between Audible Plus and Premium Plus?",
    answer:
      "Audible Plus ($9.95/month) gives you access to the Plus Catalog — a rotating collection of thousands of titles you can stream for free. Premium Plus ($14.95/month) includes the Plus Catalog PLUS one credit per month to pick any title regardless of price. If you want the newest bestsellers and longest titles, Premium Plus is the better value.",
  },
  {
    question: "Do Audible credits expire?",
    answer:
      "Credits do not expire as long as your subscription remains active. If you cancel, any unused credits are forfeited. That's why we recommend spending credits before canceling — or returning books and reusing the credit on a new subscription.",
  },
];

export default function AudibleCreditValueGuide() {
  const posts = getAllPosts();
  const topBooks = getTopBookList(12);

  return (
    <div className="container-content py-8 md:py-12">
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Audible Credit Value Guide", url: "/guide/audible-credit-value" },
        ]}
      />
      <WebsiteJsonLd />

      {/* Hero */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Audible Credit Value Guide 2026
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Every Audible credit costs ~$14.95 — but its real value depends entirely on how you spend it.
          This guide breaks down the math, shows you the best books to pick, and helps you never waste
          a credit again.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="inline-flex items-center px-5 py-2.5 rounded-md bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Use Credit Calculator →
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center px-5 py-2.5 rounded-md border border-border text-text-primary font-medium hover:bg-bg-surface transition-colors"
          >
            Browse Top Books
          </Link>
        </div>
      </header>

      {/* The Math */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">The Math Behind a Credit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-bg-surface rounded-md border border-border">
            <p className="text-sm text-text-secondary mb-1">Premium Plus (1 credit)</p>
            <p className="text-3xl font-bold text-text-primary">$14.95</p>
            <p className="text-sm text-text-muted mt-1">per credit</p>
          </div>
          <div className="p-5 bg-bg-surface rounded-md border border-border">
            <p className="text-sm text-text-secondary mb-1">Premium Plus 2 (2 credits)</p>
            <p className="text-3xl font-bold text-text-primary">$11.48</p>
            <p className="text-sm text-text-muted mt-1">per credit · best value</p>
          </div>
          <div className="p-5 bg-bg-surface rounded-md border border-border">
            <p className="text-sm text-text-secondary mb-1">Annual plan (12 upfront)</p>
            <p className="text-3xl font-bold text-text-primary">$12.46</p>
            <p className="text-sm text-text-muted mt-1">per credit · lock in price</p>
          </div>
        </div>
        <p className="text-text-secondary">
          The <strong>real value</strong> of a credit is determined by what book you choose. A $40
          fantasy epic gives you $25 in savings; a $5 short book wastes 87% of the credit. Our{" "}
          <Link href="/calculator" className="text-primary hover:underline">
            Value Score calculator
          </Link>{" "}
          ranks 3,900+ books by how much value you get per credit.
        </p>
      </section>

      {/* Quick Tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">5 Rules for Max Value</h2>
        <ol className="space-y-3 list-decimal list-inside text-text-secondary">
          <li>
            <strong>Pick long books (20+ hours)</strong> — more hours = more value per credit
          </li>
          <li>
            <strong>Choose highly-rated titles (4.5★+)</strong> — time spent listening should be worth it
          </li>
          <li>
            <strong>Target expensive books ($25–$50)</strong> — that's where credits save the most
          </li>
          <li>
            <strong>Use the Premium Plus 2 plan</strong> if you listen to 2+ books/month
          </li>
          <li>
            <strong>Return what you don't love</strong> — 365-day return window, credits restored instantly
          </li>
        </ol>
      </section>

      {/* Top Picks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Top Credit-Worthy Picks (2026)</h2>
        <p className="text-text-secondary mb-6">
          These 12 books consistently score highest on our Value Score — long runtime, top ratings,
          and prices that make credits shine.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topBooks.map((book) => (
            <Link
              key={book.asin}
              href={`/books/${book.asin}`}
              className="p-4 bg-bg-surface rounded-md border border-border hover:border-primary transition-colors group"
            >
              <div className="flex gap-3">
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={`${book.title} cover`}
                    className="w-12 h-16 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">{book.author}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-accent">★ {book.starRating.toFixed(1)}</span>
                    <span className="text-text-muted">·</span>
                    <span className="text-text-muted">{book.runtimeHours.toFixed(0)}h</span>
                    <span className="text-text-muted">·</span>
                    <span className="text-success font-medium">
                      {book.valueScore >= 8 ? "Excellent" : book.valueScore >= 5 ? "Good" : "Fair"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/books" className="text-primary hover:underline text-sm">
            View all 3,900+ books →
          </Link>
        </div>
      </section>

      {/* Related Guides */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Related Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="p-5 bg-bg-surface rounded-md border border-border hover:border-primary transition-colors group"
            >
              <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-text-secondary">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqQuestions.map((faq, i) => (
            <details key={i} className="group bg-bg-surface rounded-md border border-border overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-text-primary hover:text-primary transition-colors">
                {faq.question}
                <svg
                  className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-text-secondary">{faq.answer}</div>
            </details>
          ))}
        </div>
        <FaqPageJsonLd questions={faqQuestions} />
      </section>

      {/* CTA */}
      <section className="text-center py-10 bg-bg-surface rounded-md border border-border">
        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Stop Guessing. Start Optimizing.
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto mb-6">
          Use our free calculator to see exactly which books give you the most value per Audible
          credit. 3,900+ titles ranked by data.
        </p>
        <Link
          href="/calculator"
          className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          Calculate Your Best Credit Use →
        </Link>
      </section>
    </div>
  );
}
