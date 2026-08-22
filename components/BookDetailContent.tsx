'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Clock,
  DollarSign,
  Headphones,
  ExternalLink,
  ChevronLeft,
  Tag,
  User,
  Calendar,
  Gift,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { isCreditWorth } from '@/lib/calc/value-score';
import { buildAudibleProductUrl, buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import {
  formatDuration,
  formatPrice,
  formatRating,
  formatNumber,
  formatDate,
} from '@/lib/utils/format';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdUnit } from '@/components/analytics/AdUnit';
import { useI18n } from '@/lib/i18n';
import { useRegion } from '@/components/RegionProvider';
import type { Book } from '@/lib/types';

interface BookDetailContentProps {
  book: Book;
  relatedBooks?: Book[];
}

export function BookDetailContent({ book, relatedBooks }: BookDetailContentProps) {
  const { t } = useI18n();
  const { region } = useRegion();

  const redirectUrl = buildAudibleProductUrl(book.asin, region, book.title);
  const worthUsingCredit = isCreditWorth(book.price);
  const savingsVsCredit = book.price - AUDIBLE_CREDIT_VALUE;
  const savingsPercent = (savingsVsCredit / book.price) * 100;

  return (
    <div className="container-content py-6 md:py-8">
      {/* Top Inline Trial Banner - 友好推荐（顶部） */}
      <div className="mb-4 p-3 md:p-4 rounded-lg bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Gift className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-semibold text-primary">
              {t.trialBanner.title}
            </div>
            <div className="text-xs text-text-secondary hidden md:block truncate">
              {t.trialBanner.subtitle}
            </div>
          </div>
        </div>
        <a
          href={buildAudibleTrialUrl(region)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          title="Start your free 30-day Audible trial"
          className="inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150 whitespace-nowrap"
        >
          {t.trialBanner.cta}
          <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
        </a>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "All Books", href: "/books" },
          { label: book.title },
        ]}
      />

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="aspect-ratio-book-cover relative w-full max-w-xs mx-auto md:mx-0 overflow-hidden rounded-lg bg-bg-surface border border-border" style={{ aspectRatio: "3/5" }}>
            <Image
              src={book.coverImageUrl}
              alt={t.bookDetail.coverAlt.replace('{title}', book.title)}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-2">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-text-secondary mb-4">
            {t.bookCard.by} <span className="text-text-primary">{book.author}</span>
          </p>

          {/* Value Score Badge */}
          <div className="mb-6">
            <ValueScoreBadge score={book.valueScore} size="lg" />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<Star className="h-4 w-4 text-accent fill-accent" />}
              label={t.bookDetail.rating}
              value={formatRating(book.starRating)}
              sub={t.bookDetail.reviews.replace('{count}', formatNumber(book.reviewCount))}
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              label={t.bookDetail.duration}
              value={formatDuration(book.runtimeMinutes)}
              sub={`${book.runtimeHours.toFixed(1)}h`}
            />
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              label={t.bookDetail.price}
              value={formatPrice(book.price)}
              sub={`${book.costPerHour.toFixed(2)}/h`}
            />
            <StatCard
              icon={<Headphones className="h-4 w-4" />}
              label={t.bookDetail.creditWorth}
              value={book.creditWorth.toFixed(2)}
              sub={worthUsingCredit ? t.bookCard.useCredit : t.bookDetail.price}
            />
          </div>

          {/* Credit value judgment */}
          <div className={`p-4 rounded-lg border mb-6 ${
            worthUsingCredit
              ? 'bg-success/5 border-success/30'
              : 'bg-warning/5 border-warning/30'
          }`}>
            <p className="text-sm text-text-primary">
              {worthUsingCredit ? (
                <>
                  <strong>{t.bookDetail.recommendedCredit}</strong>{' '}
                  {t.bookDetail.recommendedDesc
                    .replace('{price}', formatPrice(book.price))
                    .replace('{percent}', String(savingsPercent.toFixed(0)))
                    .replace('{creditValue}', formatPrice(AUDIBLE_CREDIT_VALUE))
                    .replace('{savings}', formatPrice(savingsVsCredit))}
                </>
              ) : (
                <>
                  <strong>{t.bookDetail.considerBuying}</strong>{' '}
                  {t.bookDetail.considerBuyingDesc
                    .replace('{price}', formatPrice(book.price))
                    .replace('{creditValue}', formatPrice(AUDIBLE_CREDIT_VALUE))}
                </>
              )}
            </p>
          </div>

          {/* 独特描述 — SEO unique content per book */}
          {book.description && (
            <div className="mb-6 p-5 rounded-lg bg-bg-surface border border-border">
              <p className="text-sm text-text-primary leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          {/* Low Value Score warning — guide to buy directly on Amazon */}
          {book.valueScore < 2 && (
            <div className="p-4 rounded-lg border border-warning/40 bg-warning/10 mb-6">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {t.bookDetail.lowValueTitle}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t.bookDetail.lowValueDesc
                      .replace('{vs}', book.valueScore.toFixed(1))
                      .replace('{waste}', formatPrice(AUDIBLE_CREDIT_VALUE - book.price))}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-text-primary text-white hover:opacity-90 transition-opacity"
                >
                  {t.bookDetail.lowValueAction}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href="/curated/best-long-audiobooks-for-credits"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-border-secondary text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  {t.bookDetail.lowValueAlt}
                </Link>
              </div>
            </div>
          )}

          {/* CTA — 按是否值得用积分分流：值 → 引导用积分兑换；不值 → 引导直接买 + 试听免费拿 */}
          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn btn-primary"
            >
              {worthUsingCredit ? t.bookDetail.useCredit : t.bookDetail.buyDirectly}
              <ExternalLink className="h-4 w-4" />
            </a>
            {!worthUsingCredit && (
              <a
                href={buildAudibleTrialUrl(region)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title="Start your free 30-day Audible trial and get this book"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-primary-300 text-primary hover:bg-primary-50 transition-colors"
              >
                {t.bookDetail.getFreeWithTrial}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* 友好推荐卡片：Trial Recommendation（仅在书价 > 积分价值时显示） */}
          {worthUsingCredit && (
            <div className="p-4 md:p-5 rounded-lg border border-primary-200 bg-gradient-to-br from-primary-50 via-bg-base to-amber-50 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-text-primary">
                  {t.trialRecommend.title}
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                {[t.trialRecommend.reason1, t.trialRecommend.reason2, t.trialRecommend.reason3, t.trialRecommend.reason4].map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <a
                href={buildAudibleTrialUrl(region)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title="Claim your free Audible trial credit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150"
              >
                {t.trialRecommend.cta}
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-xs text-text-muted mt-2">
                {t.trialBanner.disclaimer}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm">
            {book.narrator && (
              <DetailRow icon={<User className="h-4 w-4" />} label={t.bookDetail.narratedBy} value={book.narrator} />
            )}
            {book.publisher && (
              <DetailRow icon={<Tag className="h-4 w-4" />} label={t.bookDetail.publisher} value={book.publisher} />
            )}
            {book.releaseDate && (
              <DetailRow icon={<Calendar className="h-4 w-4" />} label={t.bookDetail.released} value={formatDate(book.releaseDate)} />
            )}
            <DetailRow
              icon={<Tag className="h-4 w-4" />}
              label={t.bookDetail.categories}
              value={book.categories.join(', ')}
            />
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks && relatedBooks.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t.bookDetail.similarAudiobooksTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {relatedBooks.map((rb) => (
              <Link
                key={rb.asin}
                href={"/books/" + rb.asin}
                className="group p-3 rounded-lg bg-bg-surface border border-border hover:border-primary transition-colors"
              >
                <div className="aspect-[3/5] relative mb-2 overflow-hidden rounded bg-background">
                  <Image
                    src={rb.coverImageUrl}
                    alt={rb.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                </div>
                <p className="text-xs font-medium text-text-primary line-clamp-2 leading-tight">
                  {rb.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {rb.author.split(",")[0]}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ValueScoreBadge score={rb.valueScore} size="sm" />
                  <span className="text-xs text-text-muted">{rb.runtimeHours.toFixed(0)}h</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AdSense - 书籍详情页底部广告位（slot 在 .env 配置后生效） */}
      <AdUnit
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOOK_DETAIL || ""}
        className="mt-12"
      />
    </div>
  );
}

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-bg-surface border border-border">
      <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
        {icon}
        {label}
      </div>
      <div className="font-mono font-bold text-text-primary text-lg">{value}</div>
      {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function DetailRow({ icon, label, value }: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-text-muted mt-0.5">{icon}</span>
      <span className="text-text-secondary min-w-[120px]">{label}:</span>
      <span className="text-text-primary flex-1">{value}</span>
    </div>
  );
}
