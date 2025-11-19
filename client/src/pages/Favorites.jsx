import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import BookGrid from '../components/books/BookGrid';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { exchangesApi, conversationsApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Favorites = () => {
  const { books, favorites, toggleFavorite, isOwner, refreshBooks, refreshExchanges, exchanges } =
    useAppData();
  const { token, user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const favoriteBooks = books.filter((book) => favorites.includes(book.id));

  if (!favorites.length) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the heart on any book to keep it in your shortlist."
        icon={<Heart className="h-10 w-10" />}
        action={
          <button
            onClick={() => navigate('/browse')}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
          >
            Browse books
          </button>
        }
      />
    );
  }

  const handleRequest = async (book) => {
    try {
      await exchangesApi.create(
        { bookId: book.id, message: `Checking in about ${book.title}` },
        token
      );
      notify('Exchange request sent.', 'success');
      refreshBooks();
      refreshExchanges();
    } catch (err) {
      notify(err.message || 'Unable to request exchange.', 'error');
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
    if (!canChatOnBook(book)) {
      notify('Send or accept an exchange request before chatting with the owner.', 'info');
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

  const shareFavorites = async () => {
    try {
      const summary = favoriteBooks
        .map((book, idx) => `${idx + 1}. ${book.title} by ${book.author}`)
        .join('\n');
      await navigator.clipboard.writeText(
        `My BookLoop wishlist:\n${summary || 'No favorites yet.'}`
      );
      notify('Wishlist copied to clipboard!', 'success');
    } catch (error) {
      notify('Unable to copy wishlist right now.', 'error');
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Saved list"
        title="Books you’re tracking"
        description="You’ll get notified when statuses change or owners reply."
        align="left"
        actions={
          <button
            onClick={shareFavorites}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 hover:border-slate-300"
          >
            Share wishlist
          </button>
        }
      />
      <BookGrid
        books={favoriteBooks}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onRequestExchange={handleRequest}
        onChat={handleChat}
        isOwner={isOwner}
      />
    </div>
  );
};

export default Favorites;

