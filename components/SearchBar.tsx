'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  initialValue = '',
}: SearchBarProps) {
  const { t } = useI18n();
  const [value, setValue] = useState(initialValue);

  // 防抖 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.search.placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-bg-base text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        aria-label={t.search.ariaLabel}
      />
    </div>
  );
}
