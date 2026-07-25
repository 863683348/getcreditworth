import { getAllPosts } from "@/lib/api/controllers/blog.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { BlogListContent } from "@/components/BlogListContent";
import type { Metadata } from "next";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Audible Credit Guides & Tips - Maximize Your Credit Value",
  description:
    "Learn how to maximize your Audible credit value with data-driven guides. Tips for choosing the best audiobooks, understanding credit worth, and getting the most from your Audible membership.",
  keywords: [
    "audible credit guide",
    "how to maximize audible credits",
    "best audible books guide",
  ],,
  alternates: { canonical: buildCanonicalUrl("/blog") },
  openGraph: {
    title: "Audible Credit Guides & Tips",
    description:
      "Learn how to maximize your Audible credit value with data-driven guides and expert recommendations.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListContent posts={posts} />;
}
