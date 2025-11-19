import BookCard from './BookCard';

const BookGrid = ({
  books,
  isLoading,
  favorites = [],
  onToggleFavorite,
  onRequestExchange,
  onChat,
  isOwner,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[26rem] animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
          />
        ))}
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow">
        <p className="text-lg font-semibold text-slate-900">No books match your filters yet.</p>
        <p className="mt-2 text-sm text-slate-500">Try adjusting the search or genre.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
          onRequestExchange={onRequestExchange}
          onChat={onChat}
          isOwner={isOwner?.(book)}
        />
      ))}
    </div>
  );
};

export default BookGrid;

