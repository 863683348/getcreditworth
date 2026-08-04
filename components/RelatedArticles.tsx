'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/types';
import { BlogPost, BlogPostData } from '@/data/blog/posts';
import { getAllPosts } from '@/lib/api/controllers/blog.controller';
import { getAllBooks } from '@/lib/data/books';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';

interface RelatedArticlesProps {
  post?: BlogPost;
  book?: Book;
  category?: string;
}

export function RelatedArticles({ post, book, category }: RelatedArticlesProps) {
  // 获取所有文章
  const allPosts = getAllPosts();
  const allBooks = getAllBooks();

  // 确定推荐目标：如果是post，推荐同类别博客；如果是book，推荐同类别博客
  const relatedPosts = post
    ? allPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : book && book.categories[0]
    ? allPosts
        .filter(p => p.category === book.categories[0])
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : allPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        {post ? 'Related Guides' : 'Recommended Guides'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card p-5 hover:border-primary transition-colors"
          >
            <div className="mb-3">
              <span className="inline-block text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded">
                {p.category}
              </span>
            </div>
            <h3 className="font-serif text-base font-semibold text-text-primary mb-2 line-clamp-2">
              {p.title}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-3 mb-3">
              {p.description}
            </p>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{p.date}</span>
              <span>{p.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 书籍相关的相关文章组件
export function RelatedBooksForPost({ post }: { post: BlogPostData | undefined }) {
  if (!post) return null;

  const allBooks = getAllBooks();
  // 根据博客内容关键词推荐书籍（简化：推荐所有书籍的前5个）
  // 实际实现可以基于更复杂的匹配逻辑
  const relatedBooks = allBooks
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 5);

  if (relatedBooks.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Audiobooks Worth Your Credits
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {relatedBooks.map((rb) => (
          <Link
            key={rb.asin}
            href={`/books/${rb.asin}`}
            className="group p-3 rounded-lg bg-bg-surface border border-border hover:border-primary transition-colors"
          >
            <div className="aspect-[3/5] relative mb-2 overflow-hidden rounded bg-background">
              <Image
                src={rb.coverImageUrl}
                alt={rb.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                unoptimized
              />
            </div>
            <p className="text-xs font-medium text-text-primary line-clamp-2 leading-tight">
              {rb.title}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {rb.author.split(',')[0]}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ValueScoreBadge score={rb.valueScore} size="sm" />
              <span className="text-xs text-text-muted">{rb.runtimeHours.toFixed(0)}h</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
