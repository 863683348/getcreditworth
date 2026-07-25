'use client';

import { Trophy, Info, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import type { Book } from '@/lib/types';
import { BookExplorer } from '@/components/BookExplorer';
import { ItemListJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd';
import { useI18n } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils/format';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';

interface HomeContentProps {
  topBooks: Book[];
}

export function HomeContent({ topBooks }: HomeContentProps) {
  const { t } = useI18n();

  return (
    <>
      <WebsiteJsonLd />
      <ItemListJsonLd books={topBooks} name="Top Audible Books by Value Score" />

      <div className="container-content py-6 md:py-8">
        {/* Hero CTA - 参考 AudibleCreditOptimizer 布局 */}
        <div className="mb-8 p-6 md:p-8 rounded-xl bg-bg-surface border border-border text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {t.home.title}
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto mb-6">
            {t.home.subtitle}
          </p>
          <a
            href={buildAudibleTrialUrl()}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm md:text-base font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150 shadow-sm"
          >
            <span className="font-mono">→</span>
            {t.hero.ctaPrimary}
            <span className="font-mono">→</span>
            {t.hero.ctaSecondary}
          </a>
          <p className="text-xs text-text-muted mt-3">
            {t.hero.ctaNote}
          </p>
          {/* Data indicators - 复刻参考站 240 books / 8 categories / $20 风格 */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="font-mono font-bold text-2xl md:text-3xl text-primary">123</div>
              <div className="text-xs md:text-sm text-text-muted mt-1">
                {t.hero.statBooksLabel}
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl md:text-3xl text-primary">12</div>
              <div className="text-xs md:text-sm text-text-muted mt-1">
                {t.hero.statCategoriesLabel}
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-2xl md:text-3xl text-primary">$5</div>
              <div className="text-xs md:text-sm text-text-muted mt-1">
                {t.hero.statBountyLabel}
              </div>
            </div>
          </div>
        </div>

        {/* 排行榜标题 */}
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">
            {t.home.rankedList.replace('{limit}', String(topBooks.length))}
          </h2>
        </div>

        {/* Value Score 公式说明 */}
        <details className="mb-6 group">
          <summary className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:text-primary-hover list-none">
            <Info className="h-4 w-4" />
            {t.home.howCalculated}
          </summary>
          <div className="mt-3 p-4 bg-bg-surface rounded-lg border border-border">
            <p className="text-sm text-text-secondary mb-2">{t.home.formulaLabel}</p>
            <div className="font-mono text-base text-text-primary bg-bg-base px-4 py-2 rounded-md border border-border mb-3">
              {t.home.formula}
            </div>
            <ul className="text-sm text-text-secondary space-y-1">
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                {t.home.bullet1}
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                {t.home.bullet2}
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                {t.home.bullet3}
              </li>
            </ul>
          </div>
        </details>

        {/* 排行榜 */}
        <BookExplorer
          books={topBooks}
          showRank
          title=""
          emptyMessage={t.home.emptyMessage}
        />
      </div>
    </>
  );
}
