'use client';

import { useMemo, useCallback } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import type { Book } from '@/lib/types';
import { BookList } from '@/components/BookList';
import { useFavorites } from '@/lib/hooks/useFavorites';

interface FavoritesContentProps {
  books: Book[];
}

export function FavoritesContent({ books }: FavoritesContentProps) {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteBooks = useMemo(() => {
    return books.filter((b) => favorites.includes(b.asin));
  }, [books, favorites]);

  return (
    <div className="container-content py-6 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-danger" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            My Favorites
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          {favoriteBooks.length > 0
            ? ${favoriteBooks.length} saved audiobook. Click the bookmark icon on any book to save or remove it.
            : 'You haven\'t saved any audiobooks yet. Browse the top books and click the bookmark icon to save your favorites.'}
        </p>
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No saved audiobooks yet.</p>
        </div>
      ) : (
        <BookList books={favoriteBooks} showRank={false} />
      )}
    </div>
  );
}
