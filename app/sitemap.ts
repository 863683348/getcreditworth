import type { MetadataRoute } from "next";
import { getAllBooks, getCuratedLists, getAllCategories } from "@/lib/data/books";
import { getAllPosts } from "@/lib/api/controllers/blog.controller";
import { getAllSeries } from "@/lib/data/series";
import { SITE_CONFIG } from "@/lib/config";

// Fast Origin Transfer 优化:爬虫高频请求 sitemap,缓存 24h 避免反复执行函数
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl + "/", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: baseUrl + "/books", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: baseUrl + "/curated", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: baseUrl + "/calculator", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: baseUrl + "/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: baseUrl + "/guide/audible-credit-value", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: baseUrl + "/compare/audible-vs-librofm-vs-scribd", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: baseUrl + "/series", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: baseUrl + "/category", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Book detail pages with adaptive priority
  var allBooks = getAllBooks();
  var bookPages: MetadataRoute.Sitemap = allBooks.map(function(book) {
    // Higher priority for high-value books and series books
    var priority = 0.8;
    if (book.starRating >= 4.5 && book.reviewCount > 1000 && book.runtimeHours >= 20) {
      priority = 0.9;
    } else if (book.valueScore < 2 || book.runtimeHours < 3) {
      priority = 0.5;
    } else if (book.valueScore < 4 || book.runtimeHours < 8) {
      priority = 0.6;
    } else if (book.starRating >= 4.5 && book.reviewCount > 100) {
      priority = 0.7;
    }
    return {
      url: baseUrl + "/books/" + book.asin,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: priority,
    };
  });

  // Curated list pages
  var curatedLists = getCuratedLists();
  var curatedPages: MetadataRoute.Sitemap = curatedLists.map(function(list) {
    return {
      url: baseUrl + "/curated/" + list.slug,
      lastModified: new Date(list.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Blog article pages (lastModified = publish date, or updatedAt if freshened)
  var blogPosts = getAllPosts();
  var blogPages: MetadataRoute.Sitemap = blogPosts.map(function(post) {
    return {
      url: baseUrl + "/blog/" + post.slug,
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  // Category pages
  var allCategories = getAllCategories();
  var categoryPages: MetadataRoute.Sitemap = allCategories.map(function(name) {
    var slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return {
      url: baseUrl + "/category/" + slug,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  // Series pages
  var seriesList = getAllSeries();
  var seriesPages: MetadataRoute.Sitemap = seriesList.map(function(s) {
    return {
      url: baseUrl + "/series/" + s.slug,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...bookPages, ...curatedPages, ...blogPages, ...categoryPages, ...seriesPages];
}