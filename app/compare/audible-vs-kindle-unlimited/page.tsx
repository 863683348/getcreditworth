import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audible vs Kindle Unlimited 2026 — Which Unlimited Service Is Better?",
  description:
    "Audible vs Kindle Unlimited comparison 2026: prices, catalogs, and value. Find the best audiobook and ebook subscription for your budget.",
  keywords: [
    "audible vs kindle unlimited",
    "kindle unlimited vs audible",
    "best audiobook subscription 2026",
    "audible credit vs kindle unlimited",
    "kindle unlimited audiobooks",
  ],
  alternates: { canonical: buildCanonicalUrl("/compare/audible-vs-kindle-unlimited") },
  openGraph: {
    title: "Audible vs Kindle Unlimited 2026 — Best Value?",
    description: "Compare Audible and Kindle Unlimited: pricing, catalogs, and credit value for audiobook and ebook listeners.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audible vs Kindle Unlimited 2026 — Best Value?",
    description: "Compare Audible and Kindle Unlimited pricing, catalogs, and value for audiobook listeners.",
  },
};

const PLATFORMS = [
  {
    name: "Audible",
    price: "$14.95/mo",
    credits: "1 credit/month (Premium Plus)",
    catalog: "~400,000 audiobooks",
    exclusives: "Audible Originals (20,000+)",
    carryover: "Up to 2 credits",
    refund: "365-day return policy",
    costPerHour: "~$1.06–1.50/hr",
    highlights: [
      "Largest audiobook catalog",
      "Audible Originals unavailable elsewhere",
      "Credit-based model = keep books forever",
      "Free 30-day trial",
    ],
    drawbacks: [
      "Credits expire after 12 months",
      "No ebook access",
      "Premium Plus 2 costs $22.95/mo",
    ],
    bestFor: "Dedicated audiobook listeners who want to own their books",
    recommendation: "Best for audiobook-first listeners",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Kindle Unlimited",
    price: "$11.99/mo",
    credits: "Unlimited reads (borrow)",
    catalog: "~4,000,000 ebooks + audiobooks",
    exclusives: "Kindle Singles",
    carryover: "None — returns required",
    refund: "N/A",
    costPerHour: "~$0.00–0.50/hr (if you read enough)",
    highlights: [
      "Includes audiobooks + ebooks",
      "Larger overall catalog",
      "No individual credits to spend",
      "Cheaper monthly price",
    ],
    drawbacks: [
      "Must return all borrowed books",
      "Limited audiobook selection",
      "Many popular titles not included",
      "No ownership of borrowed books",
    ],
    bestFor: "Heavy readers who want both ebooks and audiobooks",
    recommendation: "Better if you read a lot of books per month",
    color: "from-orange-500 to-orange-700",
  },
];

const FAQ_QUESTIONS = [
  {
    question: "Does Kindle Unlimited include audiobooks?",
    answer: "Yes, Kindle Unlimited includes access to thousands of audiobooks, but the selection is much smaller than Audible's catalog. Most audiobooks on Kindle Unlimited are included in the monthly price, but popular titles may not be available.",
  },
  {
    question: "Is Audible cheaper than Kindle Unlimited for audiobooks?",
    answer: "If you listen to 1-2 audiobooks per month, Audible's credit system offers better value for premium titles. Kindle Unlimited is cheaper upfront but has a smaller audiobook selection. For heavy listeners, Audible is generally better value.",
  },
  {
    question: "Can I keep Kindle Unlimited audiobooks forever?",
    answer: "No. Kindle Unlimited operates on a borrowing model — you must return borrowed audiobooks. Audible credits let you keep books permanently, even after canceling your subscription.",
  },
  {
    question: "Which has more titles: Audible or Kindle Unlimited?",
    answer: "Kindle Unlimited has a larger total catalog (~4 million titles), but Audible has a more extensive audiobook-specific selection with over 400,000 titles. For audiobooks specifically, Audible is larger.",
  },
  {
    question: "Should I subscribe to both Audible and Kindle Unlimited?",
    answer: "It depends on your listening habits. If you read a mix of ebooks and audiobooks and want variety, both can complement each other. For dedicated audiobook listeners, Audible alone usually provides better value.",
  },
];

export default function ComparePage() {
  const topBooks = getTopBookList(20);

  return (
    <div className="container-content py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-4">
        Audible vs Kindle Unlimited 2026
      </h1>
      <p className="text-text-secondary mb-8">
        Which unlimited subscription service is better for your listening and reading habits?
      </p>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 text-text-muted font-medium">Feature</th>
              <th className="text-left py-3 px-4 text-primary font-semibold">Audible</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold">Kindle Unlimited</th>
            </tr>
          </thead>
          <tbody>
            {PLATFORMS.map((platform) => (
              <tr key={platform.name} className="border-b border-border">
                <td className="py-3 px-4 font-medium text-text-primary">{platform.name}</td>
                <td className="py-3 px-4 text-text-secondary">
                  Price: <span className="font-semibold text-text-primary">{platform.price}</span>
                </td>
                <td className="py-3 px-4 text-text-secondary">
                  Price: <span className="font-semibold text-text-primary">{platform.price}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.name}
            className={`p-6 rounded-lg border-2 ${platform.name === "Audible" ? "border-primary bg-primary-50" : "border-border"}`}
          >
            <h2 className="text-xl font-bold text-text-primary mb-4">{platform.name}</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-text-primary">Price:</span> {platform.price}</p>
              <p><span className="font-medium text-text-primary">Credits:</span> {platform.credits}</p>
              <p><span className="font-medium text-text-primary">Catalog:</span> {platform.catalog}</p>
              <p><span className="font-medium text-text-primary">Cost/Hour:</span> {platform.costPerHour}</p>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-text-primary mb-2">Pros:</p>
              <ul className="text-sm text-text-secondary space-y-1">
                {platform.highlights.map((h, i) => (
                  <li key={i}>• {h}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-text-primary mb-2">Cons:</p>
              <ul className="text-sm text-text-secondary space-y-1">
                {platform.drawbacks.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-semibold text-primary">{platform.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Line */}
      <div className="mb-12 p-6 bg-primary-50 rounded-lg border border-primary-200">
        <h2 className="text-xl font-bold text-text-primary mb-3">Bottom Line</h2>
        <p className="text-text-secondary">
          <strong>Audible</strong> is better for dedicated audiobook listeners who want to own their books and have access to the largest catalog.
          <strong> Kindle Unlimited</strong> is better if you want both ebooks and audiobooks at a lower monthly price, and don&apos;t mind borrowing rather than owning.
        </p>
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

      <FaqPageJsonLd questions={FAQ_QUESTIONS} />
    </div>
  );
}
