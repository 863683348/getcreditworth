"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { useRegion } from "@/components/RegionProvider";
import { getAffiliateTag } from "@/lib/utils/affiliate";
import { AMAZON_TLD } from "@/lib/amazon-regions";

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useI18n();
  const { region } = useRegion();
  const amazonUrl = `https://www.amazon.${AMAZON_TLD[region]}/?tag=${getAffiliateTag(region)}`;

  return (
    <footer className="border-t border-border bg-bg-surface mt-12 sm:mt-16">
      <div className="container-content py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">

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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t.footer.disclosure}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t.footer.disclosureText.replace("{name}", SITE_CONFIG.name)}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted text-center sm:text-left">
            &copy; {year} {SITE_CONFIG.name}. {t.footer.allRightsReserved}
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap justify-center">
            <Link href="/about" className="hover:text-primary min-h-[44px] flex items-center">{t.footer.about}</Link>
            <Link href="/privacy" className="hover:text-primary min-h-[44px] flex items-center">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-primary min-h-[44px] flex items-center">{t.footer.terms}</Link>
            <Link href="/contact" className="hover:text-primary min-h-[44px] flex items-center">{t.footer.contact}</Link>
            <Link href="/about#how-it-works" className="hover:text-primary min-h-[44px] flex items-center">{t.footer.howItWorks}</Link>
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-1 hover:text-primary min-h-[44px]"
            >
              {t.footer.amazon} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
