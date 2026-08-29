'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Calendar, Clock, ArrowRight, Gift, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdUnit } from '@/components/analytics/AdUnit';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import { useI18n } from '@/lib/i18n';
import { useRegion } from '@/components/RegionProvider';
import { trackAffiliateClick } from '@/components/analytics/GoogleAnalytics';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';

import type { BlogPostData } from '@/data/blog/posts';
import type { Book } from '@/lib/types';

interface BlogDetailContentProps {
  post: BlogPostData;
  relatedBooks?: Book[];
}

export function BlogDetailContent({ post, relatedBooks }: BlogDetailContentProps) {
  const { t } = useI18n();
  const { region } = useRegion();

  const trialUrl = buildAudibleTrialUrl(region);

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
        {/* 作者署名 + 更新时间（E-E-A-T 信任信号） */}
        <div className="mt-2 text-xs text-text-muted">
          By{" "}
          <span className="text-text-secondary font-medium">
            GetCreditWorth Editorial Team
          </span>
          {post.updatedAt && post.updatedAt !== post.date && (
            <span> · Updated {formatDate(post.updatedAt)}</span>
          )}
        </div>
      </header>

      {/* Top inline trial banner — 顶部显眼 CTA（A2） */}
      <div className="mb-6 p-3 md:p-4 rounded-lg bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Gift className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-semibold text-primary">
              {t.blogDetail.trialCtaTopTitle}
            </div>
            <div className="text-xs text-text-secondary hidden md:block truncate">
              {t.blogDetail.trialCtaTopSub}
            </div>
          </div>
        </div>
        <a
          href={trialUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          title="Start your free 30-day Audible trial"
          className="inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150 whitespace-nowrap"
          onClick={() => trackAffiliateClick({ linkType: 'trial', region })}
        >
          {t.blogDetail.trialCtaTopButton}
          <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
        </a>
      </div>

      <div className="prose prose-sm max-w-none text-text-primary space-y-4">
        {post.content}
      </div>

      {/* Mid inline trial CTA — 正文与 FAQ 之间的中部转化入口（A2） */}
      <div className="my-8 p-5 rounded-lg border border-primary-200 bg-gradient-to-br from-primary-50 via-bg-base to-amber-50 text-center">
        <Gift className="h-5 w-5 text-primary mx-auto mb-2" />
        <h3 className="text-base font-semibold text-text-primary mb-1">
          {t.blogDetail.trialCtaMidTitle}
        </h3>
        <p className="text-sm text-text-secondary mb-3">
          {t.blogDetail.trialCtaMidSub}
        </p>
        <a
          href={trialUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          title="Start your free 30-day Audible trial"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          onClick={() => trackAffiliateClick({ linkType: 'trial', region })}
        >
          {t.blogDetail.trialCtaMidButton}
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="text-xs text-text-muted mt-2">{t.blogDetail.trialDisclaimer}</p>
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-10 pt-8 border-t border-border" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-text-primary mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {post.faq.map((item, i) => (
              <div key={i} className="bg-bg-surface rounded-lg border border-border p-4">
                <h3 className="font-semibold text-text-primary mb-1.5">{item.question}</h3>
                <p className="text-sm text-text-secondary">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
    
      {/* Start your free trial */}
      <div className="mt-8 p-5 rounded-lg bg-gradient-to-br from-primary-50 via-bg-base to-amber-50 border border-primary-200">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Start your free Audible trial today</h3>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Get 1 free credit worth $14.95 - enough for almost any audiobook. Cancel anytime, books are yours to keep.
        </p>
        <a
          href={trialUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          title="Start your free 30-day Audible trial"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          onClick={() => trackAffiliateClick({ linkType: 'trial', region })}
        >
          Try Audible Free for 30 Days
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="text-xs text-text-muted mt-2">{t.blogDetail.trialDisclaimer}</p>
      </div>

      {/* Recommended books — 博客向书目页导流量（B7） */}
      {relatedBooks && relatedBooks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-1">
            {t.blogDetail.recommendTitle}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {t.blogDetail.recommendSub}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedBooks.map((b) => (
              <Link
                key={b.asin}
                href={"/books/" + b.asin}
                className="group p-3 rounded-lg bg-bg-surface border border-border hover:border-primary transition-colors"
              >
                <div className="aspect-[3/5] relative mb-2 overflow-hidden rounded bg-background">
                  <Image
                    src={b.coverImageUrl}
                    alt={b.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                </div>
                <p className="text-xs font-medium text-text-primary line-clamp-2 leading-tight">
                  {b.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ValueScoreBadge score={b.valueScore} size="sm" />
                  <span className="text-xs text-text-muted">{b.runtimeHours.toFixed(0)}h</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AdSense - 博客文章页底部广告位（slot 在 .env 配置后生效） */}
      <AdUnit
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_POST || ""}
        className="mt-12"
      />

    </article>
  );
}
