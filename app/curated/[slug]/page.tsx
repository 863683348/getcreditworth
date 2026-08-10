import { notFound } from "next/navigation";
import {
  getAllCuratedLists,
  getCuratedListDetail,
  getCuratedListMeta,
} from "@/lib/api/controllers/curated.controller";
import { ItemListJsonLd, BreadcrumbListJsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { CuratedDetailContent } from "@/components/CuratedDetailContent";
import { toListBook } from "@/lib/data/books";
import type { Metadata } from "next";

export const revalidate = 604800;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCuratedLists().map((list) => ({ slug: list.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const list = getCuratedListMeta(params.slug);
  if (!list) return { title: "List Not Found" };
  const categoryKeywords: Record<string, string[]> = {
    "best-epic-fantasy-for-credits": ["best fantasy audiobooks", "epic fantasy audible", "fantasy books worth audible credits"],
    "top-science-fiction-audiobooks": ["best sci fi audiobooks", "science fiction audible", "sci fi books worth credits"],
    "non-fiction-for-self-improvement": ["best self improvement audiobooks", "nonfiction audible books", "personal development audiobooks credits"],
    "thrillers-and-mysteries": ["best thriller audiobooks", "mystery audiobooks audible", "suspense audiobooks worth credits"],
  };
  return {
    title: list.title + " - Curated Audiobooks for Your Credits",
    description: list.description,
    keywords: categoryKeywords[list.slug] ?? [
      list.title,
      "curated audiobooks",
      "best audible books for credits",
    ],
    alternates: { canonical: buildCanonicalUrl("/curated/" + list.slug) },
    openGraph: {
      title: list.title,
      description: list.description,
    },
  };
}

export default function CuratedListPage({ params }: PageProps) {
  const detail = getCuratedListDetail(params.slug);
  if (!detail) notFound();
  // Fast Origin Transfer 优化:精选列表页无需 description 大文本
  const lightBooks = detail.books.map(toListBook);
  return (
    <>
      <CuratedDetailContent list={detail} books={lightBooks} />
      <ItemListJsonLd books={lightBooks} name={detail.title} />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Curated Lists", url: "/curated" },
          { name: detail.title, url: "/curated/" + detail.slug },
        ]}
      />
    </>
  );
}
