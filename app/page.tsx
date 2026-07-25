import { getAllBooks } from "@/lib/data/books";
import { HomeContent } from "@/components/HomeContent";
import { SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: "Find the best audiobooks to spend your Audible credits on. Data-driven Value Scores and cost-per-hour comparisons.",

  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: "Find the best audiobooks to spend your Audible credits on. Data-driven Value Scores and cost-per-hour comparisons.",
  },
};

export default function HomePage() {
  const topBooks = getAllBooks();

  return <HomeContent topBooks={topBooks} />;
}

