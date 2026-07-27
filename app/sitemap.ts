import type { MetadataRoute } from "next";
import { getAllBooks, getCuratedLists, getAllCategories } from "@/lib/data/books";
import { getPostSlugs } from "@/lib/api/controllers/blog.controller";
import { SITE_CONFIG } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/curated`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Book detail pages (dynamic from data)
  const bookPages: MetadataRoute.Sitemap = getAllBooks().map((book) => ({
    url: `${baseUrl}/books/${book.asin}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Curated list pages (dynamic from data)
  const curatedPages: MetadataRoute.Sitemap = getCuratedLists().map((list) => ({
    url: `${baseUrl}/curated/${list.slug}`,
    lastModified: new Date(list.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog article pages (dynamic from controller, not hardcoded)
  const blogSlugs = getPostSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((name) => ({
    url: baseUrl + "/category/" + name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...bookPages, ...curatedPages, ...blogPages, ...categoryPages];
}
