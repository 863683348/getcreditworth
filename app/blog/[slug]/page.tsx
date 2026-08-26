import { notFound } from "next/navigation";
import { getPost, getPostSlugs } from "@/lib/api/controllers/blog.controller";
import { ArticleJsonLd, BreadcrumbListJsonLd, FaqPageJsonLd } from "@/components/seo/JsonLd";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { SITE_CONFIG } from "@/lib/config";
import { BlogDetailContent } from "@/components/BlogDetailContent";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RelatedArticles } from "@/components/RelatedArticles";
import type { Metadata } from "next";

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
    title: post.title, // 根布局 title.template 会自动追加 " | GetCreditWorth"
    description: post.description,
    keywords: (post as any).keywords ?? [
      post.title,
      "audible credit guide",
      "best audiobooks for credits",
    ],
    alternates: { canonical: buildCanonicalUrl("/blog/" + post.slug) },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: buildCanonicalUrl("/blog/" + post.slug),
      publishedTime: post.date,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: SITE_CONFIG.twitter,
      images: [`${SITE_CONFIG.url}/og-image.svg`],
    },
  };
}

export const dynamicParams = false;

export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <BlogDetailContent post={post} />
      <RelatedArticles post={{ ...post }} />
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={buildCanonicalUrl("/blog/" + post.slug)}
        publishedDate={post.date}
        modifiedDate={post.updatedAt}
      />
      {post.faq && post.faq.length > 0 && (
        <FaqPageJsonLd questions={post.faq} />
      )}
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: "/blog/" + post.slug },
        ]}
      />
    </>
  );
}
