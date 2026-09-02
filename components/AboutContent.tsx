'use client';

import Link from 'next/link';
import { Trophy, Calculator, BookOpen, ExternalLink, Info } from 'lucide-react';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import { formatPrice } from '@/lib/utils/format';
import { useI18n } from '@/lib/i18n';

export function AboutContent() {
  const { t } = useI18n();

  return (
    <div className="container-content py-6 md:py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
        {t.aboutPage.title.replace('{name}', 'GetCreditWorth')}
      </h1>

      <div className="prose prose-sm max-w-none text-text-secondary space-y-4">
        <p>
          {t.aboutPage.intro.replace('{name}', 'GetCreditWorth')}
        </p>

        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2" id="how-it-works">
          <Info className="h-5 w-5 text-primary" />
          {t.aboutPage.howItWorks}
        </h2>
        <p>
          {t.aboutPage.howItWorksDesc}
        </p>
        <div className="font-mono text-base text-text-primary bg-bg-surface px-4 py-3 rounded-md border border-border">
          {t.home.formula}
        </div>
        <p>
          {t.aboutPage.howItWorksExplain.replace('{value}', formatPrice(AUDIBLE_CREDIT_VALUE))}
        </p>

        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t.aboutPage.whatYouGet}
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Trophy className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <span><strong>{t.aboutPage.feature1.split(' — ')[0]}</strong> — {t.aboutPage.feature1.split(' — ')[1]}</span>
          </li>
          <li className="flex items-start gap-2">
            <Calculator className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span><strong>{t.aboutPage.feature2.split(' — ')[0]}</strong> — {t.aboutPage.feature2.split(' — ')[1]}</span>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
            <span><strong>{t.aboutPage.feature3.split(' — ')[0]}</strong> — {t.aboutPage.feature3.split(' — ')[1]}</span>
          </li>
          <li className="flex items-start gap-2">
            <Info className="h-5 w-5 text-text-muted mt-0.5 flex-shrink-0" />
            <span><strong>{t.aboutPage.feature4.split(' — ')[0]}</strong> — {t.aboutPage.feature4.split(' — ')[1]}</span>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-text-primary">{t.aboutPage.affiliateTitle}</h2>
        <p>
          {t.aboutPage.affiliateDesc.replace('{name}', 'GetCreditWorth')}
        </p>

        <h2 className="text-xl font-semibold text-text-primary">{t.aboutPage.dataSources}</h2>
        <p>
          {t.aboutPage.dataSourcesDesc}
        </p>

        <h2 className="text-xl font-semibold text-text-primary">{t.aboutPage.editorialTitle}</h2>
        <p>
          {t.aboutPage.editorialDesc}
        </p>

        <h2 className="text-xl font-semibold text-text-primary">{t.aboutPage.methodologyTitle}</h2>
        <p>
          {t.aboutPage.methodologyDesc}
        </p>

        <h2 className="text-xl font-semibold text-text-primary">{t.aboutPage.contactTitle}</h2>
        <p>
          {t.aboutPage.contactDesc}
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/" className="btn btn-primary">
            <Trophy className="h-4 w-4" />
            {t.aboutPage.browseTopBooks}
          </Link>
          <Link href="/calculator" className="btn btn-outline">
            <Calculator className="h-4 w-4" />
            {t.aboutPage.tryCalculator}
          </Link>
        </div>
      </div>
    </div>
  );
}
