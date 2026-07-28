import { notFound } from "next/navigation";
import { getAllCategories, filterBooks } from "@/lib/data/books";
import { getAllBooks } from "@/lib/data/books";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaginatedBookTable } from "@/components/PaginatedBookTable";

export const revalidate = 86400;

interface PageProps {
  params: { slug: string };
}

function slugToCategory(slug: string): string | null {
  const all = getAllCategories();
  for (const cat of all) {
    const candidate = cat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (candidate === slug) return cat;
  }
  return null;
}

export function generateStaticParams() {
  return getAllCategories()
    .filter(function (c) { return c.length > 0; })
    .map((c) => ({
      slug: c.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const categoryName = slugToCategory(params.slug);
  if (!categoryName) return { title: "Category Not Found" };

  const title = "Best " + categoryName + " Audiobooks for Audible Credits";
  const description =
    "Find the best " +
    categoryName.toLowerCase() +
    " audiobooks ranked by Value Score. Compare prices, ratings, and listening hours to maximize your Audible credits.";

  return {
    title,
    description,
    alternates: { canonical: buildCanonicalUrl("/category/" + params.slug) },
    openGraph: { title, description },
  };
}

export default function CategoryDetailPage({ params }: PageProps) {
  const categoryName = slugToCategory(params.slug);
  if (!categoryName) notFound();

  const allBooks = getAllBooks();
  const filtered = allBooks
    .filter(function (b) {
      return b.categories.some(function (c) {
        return c.toLowerCase() === categoryName.toLowerCase();
      });
    })
    .sort(function (a, b) { return b.valueScore - a.valueScore; });

  return (
    <div className="container-content py-6 md:py-8">
      <Link
        href="/category"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> All Categories
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Best {categoryName} Audiobooks
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        {filtered.length} audiobooks in {categoryName} ranked by Value Score.
      </p>

      <div className="mb-8">
  <PaginatedBookTable books={filtered} showAuthor={true} showDuration={true} showPrice={true} />
</div></div>
    </div>
  );
}
