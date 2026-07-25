import { notFound } from "next/navigation";
import {
  getAllCuratedLists,
  getCuratedListDetail,
  getCuratedListMeta,
} from "@/lib/api/controllers/curated.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { CuratedDetailContent } from "@/components/CuratedDetailContent";
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
  return {
    title: `${list.title} - Curated Audiobooks for Your Credits`,
    description: list.description,
    keywords: [
      list.title,
      "curated audiobooks",
      "best audible books for credits",
    ],
    alternates: { canonical: buildCanonicalUrl(`/curated/${list.slug}`) },
    openGraph: {
      title: list.title,
      description: list.description,
    },
  };
}

export default function CuratedListPage({ params }: PageProps) {
  const detail = getCuratedListDetail(params.slug);
  if (!detail) notFound();
  return <CuratedDetailContent list={detail} books={detail.books} />;
}