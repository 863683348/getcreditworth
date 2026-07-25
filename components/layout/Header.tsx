"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Trophy, BookOpen, ListChecks, Calculator, FileText } from "lucide-react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { buildAudibleTrialUrl } from "@/lib/utils/affiliate";

const ICON_MAP = {
  Trophy,
  BookOpen,
  ListChecks,
  Calculator,
  FileText,
} as const;

const NAV_LABELS: Record<string, "topBooks" | "allBooks" | "curatedLists" | "calculator" | "blog"> = {
  "/": "topBooks",
  "/books": "allBooks",
  "/curated": "curatedLists",
  "/calculator": "calculator",
  "/blog": "blog",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  // 移动菜单打开时锁定 body 滚动
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-bg-base border-b border-border">
      <div className="container-content flex h-14 sm:h-16 items-center justify-between safe-area-padding">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-white font-mono font-bold text-xs sm:text-sm">
            GC
          </span>
          <span className="font-semibold text-base sm:text-lg text-text-primary hidden xs:inline">
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
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {labelKey ? t.nav[labelKey] : item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={buildAudibleTrialUrl()}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="hidden sm:inline-flex items-center px-2.5 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-md border-2 border-primary text-primary bg-bg-base hover:bg-primary hover:text-white transition-colors duration-150 whitespace-nowrap"
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
        <nav className="md:hidden border-t border-border bg-bg-base safe-area-padding-bottom">
          <div className="container-content py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const labelKey = NAV_LABELS[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm text-text-secondary hover:text-primary hover:bg-primary-50 min-h-[44px]"
                  onClick={() => setMobileOpen(false)}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {labelKey ? t.nav[labelKey] : item.label}
                </Link>
              );
            })}
            <a
              href={buildAudibleTrialUrl()}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center mt-2 px-3 py-3 text-sm font-semibold rounded-md border-2 border-primary text-primary bg-bg-base hover:bg-primary hover:text-white transition-colors duration-150 min-h-[44px]"
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
