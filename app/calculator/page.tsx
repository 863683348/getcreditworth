import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { CalculatorContent } from "@/components/CalculatorContent";
import { CalculatorWidget } from "@/components/CalculatorWidget";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Audible Credit Calculator - Maximize Your Credit Value",
  description:
    "Use the free Audible credit calculator to see how much your credits are worth. Find the best audiobooks to spend your credits on based on Value Score analysis. Supports monthly, 2-credit, and annual plans.",
  keywords: [
    "audible credit calculator",
    "how much is an audible credit worth",
    "audible credit value calculator",
  ],,
  alternates: { canonical: buildCanonicalUrl("/calculator") },
  openGraph: {
    title: "Audible Credit Calculator",
    description:
      "Free tool to calculate your Audible credit value and find the best books to spend them on.",
  },
};

export default function CalculatorPage() {
  const topBooks = getTopBookList(200);
  return (
    <div className="container-content py-6 md:py-8">
      <CalculatorContent books={topBooks} />
      <CalculatorWidget books={topBooks} />
    </div>
  );
}
