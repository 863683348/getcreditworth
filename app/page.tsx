import { getTopBookList } from "@/lib/api/controllers/book.controller";
import { HomeContent } from "@/components/HomeContent";
import { SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Find the best audiobooks to spend your Audible credits on. Compare value scores, cost per hour, and credit worth to maximize every credit with data-driven recommendations.",
  keywords: [
    "best audiobooks to spend credits on",
    "audible credit optimizer",
    "audible books worth credits",
  ],,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description:
      "Data-driven Audible credit value comparison. Find the best audiobooks worth your credits with Value Scores.",
  },
};

export default function HomePage() {
  const topBooks = getTopBookList(100);

  return <HomeContent topBooks={topBooks} />;
}
