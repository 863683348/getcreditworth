import { getAllCuratedLists } from "@/lib/api/controllers/curated.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { CuratedListContent } from "@/components/CuratedListContent";
import type { Metadata } from "next";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Curated Audiobook Lists - Best Books for Your Credits",
  description:
    "Hand-picked audiobook lists by genre and listening goal. Each book is selected for maximum credit value. Find the best sci-fi, fantasy, non-fiction, and thriller audiobooks worth your Audible credits.",
  keywords: [
    "best audiobooks by genre",
    "curated audible books list",
    "best fantasy audiobooks for credits",
  ],,
  alternates: { canonical: buildCanonicalUrl("/curated") },
  openGraph: {
    title: "Curated Audiobook Lists",
    description:
      "Hand-picked audiobook lists for maximum credit value. Find the best books for your Audible credits by genre.",
  },
};

export default function CuratedListsPage() {
  const lists = getAllCuratedLists();
  return <CuratedListContent lists={lists} />;
}
