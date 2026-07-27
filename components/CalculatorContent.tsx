'use client';

import Link from 'next/link';
import { Calculator, DollarSign, Clock, Star, ArrowRight, Info, Trophy } from 'lucide-react';
import type { Book } from '@/lib/types';
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
            How the Audible Credit Calculator Works
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <p>
              Every Audible credit is worth <strong>{formatPrice(AUDIBLE_CREDIT_VALUE)}</strong> — that is
              what you pay per month for one credit on the standard Premium Plus plan. But not all books
              give you the same value for that credit. A $40 book that runs 45 hours is a much better deal
              than a $12 book that runs 5 hours.
            </p>
            <p>
              This calculator uses the <strong>Value Score formula</strong>:
            </p>
            <div className="font-mono text-base text-text-primary text-center py-3 bg-background rounded-md border border-border">
              Value Score = (Duration in hours &times; Star Rating) / Price in USD
            </div>
            <p>
              Enter your credits and subscription plan below, and the calculator will instantly show
              you the best books to spend your credits on. The recommendations are sorted by Value
              Score, so you always get the highest possible credit value.
            </p>
          </div>
        </section>

        <section className="p-5 rounded-lg bg-bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Real Example: How Much Can You Save?
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <p>
              Let us walk through a real example. Say you have <strong>3 credits</strong> on a
              standard Premium Plus plan. You want to spend them on quality audiobooks.
            </p>
            <div className="bg-background p-4 rounded-md border border-border">
              <p className="font-semibold text-text-primary mb-2">Example Calculation:</p>
              <ul className="space-y-1.5 text-sm">
                <li><strong>3 credits</strong> &times; {formatPrice(AUDIBLE_CREDIT_VALUE)} = <strong>{formatPrice(AUDIBLE_CREDIT_VALUE * 3)} total value</strong></li>
                <li>If you pick 3 books worth $35 each = <strong>$105 retail value</strong></li>
                <li>Your savings: <strong className="text-success">${(105 - AUDIBLE_CREDIT_VALUE * 3).toFixed(2)}</strong></li>
                <li>Cost per hour: as low as <strong>$0.33/hour</strong> (on 45-hour books)</li>
              </ul>
            </div>
            <p>
              The recommendation engine below automatically picks the books that maximize your
              savings. The more expensive and longer the book, the better your credit value.
            </p>
          </div>
        </section>

        <section className="p-5 rounded-lg bg-bg-surface border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            What Makes a Book Worth a Credit?
          </h2>
          <div className="text-sm text-text-secondary space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-md">
                <thead className="bg-background">
                  <tr>
                    <th className="p-2 border-b text-left">Scenario</th>
                    <th className="p-2 border-b text-left">Use Credit?</th>
                    <th className="p-2 border-b text-left">Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b">Book costs &gt; {formatPrice(AUDIBLE_CREDIT_VALUE)}</td><td className="p-2 border-b text-success font-medium">Yes</td><td className="p-2 border-b">You save money vs buying directly</td></tr>
                  <tr><td className="p-2 border-b">Book costs &lt; {formatPrice(AUDIBLE_CREDIT_VALUE)}</td><td className="p-2 border-b text-warning font-medium">No</td><td className="p-2 border-b">Buy directly, save the credit for a pricier book</td></tr>
                  <tr><td className="p-2 border-b">Short book (&lt; 8 hours)</td><td className="p-2 border-b text-warning font-medium">Consider</td><td className="p-2 border-b">Cost per hour will be high; check price first</td></tr>
                  <tr><td className="p-2 border-b">Long book (&gt; 20 hours)</td><td className="p-2 border-b text-success font-medium">Yes</td><td className="p-2 border-b">Excellent cost per hour ({'<'} $0.75/h)</td></tr>
                  <tr><td className="p-2 border-b">Highly rated (4.5+ stars)</td><td className="p-2 border-b text-success font-medium">Yes</td><td className="p-2 border-b">Quality listening + great value</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-3 mt-4">
          <Link href="/" className="btn btn-primary">
            <Trophy className="h-4 w-4" />
            Browse Top Audiobooks
          </Link>
          <Link href="/curated/best-long-audiobooks-for-credits" className="btn btn-outline">
            <Clock className="h-4 w-4" />
            Best Long Audiobooks (30h+)
          </Link>
          <Link href="/curated/best-classic-literature" className="btn btn-outline">
            <ArrowRight className="h-4 w-4" />
            Classic Literature Picks
          </Link>
        </section>
      </div>
    </div>
  );
}
