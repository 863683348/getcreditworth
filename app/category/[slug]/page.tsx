import { notFound } from "next/navigation";
import { getBooksByCategoryList, getCategories } from "@/lib/api/controllers/book.controller";
import { BookExplorer } from "@/components/BookExplorer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { ItemListJsonLd, BreadcrumbListJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const CATEGORY_NAMES: Record<string, string> = {
  fantasy: "Fantasy",
  "science-fiction": "Science Fiction",
  "historical-fiction": "Historical Fiction",
  mystery: "Mystery",
  thriller: "Thriller",
  biography: "Biography",
  business: "Business",
  "self-help": "Self-Help",
  psychology: "Psychology",
  "young-adult": "Young Adult",
  horror: "Horror",
  romance: "Romance",
};

function slugToName(slug: string): string {
  if (CATEGORY_NAMES[slug]) return CATEGORY_NAMES[slug];
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getCategories().map((name) => ({
    slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const name = slugToName(params.slug);
  const books = getBooksByCategoryList(name);
  if (books.length === 0) return { title: "Category Not Found" };

  return {
    title: name + " Audiobooks - Best Books for Your Audible Credits",
    description: "Browse " + books.length + " " + name + " audiobooks ranked by Value Score. Find the best " + name.toLowerCase() + " books to spend your Audible credits on.",
    keywords: [
      "best " + name.toLowerCase() + " audiobooks",
      name.toLowerCase() + " audible books worth credits",
      "top " + name.toLowerCase() + " audiobooks audible",
      name.toLowerCase() + " audiobooks credit value",
    ],
    alternates: { canonical: buildCanonicalUrl("/category/" + params.slug) },
    openGraph: {
      title: name + " Audiobooks - Best Books for Your Credits",
      description: "Browse " + books.length + " " + name + " audiobooks ranked by Value Score.",
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const name = slugToName(params.slug);
  const books = getBooksByCategoryList(name);
  if (books.length === 0) notFound();

  return (
    <div className="container-content py-6 md:py-8">
      <Breadcrumb
        items={[
          { label: "All Books", href: "/books" },
          { label: name },
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Best {name} Audiobooks for Your Audible Credits
      </h1>
      <p className="text-text-secondary mb-6">
        Browse {books.length} {name.toLowerCase()} audiobooks ranked by Value Score. Filter by duration, rating, and more.
      </p>
      <BookExplorer books={books} showRank={true} />
      <ItemListJsonLd books={books} name={name + " Audiobooks"} />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "All Books", url: "/books" },
          { name: name, url: "/category/" + params.slug },
        ]}
      />
    </div>
  );
}
