import { getAllBooks } from '@/lib/data/books';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { FavoritesContent } from '@/components/FavoritesContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites - Saved Audiobooks',
  description: 'View your saved audiobooks. Track books you want to spend your Audible credits on.',
  keywords: ['saved audiobooks', 'audible wishlist', 'favorite audible books'],
  alternates: { canonical: buildCanonicalUrl('/favorites') },
};

export default function FavoritesPage() {
  const books = getAllBooks();
  return <FavoritesContent books={books} />;
}
