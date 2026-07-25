'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-bg-surface mt-16">
      <div className="container-content py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-mono font-bold text-sm">
                GC
              </span>
              <span className="font-semibold text-text-primary">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t.footer.explore}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary">
                  {t.footer.topRated}
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-text-secondary hover:text-primary">
                  {t.footer.allBooks}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-text-secondary hover:text-primary">
                  {t.footer.creditCalculator}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-secondary hover:text-primary">
                  {t.footer.guidesBlog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t.footer.disclosure}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t.footer.disclosureText.replace('{name}', SITE_CONFIG.name)}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            &copy; {year} {SITE_CONFIG.name}. {t.footer.allRightsReserved}
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/about" className="hover:text-primary">{t.footer.about}</Link>
            <Link href="/about#how-it-works" className="hover:text-primary">{t.footer.howItWorks}</Link>
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-1 hover:text-primary"
            >
              {t.footer.amazon} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
