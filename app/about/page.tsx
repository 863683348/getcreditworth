import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { AboutContent } from '@/components/AboutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About GetCreditWorth',
  description: 'Learn how GetCreditWorth helps you maximize your Audible credit value with data-driven recommendations.',
  alternates: { canonical: buildCanonicalUrl('/about') },
};

export default function AboutPage() {
  return <AboutContent />;
}
