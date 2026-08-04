import { getAllCategories } from "@/lib/data/books";
import { getAllBooks } from "@/lib/data/books";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, ChevronRight } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Audiobook Categories - Browse by Genre for Audible Credits",
  description:
    "Browse audiobooks by category. Find the best fantasy, romance, sci-fi, mystery, and more audiobooks for your Audible credits.",
  alternates: { canonical: buildCanonicalUrl("/category") },
};

export default function CategoryListPage() {
  const categories = getAllCategories();
  const allBooks = getAllBooks();

  // Count books per category
  const bookCounts: Record<string, number> = {};
  for (const b of allBooks) {
    for (const c of b.categories) {
      bookCounts[c] = (bookCounts[c] || 0) + 1;
    }
  }

  function toSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  return (
    <div className="container-content py-6 md:py-8">
      <div className="flex items-center gap-2 mb-2">
        <FolderOpen className="h-5 w-5 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Audiobook Categories
        </h1>
      </div>
      <p className="text-sm text-text-secondary mb-8">
        Browse audiobooks by genre. Each category page shows books ranked by Value Score,
        filtered to that specific genre.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories
          .filter(function (c) { return (bookCounts[c] || 0) >= 3; })
          .sort(function (a, b) { return (bookCounts[b] || 0) - (bookCounts[a] || 0); })
          .map(function (cat) {
            return (
              <Link
                key={cat}
                href={"/category/" + toSlug(cat)}
                className="p-4 rounded-lg border border-border bg-bg-surface hover:border-primary transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {cat}
                  </h2>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {bookCounts[cat] || 0} audiobooks
                </p>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
