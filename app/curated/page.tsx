import { getAllCuratedLists } from "@/lib/api/controllers/curated.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { CuratedListContent } from "@/components/CuratedListContent";
import type { Metadata } from "next";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Curated Audiobook Lists - Best Books for Your Credits",
  description:
    "Curated audiobook lists by genre. Find the best books for your Audible credits.",
  keywords: [
    "curated audiobook lists",
    "best audiobooks by genre",
    "handpicked audible books",
    "top audible lists",
    "audiobook recommendations by genre",
    "curated book lists audible",
  ],
  alternates: { canonical: buildCanonicalUrl("/curated") },
  openGraph: {
    title: "Curated Audiobook Lists",
    description:
      "Curated audiobook lists by genre. Find the best books for your Audible credits.",
  },
};

export default function CuratedListsPage() {
  const lists = getAllCuratedLists();
  return <CuratedListContent lists={lists} />;
}

