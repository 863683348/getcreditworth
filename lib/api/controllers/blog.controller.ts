/**
 * 博客控制器
 * 封装博客文章相关业务逻辑
 */

import {
  getAllBlogPosts,
  getBlogPost,
  getBlogSlugs,
  type BlogPost,
  type BlogPostData,
} from '@/data/blog/posts';

/**
 * 获取全部博客文章（元数据）
 */
export function getAllPosts(): BlogPost[] {
  return getAllBlogPosts();
}

/**
 * 获取单篇博客文章
 */
export function getPost(slug: string): BlogPostData | undefined {
  return getBlogPost(slug);
}

/**
 * 获取全部博客 slug（用于 SSG）
 */
export function getPostSlugs(): string[] {
  return getBlogSlugs();
}
