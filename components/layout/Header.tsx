"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Trophy, BookOpen, ListChecks, Calculator, FileText, Bookmark, GitCompare, FolderOpen } from "lucide-react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const ICON_MAP = {
  Trophy,
  BookOpen,
  ListChecks,
  Calculator,
  FileText,
  Bookmark,
  GitCompare,
} as const;

const NAV_LABELS: Record<string, "topBooks" | "allBooks" | "curatedLists" | "calculator" | "blog" | "favorites" | "compare" | "categories" | "series"> = {
  "/": "topBooks",
  "/books": "allBooks",
  "/curated": "curatedLists",
  "/calculator": "calculator",
  "/blog": "blog",
  "/favorites": "favorites",
  "/compare": "compare",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  // 缁夎濮╅懣婊冨礋閹垫挸绱戦弮鍫曟敚鐎?body 濠婃艾濮?
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
          <span className="font-semibold text-base sm:text-lg text-text-primary">GetCreditWorth</span>
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
          </div>
        </nav>
      )}
    </header>
  );
}

