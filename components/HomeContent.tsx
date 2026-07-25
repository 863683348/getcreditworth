"use client";

import { Trophy, Info, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookExplorer } from "@/components/BookExplorer";
import {
  ItemListJsonLd,
  WebsiteJsonLd,
  OrganizationJsonLd,
  FaqPageJsonLd,
} from "@/components/seo/JsonLd";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils/format";
import { AUDIBLE_CREDIT_VALUE } from "@/lib/config";
import { buildAudibleTrialUrl } from "@/lib/utils/affiliate";

interface HomeContentProps {
  topBooks: Book[];
}

const FAQ_ITEMS = [
  {
    question:
      "How is the Audible Credit Value Score calculated?",
    answer:
      "Value Score = (Duration in hours \u00d7 Star Rating) / Price in USD. This rewards long, highly-rated books that give you the most listening time per dollar\u2014perfect for getting the best value from your Audible credits.",
  },
  {
    question: "What are the best audiobooks to spend credits on?",
    answer:
      "The best audiobooks for your Audible credits are typically longer titles (20+ hours) with high ratings (4.5+ stars) priced above $20. Epics like Brandon Sanderson\u2019s Stormlight Archive or long non-fiction titles often deliver the best value per credit.",
  },
  {
    question:
      "How much is an Audible credit worth?",
    answer:
      "Each Audible credit is worth approximately $14.95 with the Premium Plus plan. When you use a credit on a book priced above $14.95, you\u2019re saving money. Books under $14.95 are better purchased with cash instead of credits.",
  },
  {
    question: "Is an Audible membership worth it?",
    answer:
      "An Audible membership is worth it if you listen to at least one audiobook per month. With credits worth $14.95 each and access to the Plus Catalog, heavy listeners get exceptional value\u2014especially when choosing longer, higher-priced audiobooks with a strong Value Score.",
  },
];

export function HomeContent({ topBooks }: HomeContentProps) {
  const { t } = useI18n();

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <FaqPageJsonLd questions={FAQ_ITEMS} />
      <ItemListJsonLd
        books={topBooks}
        name="Top Audible Books by Value Score"
      />

      <div className="container-content py-6 md:py-8">
        {/* Hero */}
        <div className="mb-8 p-4 sm:p-6 md:p-8 rounded-xl bg-bg-surface border border-border text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {t.home.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary max-w-2xl mx-auto mb-6">
            {t.home.subtitle}
          </p>
          <a
            href={buildAudibleTrialUrl()}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150 shadow-sm"
          >
            <span className="font-mono">\u2192</span>
            {t.hero.ctaPrimary}
            <span className="font-mono">\u2192</span>
            {t.hero.ctaSecondary}
          </a>
          <p className="text-xs text-text-muted mt-3">
            {t.hero.ctaNote}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="font-mono font-bold text-lg sm:text-2xl md:text-3xl text-primary">
                123
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-1">
                {t.hero.statBooksLabel}
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg sm:text-2xl md:text-3xl text-primary">
                12
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-1">
                {t.hero.statCategoriesLabel}
              </div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg sm:text-2xl md:text-3xl text-primary">
                $5
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-1">
                {t.hero.statBountyLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Ranked list header */}
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent flex-shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
            {t.home.rankedList.replace("{limit}", String(topBooks.length))}
          </h2>
        </div>

        {/* Value Score formula disclosure */}
        <details className="mb-6 group">
          <summary className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:text-primary-hover list-none">
            <Info className="h-4 w-4 flex-shrink-0" />
            {t.home.howCalculated}
          </summary>
          <div className="mt-3 p-4 bg-bg-surface rounded-lg border border-border">
            <p className="text-sm text-text-secondary mb-2">
              {t.home.formulaLabel}
            </p>
            <div className="font-mono text-xs sm:text-base text-text-primary bg-bg-base px-3 sm:px-4 py-2 rounded-md border border-border mb-3 overflow-x-auto">
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
