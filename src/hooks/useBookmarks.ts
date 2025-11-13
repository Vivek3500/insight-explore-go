import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'hiresight-bookmarks';

export const useBookmarks = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        setBookmarkedIds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  }, []);

  const toggleBookmark = (fieldId: string) => {
    setBookmarkedIds((prev) => {
      const newBookmarks = prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (fieldId: string) => bookmarkedIds.includes(fieldId);

  return { bookmarkedIds, toggleBookmark, isBookmarked };
};
