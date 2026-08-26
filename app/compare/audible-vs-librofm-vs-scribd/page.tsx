import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import { AUDIBLE_CREDIT_VALUE } from "@/lib/config";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audible vs Libro.fm vs Scribd 2026 — Which Audiobook Service Is Best Value?",
  description:
    "Audible vs Libro.fm vs Scribd comparison 2026: prices, credit systems, catalog size, and narration quality. Find the best audiobook subscription for your budget and listening habits.",
  keywords: [
    "audible vs libro.fm",
    "audible vs scribd",
    "best audiobook subscription 2026",
    "audible credit vs subscription",
    "libro.fm vs audible",
    "scribd audiobook unlimited",
    "audible premium plus vs scribd",
    "audiobook subscription comparison",
  ],
  alternates: { canonical: buildCanonicalUrl("/compare/audible-vs-librofm-vs-scribd") },
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
    title: "Audible vs Libro.fm vs Scribd 2026 — Best Audiobook Subscription?",
    description:
      "Compare Audible, Libro.fm, and Scribd: pricing, catalogs, credit systems, and value for audiobook listeners in 2026.",
    type: "article",
    url: buildCanonicalUrl("/compare/audible-vs-librofm-vs-scribd"),
    publishedTime: "2026-08-12",
    modifiedTime: "2026-08-12",
    authors: ["GetCreditWorth"],
    section: "Comparison",
    tags: ["audible", "libro.fm", "scribd", "audiobook comparison"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audible vs Libro.fm vs Scribd 2026 — Best Audiobook Subscription?",
    description:
      "Compare Audible, Libro.fm, and Scribd pricing, catalogs, and value. Find the best audiobook subscription for your listening habits.",
  },
};

const PLATFORMS = [
  {
    name: "Audible",
    price: "$14.95/mo",
    credits: "1 credit/month (Premium Plus)",
    catalog: "~400,000 titles",
    exclusives: "Audible Originals (20,000+)",
    carryover: "Up to 2 credits",
    refund: "365-day return policy",
    costPerHour: "~$1.06–1.50/hr",
    highlights: [
      "Largest catalog in the industry",
      "Audible Originals unavailable elsewhere",
      "Best value on long audiobooks via credits",
      "Free 30-day trial for new members",
    ],
    drawbacks: [
      "Credits expire if not used within 12 months",
      "No unlimited plan (credit-based only)",
      "Premium Plus 2 costs $22.95/mo",
    ],
    bestFor: "Listeners who want the largest catalog and binge long audiobooks",
    recommendation: "Best overall value for credit spenders",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Libro.fm",
    price: "$14.95/mo",
    credits: "1 credit/month",
    catalog: "~100,000 titles",
    exclusives: "None (retails local bookstores)",
    carryover: "No carryover",
    refund: "100% money-back guarantee",
    costPerHour: "~$1.06–2.00/hr",
    highlights: [
      "Supports local independent bookstores",
      "Gift subscriptions include bookstore donations",
      "Same narration as Audible (shared wholesale)",
      "No expiration on credits",
    ],
    drawbacks: [
      "Smaller catalog than Audible",
      "Fewer exclusive titles",
      "No unlimited/flat-rate plan",
      "No podcast integration",
    ],
    bestFor: "Readers who want to support local bookstores while listening",
    recommendation: "Best for ethical listeners and bookstore supporters",
    color: "from-green-500 to-green-700",
  },
  {
    name: "Scribd",
    price: "$11.99/mo",
    credits: "Unlimited listening",
    catalog: "~50,000 audiobooks",
    exclusives: "Limited originals",
    carryover: "N/A (unlimited)",
    refund: "No per-book returns (unlimited)",
    costPerHour: "~$0.10–0.50/hr (unlimited)",
    highlights: [
      "True unlimited listening for one flat price",
      "Includes ebooks and magazines",
      "Cheapest per-hour cost for heavy listeners",
      "No credit management needed",
    ],
    drawbacks: [
      "Smallest audiobook catalog of the three",
      "Quality control varies (some titles user-uploaded)",
      "No carryover benefit (use-it-or-lose-it monthly)",
      "Fewer new releases and bestsellers",
    ],
    bestFor: "Heavy listeners who consume 10+ audiobooks per month",
    recommendation: "Best for bingers and budget-conscious unlimited listeners",
    color: "from-orange-500 to-orange-700",
  },
];

const FAQ_QUESTIONS = [
  {
    question: "Is Audible better than Libro.fm?",
    answer: `Audible has a larger catalog (400K vs 100K titles) and exclusive Originals, while Libro.fm supports local bookstores. If catalog size matters most, choose Audible. If you want to support independent bookshops, choose Libro.fm. Both offer the same credit pricing at $14.95/month.`,
  },
  {
    question: "Is Scribd cheaper than Audible?",
    answer: `Scribd costs $11.99/month for unlimited listening, while Audible costs $14.95/month for one credit. If you listen to 2+ audiobooks per month, Scribd is cheaper per hour. However, Scribd's catalog is much smaller (50K vs 400K), and quality varies.`,
  },
  {
    question: "Which audiobook subscription has the best value in 2026?",
    answer: `For most listeners, Audible Premium Plus ($14.95/month, 1 credit) offers the best value because its 400,000-title catalog means you can always find a high-value credit spend. Heavy listeners (10+ books/month) should consider Scribd's unlimited plan at $11.99/month. Libro.fm is ideal for ethical listeners who want to support local bookstores.`,
  },
  {
    question: "Can I switch between Audible and Scribd?",
    answer: `Yes — Audible credits and Scribd subscriptions are independent. Many listeners use Audible for new releases and Scribd for backlist and deep listening. You can cancel Audible anytime and switch to Scribd without losing your credit balance (unused credits are forfeited upon cancellation).`,
  },
  {
    question: "Does Audible have an unlimited plan like Scribd?",
    answer: `No, Audible does not offer an unlimited plan. It uses a credit-based system where you get one credit per month (Premium Plus) or two credits (Premium Plus 2 at $22.95/month). Scribd is the only major platform offering true unlimited listening at a flat rate.`,
  },
  {
    question: "Which platform has the best audiobook selection for 2026?",
    answer: `Audible has the largest catalog at ~400,000 titles, followed by Scribd (~50,000) and Libro.fm (~100,000). However, many titles are shared across platforms via wholesale agreements. Audible's exclusives (Originals) are only available on Audible and are a key differentiator.`,
  },
];

export default function ComparePlatformsPage() {
  const topBooks = getTopBookList(200);

  return (
    <div className="container-content py-8 md:py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Audible vs Libro.fm vs Scribd — 2026 Comparison
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Which audiobook subscription gives you the best value in 2026? We compare pricing,
          catalogs, credit systems, and real cost-per-hour across the three major platforms.
        </p>
      </div>

      {/* Quick Comparison Table */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-bg-surface">
                <th className="text-left p-4 border-b border-border">Feature</th>
                <th className="text-left p-4 border-b border-border">Audible</th>
                <th className="text-left p-4 border-b border-border">Libro.fm</th>
                <th className="text-left p-4 border-b border-border">Scribd</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-border font-medium">Monthly Price</td>
                <td className="p-4 border-b border-border font-mono">$14.95</td>
                <td className="p-4 border-b border-border font-mono">$14.95</td>
                <td className="p-4 border-b border-border font-mono">$11.99</td>
              </tr>
              <tr className="bg-bg-surface">
                <td className="p-4 border-b border-border font-medium">Model</td>
                <td className="p-4 border-b border-border">Credit (1/month)</td>
                <td className="p-4 border-b border-border">Credit (1/month)</td>
                <td className="p-4 border-b border-border">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Catalog Size</td>
                <td className="p-4 border-b border-border">~400,000</td>
                <td className="p-4 border-b border-border">~100,000</td>
                <td className="p-4 border-b border-border">~50,000</td>
              </tr>
              <tr className="bg-bg-surface">
                <td className="p-4 border-b border-border font-medium">Cost per Hour</td>
                <td className="p-4 border-b border-border">~$1.06–1.50</td>
                <td className="p-4 border-b border-border">~$1.06–2.00</td>
                <td className="p-4 border-b border-border font-bold text-success">~$0.10–0.50</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Best For</td>
                <td className="p-4 border-b border-border">Catalog depth & exclusives</td>
                <td className="p-4 border-b border-border">Supporting local bookstores</td>
                <td className="p-4 border-b border-border">Bingers & budget listeners</td>
              </tr>
              <tr className="bg-bg-surface">
                <td className="p-4 border-b border-border font-medium">Credit Expiry</td>
                <td className="p-4 border-b border-border">12 months</td>
                <td className="p-4 border-b border-border">No expiry</td>
                <td className="p-4 border-b border-border">N/A (unlimited)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.name}
            className={`rounded-lg border border-border p-6 bg-gradient-to-b ${
              platform.name === "Audible"
                ? "from-purple-50 to-white"
                : platform.name === "Libro.fm"
                ? "from-green-50 to-white"
                : "from-orange-50 to-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-lg mb-4`}
            >
              {platform.name[0]}
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">{platform.name}</h3>
            <p className="text-sm text-text-secondary mb-4">{platform.bestFor}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-medium">Price:</span> {platform.price}
              </p>
              <p className="text-sm">
                <span className="font-medium">Model:</span> {platform.credits}
              </p>
              <p className="text-sm">
                <span className="font-medium">Catalog:</span> {platform.catalog}
              </p>
              <p className="text-sm">
                <span className="font-medium">Cost/hr:</span> {platform.costPerHour}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-text-primary mb-2">Pros</p>
              <ul className="text-sm space-y-1">
                {platform.highlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span className="text-text-secondary">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-text-primary mb-2">Cons</p>
              <ul className="text-sm space-y-1">
                {platform.drawbacks.slice(0, 2).map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">×</span>
                    <span className="text-text-secondary">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold text-primary">
                Best for: {platform.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Value Analysis */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Credit Value Analysis: Which Platform Wins?
        </h2>
        <div className="bg-bg-surface rounded-lg p-6 border border-border">
          <p className="text-text-secondary mb-4">
            The real value of an audiobook subscription depends on how many books you listen to
            per month. Here is how the three platforms compare at different usage levels:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b">Monthly Usage</th>
                  <th className="text-left p-3 border-b">Audible</th>
                  <th className="text-left p-3 border-b">Libro.fm</th>
                  <th className="text-left p-3 border-b">Scribd</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b">1 audiobook</td>
                  <td className="p-3 border-b">$14.95</td>
                  <td className="p-3 border-b">$14.95</td>
                  <td className="p-3 border-b font-bold text-success">$11.99</td>
                </tr>
                <tr className="bg-bg-surface">
                  <td className="p-3 border-b">2 audiobooks</td>
                  <td className="p-3 border-b">$7.48/book</td>
                  <td className="p-3 border-b">$7.48/book</td>
                  <td className="p-3 border-b font-bold text-success">$11.99</td>
                </tr>
                <tr>
                  <td className="p-3 border-b">3+ audiobooks</td>
                  <td className="p-3 border-b">Requires Premium Plus 2</td>
                  <td className="p-3 border-b">Requires Premium Plus 2</td>
                  <td className="p-3 border-b font-bold text-success">$11.99 (unlimited)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            <strong>Bottom line:</strong> For 1–2 audiobooks per month, Audible and Libro.fm are
            comparable. For 3+ books, Scribd becomes the clear value winner.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_QUESTIONS.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg p-5">
              <h3 className="font-semibold text-text-primary mb-2">{faq.question}</h3>
              <p className="text-text-secondary text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Book Picks */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Top Books to Test Your Subscription
        </h2>
        <p className="text-text-secondary mb-6">
          Use your first credit (or Scribd unlimited) on these high-value titles to test each
          platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topBooks.slice(0, 8).map((book) => (
            <Link
              key={book.asin}
              href={`/books/${book.asin}`}
              className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors"
            >
              <p className="font-semibold text-text-primary text-sm truncate">{book.title}</p>
              <p className="text-xs text-text-secondary mt-1">
                {book.runtimeHours.toFixed(1)}h · {book.starRating}★
              </p>
              <p className="text-xs font-mono text-primary mt-1">
                Value: {book.valueScore.toFixed(1)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8 bg-primary-50 rounded-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Ready to Maximize Your Audiobook Value?
        </h2>
        <p className="text-text-secondary mb-6 max-w-xl mx-auto">
          Use our Credit Value Calculator to find the best audiobooks for your credits — or
          browse our full comparison tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Try the Calculator
          </Link>
          <Link
            href="/guide/audible-credit-value"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Credit Value Guide
          </Link>
        </div>
      </div>

      <FaqPageJsonLd questions={FAQ_QUESTIONS} />
    </div>
  );
}
