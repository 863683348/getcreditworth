import { notFound } from "next/navigation";
import { getPost, getPostSlugs } from "@/lib/api/controllers/blog.controller";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { BlogDetailContent } from "@/components/BlogDetailContent";
import type { Metadata } from "next";

export const revalidate = 604800;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.description,
    keywords: [
      post.title,
      "audible credit guide",
      "best audiobooks for credits",
    ],
    alternates: { canonical: buildCanonicalUrl(`/blog/${post.slug}`) },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return <BlogDetailContent post={post} />;
}