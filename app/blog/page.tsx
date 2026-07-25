import { getAllPosts } from "@/lib/api/controllers/blog.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { BlogListContent } from "@/components/BlogListContent";
import type { Metadata } from "next";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Audible Credit Guides & Tips - Maximize Your Credit Value",
  description:
    "Maximize your Audible credit value with data-driven guides, tips, and book recommendations.",
  alternates: { canonical: buildCanonicalUrl("/blog") },
  openGraph: {
    title: "Audible Credit Guides & Tips",
    description:
      "Maximize your Audible credit value with data-driven guides, tips, and book recommendations.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListContent posts={posts} />;
}

