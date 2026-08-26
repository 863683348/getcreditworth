import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audible vs Spotify 2026 — Which Is Better for Audiobooks?",
  description:
    "Audible vs Spotify comparison 2026: audiobook access, pricing, and value. Find the best streaming service for your listening habits.",
  keywords: [
    "audible vs spotify",
    "spotify vs audible",
    "audible credits vs spotify premium",
    "best audiobook streaming service 2026",
    "spotify audiobooks vs audible",
  ],
  alternates: { canonical: buildCanonicalUrl("/compare/audible-vs-spotify") },
  openGraph: {
    title: "Audible vs Spotify 2026 — Best for Audiobooks?",
    description: "Compare Audible and Spotify: pricing, audiobook selection, and value for listeners.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audible vs Spotify 2026 — Best for Audiobooks?",
    description: "Compare Audible and Spotify for audiobook listening and music streaming.",
  },
};

const FAQ_QUESTIONS = [
  {
    question: "Does Spotify have audiobooks?",
    answer: "Yes, Spotify offers audiobooks as part of its Premium plan in many countries, with a limited number of free hours per month. However, the selection is much smaller than Audible's catalog.",
  },
  {
    question: "Is Audible cheaper than Spotify Premium?",
    answer: "Spotify Premium costs $10.99/month and includes music plus limited audiobook hours. Audible costs $14.95/month but gives you a credit worth $14.95 toward any audiobook. For heavy audiobook listeners, Audible offers better value.",
  },
  {
    question: "Can I keep Spotify audiobooks forever?",
    answer: "No. Spotify's audiobooks are part of its streaming model — you lose access when you cancel or exceed your monthly limit. Audible credits let you own books permanently.",
  },
  {
    question: "Which has more audiobooks: Audible or Spotify?",
    answer: "Audible has a much larger selection with over 400,000 titles. Spotify offers a curated selection of popular titles, but the catalog is significantly smaller.",
  },
];

export default function ComparePage() {
  return (
    <div className="container-content py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-4">
        Audible vs Spotify 2026
      </h1>
      <p className="text-text-secondary mb-8">
        Which streaming service is better for your audiobook and music needs?
      </p>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-lg border-2 border-primary bg-primary-50">
          <h2 className="text-xl font-bold text-text-primary mb-4">Audible</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-text-primary">Price:</span> $14.95/month</p>
            <p><span className="font-medium text-text-primary">Audiobooks:</span> ~400,000 titles</p>
            <p><span className="font-medium text-text-primary">Cost/Book:</span> 1 credit ($14.95 value)</p>
            <p><span className="font-medium text-text-primary">Ownership:</span> Keep forever</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-semibold text-primary">Best for: Dedicated audiobook listeners</p>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-text-primary mb-4">Spotify Premium</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-text-primary">Price:</span> $10.99/month</p>
            <p><span className="font-medium text-text-primary">Audiobooks:</span> Limited selection</p>
            <p><span className="font-medium text-text-primary">Cost/Book:</span> Included (limited hours)</p>
            <p><span className="font-medium text-text-primary">Ownership:</span> Stream only</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-semibold text-text-muted">Best for: Music + occasional listening</p>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mb-12 p-6 bg-primary-50 rounded-lg border border-primary-200">
        <h2 className="text-xl font-bold text-text-primary mb-3">Bottom Line</h2>
        <p className="text-text-secondary">
          If audiobooks are your primary focus, <strong>Audible</strong> offers significantly more value with a larger catalog and permanent ownership.
          If you want music plus occasional audiobook listening, <strong>Spotify Premium</strong> is more economical.
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
