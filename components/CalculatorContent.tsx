'use client';

import { Calculator } from 'lucide-react';
import type { Book } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface CalculatorContentProps {
  books: Book[];
}

export function CalculatorContent({ books: _books }: CalculatorContentProps) {
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {t.calculatorPage.title}
        </h1>
      </div>
      <p className="text-sm text-text-secondary">
        {t.calculatorPage.subtitle}
      </p>
    </div>
  );
}
