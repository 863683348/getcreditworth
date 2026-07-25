'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Award, DollarSign } from 'lucide-react';
import type { Book } from '@/lib/types';
import { ValueScoreBadge } from '@/components/ValueScoreBadge';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import { formatPrice, formatDuration, formatRating } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';

interface CalculatorWidgetProps {
  books: Book[];
}

type Plan = 'monthly' | 'monthly2' | 'annual';

const PLAN_INFO: Record<Plan, { credits: number; cost: number; name: string; costPerCredit: number }> = {
  monthly: { credits: 1, cost: 14.95, name: 'Premium Plus Monthly', costPerCredit: 14.95 },
  monthly2: { credits: 2, cost: 22.95, name: 'Premium Plus 2 Credits Monthly', costPerCredit: 11.48 },
  annual: { credits: 12, cost: 149.50, name: 'Premium Plus Annual', costPerCredit: 12.46 },
};

export function CalculatorWidget({ books }: CalculatorWidgetProps) {
  const { t } = useI18n();
  const [credits, setCredits] = useState(1);
  const [plan, setPlan] = useState<Plan>('monthly');

  const planInfo = PLAN_INFO[plan];

  const recommendations = useMemo(() => {
    const sorted = [...books].sort((a, b) => b.adjustedValueScore - a.adjustedValueScore);
    return sorted.slice(0, Math.max(credits, 3));
  }, [books, credits]);

  const totalValue = useMemo(() => {
    return recommendations.reduce((sum, book) => sum + book.price, 0);
  }, [recommendations]);

  const totalCreditCost = credits * AUDIBLE_CREDIT_VALUE;
  const savings = totalValue - totalCreditCost;
  const savingsPercent = totalValue > 0 ? (savings / totalValue) * 100 : 0;

  // Plural-aware credit label
  const creditLabel = credits === 1 ? t.calculatorPage.recommendedBooks.split('{')[0] || 'Credit' : 'Credits';

  return (
    <div className="space-y-6">
      {/* Input Controls */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">{t.calculatorPage.yourSubscription}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t.calculatorPage.numberOfCredits}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="12"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="font-mono font-bold text-lg text-text-primary w-10 text-right">
                {credits}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t.calculatorPage.audiblePlan}
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as Plan)}
              className="w-full px-3 py-2 rounded-md border border-border bg-bg-base text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {Object.entries(PLAN_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.name} ({formatPrice(info.cost)}/mo)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="mt-4 p-3 bg-bg-surface rounded-md text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-text-secondary">{t.calculatorPage.creditsToSpend}</span>
            <span className="font-mono font-medium text-text-primary">{credits}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-text-secondary">{t.calculatorPage.creditValueEach}</span>
            <span className="font-mono font-medium text-text-primary">{formatPrice(AUDIBLE_CREDIT_VALUE)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">{t.calculatorPage.totalCreditValue}</span>
            <span className="font-mono font-medium text-text-primary">{formatPrice(totalCreditCost)}</span>
          </div>
        </div>
      </div>

      {/* Recommendation Results */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">
            {t.calculatorPage.recommendedBooks.replace('{credits}', String(credits)).replace('{credits, plural, one {Credit} other {Credits}}', creditLabel)}
          </h2>
        </div>

        <div className="space-y-3">
          {recommendations.map((book, index) => (
            <div key={book.asin} className="flex items-center gap-3 p-3 bg-bg-surface rounded-md">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-50 text-primary font-mono font-bold text-xs flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-medium text-text-primary text-sm truncate">
                  {book.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatDuration(book.runtimeMinutes)} • {formatRating(book.starRating)} stars • {formatPrice(book.price)}
                </p>
              </div>
              <ValueScoreBadge score={book.valueScore} size="sm" showLabel={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Value Analysis */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-success" />
          <h2 className="text-lg font-semibold text-text-primary">{t.calculatorPage.valueAnalysis}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-surface rounded-md">
            <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              {t.calculatorPage.totalBookValue}
            </div>
            <div className="font-mono font-bold text-lg text-text-primary">
              {formatPrice(totalValue)}
            </div>
          </div>
          <div className="p-4 bg-bg-surface rounded-md">
            <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              {t.calculatorPage.creditCost}
            </div>
            <div className="font-mono font-bold text-lg text-text-primary">
              {formatPrice(totalCreditCost)}
            </div>
          </div>
          <div className={`p-4 rounded-md ${savings > 0 ? 'bg-success/5' : 'bg-warning/5'}`}>
            <div className="flex items-center gap-1.5 text-text-muted text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {t.calculatorPage.yourSavings}
            </div>
            <div className={`font-mono font-bold text-lg ${savings > 0 ? 'text-success' : 'text-warning'}`}>
              {savings > 0 ? '+' : ''}{formatPrice(savings)}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {savingsPercent > 0 ? t.calculatorPage.savingsPercent.replace('{value}', String(savingsPercent.toFixed(0))) : t.calculatorPage.noSavings}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-text-secondary">
          {savings > 0 ? (
            <>
              {t.calculatorPage.savingsSummary
                .replace('{credits}', String(credits))
                .replace('{total}', formatPrice(totalValue))
                .replace('{creditCost}', formatPrice(totalCreditCost))
                .replace('{savings}', formatPrice(savings))}
            </>
          ) : (
            <>
              {t.calculatorPage.noSavingsSummary.replace('full list', t.calculatorPage.fullList)}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
