import type { MetadataRoute } from 'next';
import { getAllBooks, getCuratedLists } from '@/lib/data/books';
import { SITE_CONFIG } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/books`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/curated`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 书籍详情页
  const bookPages: MetadataRoute.Sitemap = getAllBooks().map((book) => ({
    url: `${baseUrl}/books/${book.asin}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 精选榜单页
  const curatedPages: MetadataRoute.Sitemap = getCuratedLists().map((list) => ({
    url: `${baseUrl}/curated/${list.slug}`,
    lastModified: new Date(list.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 博客文章页
  const blogSlugs = [
    'how-to-use-audible-credits',
    'best-audiobooks-for-credits',
    'audible-credit-value',
  ];
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...bookPages, ...curatedPages, ...blogPages];
}
