'use client';

import { Calendar, Clock } from 'lucide-react';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import { useI18n } from '@/lib/i18n';

import type { BlogPost } from '@/data/blog/posts';

interface BlogListContentProps {
  posts: BlogPost[];
}

export function BlogListContent({ posts }: BlogListContentProps) {
  const { t } = useI18n();

  return (
    <div className="container-content py-6 md:py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            {t.blogPage.title}
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          {t.blogPage.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card p-5 block group"
          >
            <span className="inline-block text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded mb-2">
              {post.category}
            </span>
            <h2 className="font-serif text-lg font-semibold text-text-primary group-hover:text-primary mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-text-secondary line-clamp-2 mb-2">
              {post.description}
            </p>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
