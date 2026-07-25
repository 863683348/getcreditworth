import { getAllCuratedLists } from '@/lib/api/controllers/curated.controller';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { CuratedListContent } from '@/components/CuratedListContent';
import type { Metadata } from 'next';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'Curated Audiobook Lists - Hand-Picked Recommendations',
  description:
    'Browse curated lists of the best audiobooks for your Audible credits. Hand-picked recommendations by genre and listening goal.',
  alternates: { canonical: buildCanonicalUrl('/curated') },
};

export default function CuratedListsPage() {
  const lists = getAllCuratedLists();
  return <CuratedListContent lists={lists} />;
}
