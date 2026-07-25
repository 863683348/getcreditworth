import { getBookList } from "@/lib/api/controllers/book.controller";
import { AllBooksContent } from "@/components/AllBooksContent";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Audiobooks - Browse Value Scores & Credit Worth",
  description:
    "Browse all audiobooks ranked by Value Score. Filter by duration (short to epic), rating (4.0+ to 4.7+), and category. Find the best audiobooks to spend your Audible credits on with cost-per-hour comparison.",
  keywords: [
    "audible books list",
    "best audiobooks to spend credits",
    "audible value score rankings",
    "audiobook cost per hour comparison",
    "best value audible books by category",
  ],
  alternates: { canonical: buildCanonicalUrl("/books") },
  openGraph: {
    title: "All Audiobooks - Compare Audible Credit Value Scores",
    description:
      "Browse all audiobooks with Value Scores and cost-per-hour data. Filter and sort to find the best books for your credits.",
  },
};

export default function AllBooksPage() {
  const result = getBookList({ pageSize: 200 });
  return <AllBooksContent books={result.books} />;
}
