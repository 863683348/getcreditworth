import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { CalculatorContent } from "@/components/CalculatorContent";
import { CalculatorWidget } from "@/components/CalculatorWidget";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Audible Credit Calculator - Maximize Your Credit Value",
  description:
    "Free Audible credit calculator. See how much your credits are worth and which books to spend them on.",
  alternates: { canonical: buildCanonicalUrl("/calculator") },
  openGraph: {
    title: "Audible Credit Calculator",
    description:
      "Free Audible credit calculator. See how much your credits are worth and which books to spend them on.",
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

