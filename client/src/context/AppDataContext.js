import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  booksApi,
  conversationsApi,
  exchangesApi,
  favoritesApi,
} from '../services/api';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [booksStatus, setBooksStatus] = useState('idle'); // idle | loading | ready | error
  const [favorites, setFavorites] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const refreshBooks = useCallback(async () => {
    setBooksStatus('loading');
    try {
      const data = await booksApi.list();
      setBooks(data);
      setBooksStatus('ready');
      return data;
    } catch (err) {
      setBooksStatus('error');
      throw err;
    }
  }, []);

  const refreshFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return [];
    }
    const data = await favoritesApi.list(token);
    setFavorites(data.map((b) => b.id));
    return data;
  }, [token]);

  const refreshExchanges = useCallback(async () => {
    if (!token) {
      setExchanges([]);
      return [];
    }
    const data = await exchangesApi.list(token);
    setExchanges(data);
    return data;
  }, [token]);

  const refreshConversations = useCallback(async () => {
    if (!token) {
      setConversations([]);
      return [];
    }
    const data = await conversationsApi.list(token);
    setConversations(data);
    return data;
  }, [token]);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  useEffect(() => {
    refreshFavorites();
    refreshExchanges();
    refreshConversations();
  }, [token, refreshFavorites, refreshExchanges, refreshConversations]);

  const toggleFavorite = useCallback(
    async (bookId) => {
      if (!token) throw new Error('Please sign in to save favorites.');
      const data = await favoritesApi.toggle(bookId, token);
      setFavorites(data.favorites || []);
      return data.favorites || [];
    },
    [token]
  );

  const value = useMemo(
    () => ({
      books,
      booksStatus,
      refreshBooks,
      favorites,
      toggleFavorite,
      exchanges,
      refreshExchanges,
      conversations,
      refreshConversations,
      activeConversationId,
      setActiveConversationId,
      isOwner: (book) => user && book?.ownerId === user.id,
      recommendedBooks: (() => {
        if (!favorites.length) return books.slice(0, 6);
        const favoriteSet = new Set(favorites);
        const favoriteGenres = books
          .filter((book) => favoriteSet.has(book.id))
          .map((book) => book.genre);
        const topGenre =
          favoriteGenres.sort(
            (a, b) =>
              favoriteGenres.filter((genre) => genre === b).length -
              favoriteGenres.filter((genre) => genre === a).length
          )[0] || null;
        if (!topGenre) return books.slice(0, 6);
        const recommendations = books.filter(
          (book) => book.genre === topGenre && !favoriteSet.has(book.id)
        );
        return recommendations.slice(0, 6);
      })(),
      favoriteGenres: (() => {
        if (!favorites.length) return [];
        const genreCount = books.reduce((acc, book) => {
          if (favorites.includes(book.id)) {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
          }
          return acc;
        }, {});
        return Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .map(([genre]) => genre);
      })(),
    }),
    [
      books,
      booksStatus,
      refreshBooks,
      favorites,
      toggleFavorite,
      exchanges,
      refreshExchanges,
      conversations,
      refreshConversations,
      activeConversationId,
      user,
      favorites.length,
      books.length,
      exchanges.length,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
};

