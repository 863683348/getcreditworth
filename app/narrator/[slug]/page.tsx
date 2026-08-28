import { getAllBooks, getNarratorBooks, getNarratorSlug } from "@/lib/data/books";
import { BookTable } from "@/components/BookTable";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const narrators = new Set<string>();
  for (const book of getAllBooks()) {
    if (book.narrator) {
      const slug = getNarratorSlug(book.narrator);
      if (slug && slug.length > 0) {
        narrators.add(slug);
      }
    }
  }
  return Array.from(narrators).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const narratorName = decodeURIComponent(params.slug.replace(/-/g, " "));
  const books = getNarratorBooks(narratorName);
  const topBook = books[0];

  return {
    title: `${narratorName} Audiobook Narrations — Best Performed Titles`,
    description: `Explore audiobooks narrated by ${narratorName}. ${books.length} titles ranked by Value Score. Find ${narratorName}'s best performances for your Audible credits.`,
    keywords: [
      `${narratorName} narrator`,
      `${narratorName} audiobook`,
      `${narratorName} audible`,
      `best ${narratorName} narration`,
      `${narratorName} audiobook credits`,
    ],
    alternates: {
      canonical: `/narrator/${params.slug}`,
    },
    openGraph: {
      title: `${narratorName} Audiobook Narrations`,
      description: `Discover ${books.length} audiobooks narrated by ${narratorName}, ranked by Value Score.`,
      type: "website",
    },
  };
}

export default function NarratorPage({ params }: PageProps) {
  const narratorName = decodeURIComponent(params.slug.replace(/-/g, " "));
  const books = getNarratorBooks(narratorName).sort((a, b) => b.valueScore - a.valueScore);

  return (
    <div className="container-content py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Narrator", href: "/narrator" },
        { label: narratorName },
      ]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {narratorName} — Audiobook Narrations
        </h1>
        <p className="text-text-secondary">
          {books.length} audiobook{books.length !== 1 ? "s" : ""} ranked by Value Score
        </p>
        {books[0] && (
          <p className="text-sm text-text-muted mt-1">
            Top title: <a href={`/books/${books[0].asin}`} className="text-primary hover:underline">{books[0].title}</a>
          </p>
        )}
      </header>

      {books.length > 0 ? (
        <BookTable books={books} />
      ) : (
        <div className="py-12 text-center text-text-muted">
          <p>No books found for narrator {narratorName}.</p>
        </div>
      )}

      <WebsiteJsonLd />
    </div>
  );
}
