'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gcw_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  const toggleFavorite = useCallback((asin: string) => {
    setFavorites((prev) => {
      const next = prev.includes(asin)
        ? prev.filter((a) => a !== asin)
        : [...prev, asin];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (asin: string) => favorites.includes(asin),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, loaded };
}
