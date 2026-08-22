"use client";

import Link from "next/link";
import Image from "next/image";
import { Trophy, Info, TrendingUp, BookOpen, ArrowRight, Star, Clock } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookExplorer } from "@/components/BookExplorer";
import {
  ItemListJsonLd,
  SoftwareApplicationJsonLd,
  FaqPageJsonLd,
} from "@/components/seo/JsonLd";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/components/RegionProvider";
import { RegionSwitcher } from "@/components/RegionSwitcher";
import { formatPrice, formatRating, formatNumber, formatDuration } from "@/lib/utils/format";
import { AUDIBLE_CREDIT_VALUE } from "@/lib/config";
import { buildAudibleTrialUrl, buildAudibleProductUrl } from "@/lib/utils/affiliate";

interface HomeContentProps {
  topBooks: Book[];
  totalBooks: number;
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

export function HomeContent({ topBooks, totalBooks }: HomeContentProps) {
  const { t } = useI18n();
  const { region } = useRegion();

  return (
    <>
      <SoftwareApplicationJsonLd />
      <FaqPageJsonLd questions={FAQ_ITEMS} />
      <ItemListJsonLd
        books={topBooks.slice(0, 10)}
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
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a
              href={buildAudibleTrialUrl(region)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors duration-150 shadow-sm"
            >
              {t.hero.ctaPrimary}
              {t.hero.ctaSecondary}
            </a>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-md bg-bg-base text-primary border border-primary hover:bg-primary-50 transition-colors duration-150"
            >
              {t.hero.ctaViewBooks}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-xs text-text-muted mt-3">
            {t.hero.ctaNote}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="font-mono font-bold text-lg sm:text-2xl md:text-3xl text-primary">
                {totalBooks}
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

        {/* Region switcher (Data source) */}
        <RegionSwitcher />

        {/* Top 5 books to use your credit on — 会员视角兑换入口 */}
        {topBooks.length > 0 && (
          <div className="mb-6 p-4 sm:p-6 rounded-xl bg-bg-surface border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-accent flex-shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
                {t.home.topPicksTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mb-4">
              {t.home.topPicksSubtitle}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {topBooks.slice(0, 5).map((book) => (
                <article
                  key={book.asin}
                  className="flex flex-col rounded-lg border border-border bg-bg-base overflow-hidden hover:border-primary-200 transition-colors"
                >
                  <Link
                    href={`/books/${book.asin}`}
                    className="block relative w-full overflow-hidden bg-bg-surface"
                    style={{ aspectRatio: "3/5" }}
                  >
                    <Image
                      src={book.coverImageUrl}
                      alt={`${book.title} cover`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                      unoptimized
                    />
                  </Link>
                  <div className="flex flex-col flex-1 p-2.5 sm:p-3">
                    <Link href={`/books/${book.asin}`}>
                      <h3 className="font-serif text-xs sm:text-sm font-semibold text-text-primary hover:text-primary line-clamp-2 min-h-[2.5em]">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 truncate">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-text-secondary mt-1.5">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {formatRating(book.starRating)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(book.runtimeMinutes)}
                      </span>
                    </div>
                    <a
                      href={buildAudibleProductUrl(book.asin, region)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="btn btn-primary text-[11px] sm:text-xs py-1.5 px-2 mt-2.5"
                    >
                      {t.home.topPicksUseCredit}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Ranked list header */}
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent flex-shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
            {t.home.rankedList
              .replace("{limit}", String(topBooks.length))
              .replace("{total}", String(totalBooks))}
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
          allBooksUrl="/data/books-list.json"
          showRank
          title=""
          emptyMessage={t.home.emptyMessage}
        />

        {/* Inline internal links section — SEO 内链 + 用户导流 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/calculator"
            className="block p-4 rounded-lg border border-border bg-bg-surface hover:border-primary-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                Credit Calculator
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Check if any audiobook is worth a credit before you spend it.
            </p>
          </Link>
          <Link
            href="/blog/how-much-is-audible-credit-worth-2026"
            className="block p-4 rounded-lg border border-border bg-bg-surface hover:border-primary-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                How Much Is a Credit Worth?
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              The 2026 breakdown with real numbers from 3,900+ audiobooks.
            </p>
          </Link>
          <Link
            href="/blog/50-best-audiobooks-to-use-credit-on"
            className="block p-4 rounded-lg border border-border bg-bg-surface hover:border-primary-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                50 Best Audiobooks for Credits
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Top credit values ranked by Value Score, duration, and rating.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
