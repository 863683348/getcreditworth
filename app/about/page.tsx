import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { AboutContent } from "@/components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GetCreditWorth - Audible Credit Value Optimizer",
  description:
    "Learn how GetCreditWorth helps you maximize your Audible credit value with data-driven recommendations. Transparent Value Score formula, free credit calculator, and curated audiobook lists.",
  keywords: [
    "audible credit optimizer tool",
    "audible value score formula",
    "free audible credit calculator",
  ],,
  alternates: { canonical: buildCanonicalUrl("/about") },
  openGraph: {
    title: "About GetCreditWorth",
    description:
      "Free tool to maximize your Audible credit value. Data-driven Value Scores, credit calculator, and curated recommendations.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
