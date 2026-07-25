'use client';

import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useI18n();

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150"
      aria-label={locale === 'en' ? '切换到中文' : 'Switch to English'}
      title={locale === 'en' ? '切换到中文' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{locale === 'en' ? '中' : 'EN'}</span>
    </button>
  );
}
