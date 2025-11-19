import { BookMarked } from 'lucide-react';

const CollectionsSpotlight = ({ books = [] }) => {
  if (!books.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Add books to unlock curated collections.
      </div>
    );
  }

  const genreCounts = books.reduce((acc, book) => {
    if (!book.genre) return acc;
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
        <BookMarked className="h-4 w-4 text-indigo-500" />
        Curated shelves
      </div>
      <ul className="mt-4 space-y-3">
        {topGenres.map(([genre, count]) => (
          <li
            key={genre}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{genre}</p>
              <p className="text-xs text-slate-500">{count} titles available</p>
            </div>
            <button className="text-xs font-semibold text-indigo-500">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsSpotlight;

