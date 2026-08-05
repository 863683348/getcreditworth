import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_CONFIG.name}`,
  description: `The terms and conditions governing your use of ${SITE_CONFIG.name}, including our Amazon Associates affiliate disclosure.`,
  alternates: { canonical: buildCanonicalUrl("/terms") },
  robots: {
    index: true,
    follow: true,
  },
};

const SECTIONS: { id: string; heading: string; body: string[] }[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: [
      `By accessing or using ${SITE_CONFIG.name} (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, please do not use the Site.`,
      "We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "service",
    heading: "2. Description of Service",
    body: [
      `${SITE_CONFIG.name} provides book value ratings, an Audible credit calculator, and related guides to help readers make informed decisions. The Site is provided for general informational purposes only.`,
      "We strive to keep information accurate and up to date, but we do not warrant that ratings, prices, or calculations are complete, current, or error-free.",
    ],
  },
  {
    id: "intellectual",
    heading: "3. Intellectual Property",
    body: [
      "All original content on the Site — including text, ratings methodology, designs, and code — is the property of the Site or its licensors and is protected by applicable intellectual-property laws.",
      "Amazon, Audible, and related marks are trademarks of Amazon.com, Inc. or its affiliates. These marks are used solely to identify the products and services to which our affiliate links point, and do not imply any affiliation with or endorsement by Amazon beyond the Amazon Associates Program.",
    ],
  },
  {
    id: "affiliate",
    heading: "4. Affiliate Disclosure",
    body: [
      `${SITE_CONFIG.name} is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.com and Audible.com.`,
      "As an Amazon Associate we earn from qualifying purchases. When you click an affiliate link and make a purchase, Amazon may set cookies to track the referral. This does not affect the price you pay. Our editorial ratings and recommendations are independent of this relationship.",
    ],
  },
  {
    id: "disclaimer",
    heading: "5. Disclaimer of Warranties",
    body: [
      "The Site is provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.",
      "We do not guarantee that the Site will be uninterrupted, secure, or free of errors or harmful components.",
    ],
  },
  {
    id: "limitation",
    heading: "6. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, ${SITE_CONFIG.name} and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of, or inability to use, the Site.",
      "Any reliance on the information, ratings, or calculations provided by the Site is at your own risk.",
    ],
  },
  {
    id: "links",
    heading: "7. External Links",
    body: [
      "The Site contains links to third-party websites, including Amazon and Audible. We are not responsible for the content, policies, or practices of any third-party sites, which are governed by their own terms and privacy policies.",
    ],
  },
  {
    id: "changes",
    heading: "8. Changes to the Site",
    body: [
      "We reserve the right to modify, suspend, or discontinue any part of the Site at any time without notice. We may also impose limits on certain features or restrict access to parts of the Site.",
    ],
  },
  {
    id: "contact",
    heading: "9. Contact",
    body: [
      `If you have any questions about these Terms of Service, you can reach us at privacy@${new URL(SITE_CONFIG.url).hostname}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container-content py-6 md:py-10 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-text-secondary">
          Last updated: July 30, 2026
        </p>
      </header>

      <div className="space-y-8 text-text-secondary leading-relaxed">
        <p>
          These Terms of Service govern your use of {SITE_CONFIG.name} (
          {SITE_CONFIG.url}). By using this site, you agree to the terms
          described below.
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
