/**
 * i18n 系统 - Context + Provider + Hook
 * 语言切换基于 localStorage 持久化
 */
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { en, type TranslationKeys } from './en';
import { zh } from './zh';

export type Locale = 'en' | 'zh';

const STORAGE_KEY = 'gcw-locale';

const dictionaries: Record<Locale, TranslationKeys> = { en, zh };

interface I18nContextValue {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // 客户端初始化：从 localStorage 读取
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'zh' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved === 'zh' ? 'zh' : 'en';
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale === 'zh' ? 'zh' : 'en';
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  }, [locale, setLocale]);

  const value: I18nContextValue = {
    locale,
    t: dictionaries[locale],
    setLocale,
    toggleLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
