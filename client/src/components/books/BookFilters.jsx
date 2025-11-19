import { useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const genres = ['All Genres', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography', 'Textbook'];
const statuses = ['Any Status', 'available', 'reserved', 'exchanged'];

const BookFilters = ({ filters, onChange }) => {
  const update = (patch) => onChange({ ...filters, ...patch });
  const filterSummary = useMemo(() => {
    const entries = [];
    if (filters.search) entries.push(`“${filters.search}”`);
    if (filters.genre !== 'All Genres') entries.push(filters.genre);
    if (filters.status !== 'Any Status') entries.push(filters.status);
    return entries.join(' · ') || 'All books';
  }, [filters]);

  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-inner shadow-slate-100">
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <label className="flex-1 text-sm font-semibold text-slate-700">
          <span className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <Search className="h-4 w-4" /> Search
          </span>
          <input
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Book or author"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
          />
        </label>
        <label className="flex-1 text-sm font-semibold text-slate-700">
          <span className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">Genre</span>
          <select
            value={filters.genre}
            onChange={(event) => update({ genre: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
          >
            {genres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-sm font-semibold text-slate-700">
          <span className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">Status</span>
          <select
            value={filters.status}
            onChange={(event) => update({ status: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        <SlidersHorizontal className="h-4 w-4" />
        {filterSummary}
      </div>
    </div>
  );
};

export default BookFilters;

