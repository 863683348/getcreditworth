import { getAuthorBooks } from "@/lib/data/books";
import { BookTable } from "@/components/BookTable";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BookJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

// ISR: 不预渲染全部作者页（曾因 ~6k 页 + 超长 slug 撞 Vercel 导出上限）。
// 改为按需生成并缓存 1 天，命中 CDN 边缘缓存后与预渲染页同速。
export const revalidate = 86400;

export function generateMetadata({ params }: PageProps): Metadata {
  const authorName = decodeURIComponent(params.slug.replace(/-/g, " "));
  const bookCount = getAuthorBooks(authorName).length;
  const topBook = getAuthorBooks(authorName)[0];

  return {
    title: `${authorName} Audiobooks — Best Books for Audible Credits`,
    description: `Find the best ${authorName} audiobooks for Audible credits. ${bookCount} titles ranked by Value Score. Best performances by ${topBook?.narrator || "top narrators"}.`,
    keywords: [
      `${authorName} audiobook`,
      `${authorName} audible`,
      `best ${authorName} audiobooks`,
      `${authorName} audiobook credits`,
      `${authorName} bestseller`,
    ],
    alternates: {
      canonical: `/author/${params.slug}`,
    },
    openGraph: {
      title: `${authorName} Audiobooks — Best Books for Audible Credits`,
      description: `Discover ${bookCount} ${authorName} audiobooks ranked by Value Score. Find the best ${authorName} titles for your Audible credits.`,
      type: "website",
    },
  };
}

export default function AuthorPage({ params }: PageProps) {
  const authorName = decodeURIComponent(params.slug.replace(/-/g, " "));
  const books = getAuthorBooks(authorName).sort((a, b) => b.valueScore - a.valueScore);

  return (
    <div className="container-content py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Author", href: "/author" },
        { label: authorName },
      ]} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {authorName} Audiobooks
        </h1>
        <p className="text-text-secondary">
          {books.length} audiobook{books.length !== 1 ? "s" : ""} ranked by Value Score
        </p>
      </header>

      {books.length > 0 ? (
        <BookTable books={books} />
      ) : (
        <div className="py-12 text-center text-text-muted">
          <p>No books found for {authorName}.</p>
        </div>
      )}

      <WebsiteJsonLd />
    </div>
  );
}
