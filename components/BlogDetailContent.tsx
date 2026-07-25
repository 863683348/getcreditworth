'use client';

import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';

import type { BlogPostData } from '@/data/blog/posts';

interface BlogDetailContentProps {
  post: BlogPostData;
}

export function BlogDetailContent({ post }: BlogDetailContentProps) {
  const { t } = useI18n();

  return (
    <article className="container-content py-6 md:py-8 max-w-3xl">
      <nav className="mb-6">
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.blogDetail.allArticles}
        </Link>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded mb-3">
          {post.category}
        </span>
        <h1 className="font-serif text-2xl md:text-4xl font-bold text-text-primary mb-3">
          {post.title}
        </h1>
        <p className="text-base text-text-secondary mb-3">{post.description}</p>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
      </header>

      <div className="prose prose-sm max-w-none text-text-primary space-y-4">
        {post.content}
      </div>

      <div className="mt-12 p-6 bg-bg-surface rounded-lg border border-border text-center">
        <h3 className="font-semibold text-text-primary mb-2">
          {t.blogDetail.readyToFind}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t.blogDetail.browseData}
        </p>
        <Link href="/" className="btn btn-primary">
          {t.blogDetail.viewTopBooks}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
