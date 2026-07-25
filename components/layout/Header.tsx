'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Trophy, BookOpen, ListChecks, Calculator, FileText } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/config';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';

const ICON_MAP = {
  Trophy,
  BookOpen,
  ListChecks,
  Calculator,
  FileText,
} as const;

const NAV_LABELS: Record<string, 'topBooks' | 'allBooks' | 'curatedLists' | 'calculator' | 'blog'> = {
  '/': 'topBooks',
  '/books': 'allBooks',
  '/curated': 'curatedLists',
  '/calculator': 'calculator',
  '/blog': 'blog',
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-bg-base border-b border-border">
      <div className="container-content flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-mono font-bold text-sm">
            GC
          </span>
          <span className="font-semibold text-lg text-text-primary">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const labelKey = NAV_LABELS[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {labelKey ? t.nav[labelKey] : item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: trial CTA + language + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Free Trial CTA - 参考 AudibleCreditOptimizer 右上角蓝色按钮 */}
          <a
            href={buildAudibleTrialUrl()}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="hidden sm:inline-flex items-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-md border-2 border-primary text-primary bg-bg-base hover:bg-primary hover:text-white transition-colors duration-150 whitespace-nowrap"
          >
            {t.header.freeTrial}
          </a>
          <LanguageSwitcher />
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-md text-text-primary hover:bg-bg-surface"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.nav.toggleMenu}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-bg-base">
          <div className="container-content py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const labelKey = NAV_LABELS[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-primary hover:bg-primary-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {labelKey ? t.nav[labelKey] : item.label}
                </Link>
              );
            })}
            {/* Mobile Free Trial CTA */}
            <a
              href={buildAudibleTrialUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center mt-2 px-3 py-2.5 text-sm font-semibold rounded-md border-2 border-primary text-primary bg-bg-base hover:bg-primary hover:text-white transition-colors duration-150"
              onClick={() => setMobileOpen(false)}
            >
              {t.header.freeTrial}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
