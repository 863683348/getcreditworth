import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_CONFIG.name}`,
  description: `How ${SITE_CONFIG.name} collects, uses, and protects your data, including cookies used by Google AdSense advertising.`,
  alternates: { canonical: buildCanonicalUrl("/privacy") },
  robots: {
    index: true,
    follow: true,
  },
};

const SECTIONS: { id: string; heading: string; body: string[] }[] = [
  {
    id: "information",
    heading: "1. Information We Collect",
    body: [
      "We collect limited information automatically through standard web technologies when you visit this site. This includes your approximate location (country/region), the pages you view, the referring website, browser type, and device information. We do not collect personally identifiable information such as your name or email unless you voluntarily contact us.",
      "This information is used only in aggregate form to understand site usage and improve our content.",
    ],
  },
  {
    id: "cookies-advertising",
    heading: "2. Cookies and Advertising",
    body: [
      "This website uses Google AdSense to display advertisements. Google AdSense and its partners may use cookies (such as the NID and IDE cookies) to personalize and serve ads based on your prior visits to this and other websites.",
      "A cookie is a small text file stored on your device. The DoubleClick cookie used by Google enables it and its partners to serve ads based on your visit to this site and other sites on the internet.",
      "You can opt out of personalized advertising by visiting the Google Ads Settings page (https://www.google.com/settings/ads) or the opt-out page of the Network Advertising Initiative (https://www.networkadvertising.org/choices/). You may also consult YourOnlineChoices (https://www.youronlinechoices.com/) for information about managing advertising cookies in the European Union.",
    ],
  },
  {
    id: "affiliate",
    heading: "3. Amazon Associates and Affiliate Links",
    body: [
      `${SITE_CONFIG.name} is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.com and Audible.com.`,
      "As an Amazon Associate we earn from qualifying purchases. When you click an affiliate link and make a purchase, Amazon may set cookies to track the referral. This does not affect the price you pay.",
    ],
  },
  {
    id: "use",
    heading: "4. How We Use Information",
    body: [
      "We use the collected information to operate and improve the site, measure the effectiveness of our content, and serve relevant advertising through Google AdSense. We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.",
    ],
  },
  {
    id: "rights",
    heading: "5. Your Rights",
    body: [
      "Depending on your location, you may have rights under applicable privacy laws (such as the GDPR in the European Union or the CCPA in California) to access, correct, or delete your personal data, and to object to or restrict certain processing.",
      "To exercise these rights, or to withdraw consent for non-essential cookies, please contact us using the details below. You can also control advertising cookies directly through the tools linked in Section 2.",
    ],
  },
  {
    id: "security",
    heading: "6. Data Retention and Security",
    body: [
      "We retain aggregated analytics data only as long as necessary for the purposes described above. We apply reasonable technical and organizational measures to protect information against unauthorized access or loss. However, no method of transmission over the internet is completely secure.",
    ],
  },
  {
    id: "contact",
    heading: "7. Contact",
    body: [
      `If you have any questions about this Privacy Policy, you can reach us at privacy@${new URL(SITE_CONFIG.url).hostname}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-content py-6 md:py-10 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-text-secondary">
          Last updated: July 30, 2026
        </p>
      </header>

      <div className="space-y-8 text-text-secondary leading-relaxed">
        <p>
          This Privacy Policy explains how {SITE_CONFIG.name} (
          {SITE_CONFIG.url}) collects, uses, and protects information when you
          visit our website. By using this site, you consent to the practices
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
