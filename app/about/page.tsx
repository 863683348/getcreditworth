import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { AboutContent } from "@/components/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GetCreditWorth - Audible Credit Value Optimizer",
  description:
    "Free tool to maximize your Audible credits. Transparent Value Score formula, credit calculator, and curated book lists.",
  keywords: [
    "audible credit optimizer",
    "audible value score tool",
    "best audible credit tool",
    "how to maximize audible credits",
    "audible credit value calculator free",
  ],
  alternates: { canonical: buildCanonicalUrl("/about") },
  openGraph: {
    title: "About GetCreditWorth",
    description:
      "Free tool to maximize your Audible credits. Transparent Value Score formula, credit calculator, and curated book lists.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
