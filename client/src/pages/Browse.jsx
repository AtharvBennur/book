import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookFilters from '../components/books/BookFilters';
import BookGrid from '../components/books/BookGrid';
import ShuffleSpotlight from '../components/books/ShuffleSpotlight';
import SectionHeading from '../components/common/SectionHeading';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { exchangesApi, conversationsApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Browse = () => {
  const {
    books,
    booksStatus,
    favorites,
    toggleFavorite,
    refreshBooks,
    refreshExchanges,
    isOwner,
    exchanges,
  } = useAppData();
  const { isAuthenticated, token, user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    genre: 'All Genres',
    status: 'Any Status',
  });
  const [spotlightBook, setSpotlightBook] = useState(null);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !filters.search ||
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase());
      const matchesGenre = filters.genre === 'All Genres' || book.genre === filters.genre;
      const matchesStatus = filters.status === 'Any Status' || book.status === filters.status;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, filters]);

  useEffect(() => {
    if (filteredBooks.length) {
      setSpotlightBook(filteredBooks[Math.floor(Math.random() * filteredBooks.length)]);
    } else {
      setSpotlightBook(null);
    }
  }, [filteredBooks]);

  const shuffleSpotlight = () => {
    if (!filteredBooks.length) return;
    setSpotlightBook(filteredBooks[Math.floor(Math.random() * filteredBooks.length)]);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      notify('Please sign in to continue.', 'info');
      navigate('/auth/signin', { replace: true, state: { from: '/browse' } });
      return false;
    }
    return true;
  };

  const handleRequest = async (book) => {
    if (!requireAuth()) return;
    try {
      await exchangesApi.create(
        { bookId: book.id, message: `I'd love to exchange for ${book.title}` },
        token
      );
      notify('Exchange request sent.', 'success');
      refreshBooks();
      refreshExchanges();
    } catch (err) {
      notify(err.message || 'Unable to create request.', 'error');
    }
  };

  const canChatOnBook = (book) => {
    if (!user) return false;
    return exchanges.some(
      (exchange) =>
        exchange.bookId === book.id &&
        [exchange.ownerId, exchange.requesterId].includes(user.id) &&
        [exchange.ownerId, exchange.requesterId].includes(book.ownerId)
    );
  };

  const handleChat = async (book) => {
    if (!requireAuth()) return;
    if (!canChatOnBook(book)) {
      notify('Send or accept an exchange request to unlock chat for this book.', 'info');
      return;
    }
    try {
      const conversation = await conversationsApi.create(
        { otherUserId: book.ownerId, bookId: book.id },
        token
      );
      navigate('/chat', { state: { conversationId: conversation.id } });
    } catch (err) {
      notify(err.message || 'Unable to open chat.', 'error');
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Browse"
        title="Seamless marketplace for every genre"
        description="Use filters, favorites, and quick actions to find the exact story you want to read next."
        align="left"
      />
      <BookFilters filters={filters} onChange={setFilters} />
      {spotlightBook && (
        <ShuffleSpotlight book={spotlightBook} onShuffle={shuffleSpotlight} />
      )}
      <BookGrid
        books={filteredBooks}
        isLoading={booksStatus === 'loading'}
        favorites={favorites}
        onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
        onRequestExchange={handleRequest}
        onChat={handleChat}
        isOwner={isOwner}
      />
    </div>
  );
};

export default Browse;

