'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export type ViewMode = 'card' | 'table';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  const { t } = useI18n();

  return (
    <div
      className="inline-flex items-center rounded-md border border-border bg-bg-surface p-0.5"
      role="group"
      aria-label={t.viewToggle.ariaLabel}
    >
      <button
        onClick={() => onChange('card')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
          mode === 'card'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-primary'
        }`}
        aria-pressed={mode === 'card'}
        title={t.viewToggle.card}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t.viewToggle.card}</span>
      </button>
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
          mode === 'table'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-primary'
        }`}
        aria-pressed={mode === 'table'}
        title={t.viewToggle.table}
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t.viewToggle.table}</span>
      </button>
    </div>
  );
}
