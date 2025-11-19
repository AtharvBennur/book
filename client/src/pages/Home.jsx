import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeatureGrid from '../components/home/FeatureGrid';
import Steps from '../components/home/Steps';
import SectionHeading from '../components/common/SectionHeading';
import BookCard from '../components/books/BookCard';
import AIAssistant from '../components/ai/AIAssistant';
import SwapStats from '../components/home/SwapStats';
import RecommendedRail from '../components/home/RecommendedRail';
import ReadingChallenge from '../components/home/ReadingChallenge';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const {
    books,
    booksStatus,
    favorites,
    toggleFavorite,
    isOwner,
    exchanges,
    recommendedBooks,
    favoriteGenres,
  } = useAppData();
  const { isAuthenticated } = useAuth();
  const trending = books.slice(0, 3);
  const availableBooks = books.filter((book) => book.status === 'available').length;
  const activeExchanges = exchanges.filter((exchange) => exchange.status === 'requested').length;
  const completedSwaps = exchanges.filter((exchange) => exchange.status === 'accepted').length;

  return (
    <div className="space-y-14">
      <Hero />

      <section>
        <SectionHeading
          eyebrow="Why readers stay"
          title="Thoughtful features for active book swappers"
          description="Everything lives in one dashboard—books, conversations, exchange workflows, and AI guidance."
        />
        <FeatureGrid />
      </section>

      <SwapStats
        totalBooks={books.length}
        availableBooks={availableBooks}
        activeExchanges={activeExchanges}
        completedSwaps={completedSwaps}
      />

      <section>
        <SectionHeading
          eyebrow="Community picks"
          title="Trending books this week"
          description="Handful of fresh listings across genres. Browse the full catalog anytime."
          actions={
            <Link
              to="/browse"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              View catalog
            </Link>
          }
        />
        {booksStatus === 'loading' ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[26rem] animate-pulse rounded-3xl border border-slate-200 bg-slate-50"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {trending.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isFavorite={favorites.includes(book.id)}
                onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
                isOwner={isOwner(book)}
              />
            ))}
          </div>
        )}
      </section>

      {isAuthenticated && favoriteGenres.length > 0 && recommendedBooks.length > 0 && (
        <RecommendedRail
          books={recommendedBooks}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isOwner={isOwner}
        />
      )}

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeading
            eyebrow="3-step flow"
            title="Swapping books is cleaner than ever"
            description="Each exchange is tracked with timeline updates, reminders, and private chat threads."
            align="left"
          />
          <Steps />
        </div>
        <AIAssistant />
      </section>

      <ReadingChallenge />
    </div>
  );
};

export default Home;

