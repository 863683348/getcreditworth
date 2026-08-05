import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_CONFIG.name}`,
  description: `Get in touch with the ${SITE_CONFIG.name} team with questions, feedback, or partnership inquiries.`,
  alternates: { canonical: buildCanonicalUrl("/contact") },
  robots: {
    index: true,
    follow: true,
  },
};

const SECTIONS: { id: string; heading: string; body: string[] }[] = [
  {
    id: "email",
    heading: "1. Email Us",
    body: [
      `The fastest way to reach us is by email: contact@${new URL(SITE_CONFIG.url).hostname}.`,
      "We read every message and typically reply within 2 business days.",
    ],
  },
  {
    id: "feedback",
    heading: "2. Feedback & Corrections",
    body: [
      `${SITE_CONFIG.name} improves continuously from reader feedback. If you spot a data error, a broken link, or have a suggestion for a new feature or book list, email us with as much detail as possible so we can act on it quickly.`,
    ],
  },
  {
    id: "business",
    heading: "3. Business & Partnerships",
    body: [
      'For advertising, affiliate, or content partnership inquiries, email us with the subject line "Partnership". We review collaboration requests on a case-by-case basis.',
    ],
  },
  {
    id: "privacy",
    heading: "4. Privacy Requests",
    body: [
      `For questions about your personal data or to exercise your privacy rights, please contact privacy@${new URL(SITE_CONFIG.url).hostname} (see our Privacy Policy for details).`,
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="container-content py-6 md:py-10 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Contact Us</h1>
        <p className="text-sm text-text-secondary">
          We usually reply within 2 business days.
        </p>
      </header>

      <div className="space-y-8 text-text-secondary leading-relaxed">
        <p>
          Have a question, found a bug, or want to collaborate? The{" "}
          {SITE_CONFIG.name} team is happy to hear from you. Use the details
          below and we will get back to you as soon as possible.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              {section.heading}
            </h2>
            <div className="space-y-3">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
