'use client';

import Link from 'next/link';
import { Calculator, DollarSign, Clock, Star, ArrowRight, Info, Trophy, Gift, ExternalLink } from 'lucide-react';
import type { Book } from '@/lib/types';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import { useI18n } from '@/lib/i18n';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import { formatPrice } from '@/lib/utils/format';

interface CalculatorContentProps {
  books: Book[];
}

export function CalculatorContent({ books: _books }: CalculatorContentProps) {
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {t.calculatorPage.title}
        </h1>
      </div>
      <p className="text-sm text-text-secondary">
        {t.calculatorPage.subtitle}
      </p>

      {/* 教程性 SEO 内容：如何计算 */}
      <div className="mt-8 space-y-6">
        <section className="p-5 rounded-lg bg-bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            {t.calculatorPage.guideTitle}
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <p>
              {t.calculatorPage.guideP1.replace("{creditValue}", formatPrice(AUDIBLE_CREDIT_VALUE)).replace("{expensive}", formatPrice(40)).replace("{long}", "45").replace("{cheap}", formatPrice(12)).replace("{short}", "5")}
            </p>
            <p>
              {t.calculatorPage.guideP2}
            </p>
            <div className="font-mono text-base text-text-primary text-center py-3 bg-background rounded-md border border-border">
              {t.calculatorPage.guideFormula}
            </div>
            <p>
              {t.calculatorPage.guideP3}
            </p>
          </div>
        </section>

        <section className="p-5 rounded-lg bg-bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            {t.calculatorPage.exampleTitle}
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <p>
              {t.calculatorPage.exampleP1.replace("{credits}", "3")}
            </p>
            <div className="bg-background p-4 rounded-md border border-border">
              <p className="font-semibold text-text-primary mb-2">{t.calculatorPage.exampleCalcTitle}</p>
              <ul className="space-y-1.5 text-sm">
                <li><strong>{t.calculatorPage.exampleCalc1.replace("{credits}", "3").replace("{creditValue}", formatPrice(AUDIBLE_CREDIT_VALUE)).replace("{total}", formatPrice(AUDIBLE_CREDIT_VALUE * 3))}</strong> &times; {formatPrice(AUDIBLE_CREDIT_VALUE)} = <strong>{formatPrice(AUDIBLE_CREDIT_VALUE * 3)} total value</strong></li>
                <li>{t.calculatorPage.exampleCalc2.replace("{n}", "3").replace("{price}", formatPrice(35)).replace("{totalValue}", formatPrice(105))}</li>
                <li>{t.calculatorPage.exampleCalc3.replace("{savings}", formatPrice(105 - AUDIBLE_CREDIT_VALUE * 3))}</li>
                <li>{t.calculatorPage.exampleCalc4.replace("{rate}", "$0.33").replace("{hours}", "45")}</li>
              </ul>
            </div>
            <p>
              {t.calculatorPage.exampleP2}
            </p>
          </div>
        </section>

        <section className="p-5 rounded-lg bg-bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            {t.calculatorPage.criteriaTitle}
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-md">
                <thead className="bg-background">
                  <tr>
                    <th className="p-2 border-b text-left">{t.calculatorPage.tableScenario}</th>
                    <th className="p-2 border-b text-left">{t.calculatorPage.tableUseCredit}</th>
                    <th className="p-2 border-b text-left">{t.calculatorPage.tableWhy}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b">{t.calculatorPage.tableExpensive.replace("{price}", formatPrice(AUDIBLE_CREDIT_VALUE))}</td><td className="p-2 border-b text-success font-medium">{t.calculatorPage.tableExpensiveResult}</td><td className="p-2 border-b">You save money vs buying directly</td></tr>
                  <tr><td className="p-2 border-b">{t.calculatorPage.tableCheap.replace("{price}", formatPrice(AUDIBLE_CREDIT_VALUE))}</td><td className="p-2 border-b text-warning font-medium">{t.calculatorPage.tableCheapResult}</td><td className="p-2 border-b">{t.calculatorPage.tableCheapWhy}</td></tr>
                  <tr><td className="p-2 border-b">{t.calculatorPage.tableShort}</td><td className="p-2 border-b text-warning font-medium">{t.calculatorPage.tableShortResult}</td><td className="p-2 border-b">{t.calculatorPage.tableShortWhy}</td></tr>
                  <tr><td className="p-2 border-b">Long book (&gt; 20 hours)</td><td className="p-2 border-b text-success font-medium">{t.calculatorPage.tableExpensiveResult}</td><td className="p-2 border-b">Excellent cost per hour ({'<'} $0.75/h)</td></tr>
                  <tr><td className="p-2 border-b">Highly rated (4.5+ stars)</td><td className="p-2 border-b text-success font-medium">{t.calculatorPage.tableExpensiveResult}</td><td className="p-2 border-b">Quality listening + great value</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-3 mt-4">
          <Link href="/" className="btn btn-primary">
            <Trophy className="h-4 w-4" />
            {t.calculatorPage.browseTop}
          </Link>
          <Link href="/curated/best-long-audiobooks-for-credits" className="btn btn-outline">
            <Clock className="h-4 w-4" />
            {t.calculatorPage.bestLong}
          </Link>
          <Link href="/curated/best-classic-literature" className="btn btn-outline">
            <ArrowRight className="h-4 w-4" />
            {t.calculatorPage.classicPicks}
          </Link>
        </section>
      </div>
    </div>
  );
}
