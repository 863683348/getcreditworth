import { getBookList } from "@/lib/api/controllers/book.controller";
import { AllBooksContent } from "@/components/AllBooksContent";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Audiobooks - Browse Value Scores & Credit Worth",
  description:
    "Browse audiobooks ranked by Value Score. Filter by duration, rating, and category.",
  alternates: { canonical: buildCanonicalUrl("/books") },
  openGraph: {
    title: "All Audiobooks - Compare Audible Credit Value Scores",
    description:
      "Browse audiobooks ranked by Value Score. Filter by duration, rating, and category.",
  },
};

export default function AllBooksPage() {
  const result = getBookList({ pageSize: 500 });
  return <AllBooksContent books={result.books} />;
}

