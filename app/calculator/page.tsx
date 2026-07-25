import { getBookList } from '@/lib/api/controllers/book.controller';
import { CalculatorWidget } from '@/components/CalculatorWidget';
import { CalculatorContent } from '@/components/CalculatorContent';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credit Calculator - Maximize Your Audible Credit Value',
  description:
    'Calculate how much your Audible credits are worth and find the best books to spend them on. Free credit value optimizer tool.',
  alternates: { canonical: buildCanonicalUrl('/calculator') },
};

export default function CalculatorPage() {
  const result = getBookList({ pageSize: 200 });

  return (
    <div className="container-content py-6 md:py-8 max-w-3xl">
      <CalculatorContent books={result.books} />
      <CalculatorWidget books={result.books} />
    </div>
  );
}
