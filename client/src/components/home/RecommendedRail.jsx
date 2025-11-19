import BookCard from '../books/BookCard';

const RecommendedRail = ({ books = [], favorites = [], onToggleFavorite, isOwner }) => {
  if (!books.length) return null;
  return (
    <section>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">For you</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">Smart matches based on your taste</h3>
        <p className="text-sm text-slate-500">We scan your favorites and surface fresh copies automatically.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={favorites.includes(book.id)}
            onToggleFavorite={onToggleFavorite}
            isOwner={isOwner(book)}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedRail;

