import { Heart, MapPin, MessageSquare, User } from 'lucide-react';
import clsx from 'clsx';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80';

const statusTone = {
  available: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  reserved: 'text-amber-700 bg-amber-50 border-amber-200',
  exchanged: 'text-rose-700 bg-rose-50 border-rose-200',
};

const BookCard = ({
  book,
  isFavorite,
  isOwner,
  onToggleFavorite,
  onRequestExchange,
  onChat,
}) => {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-100">
      <div className="relative h-56 overflow-hidden border-b border-slate-100">
        <img
          src={book.imageUrl || FALLBACK_IMG}
          alt={book.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(event) => {
            event.target.src = FALLBACK_IMG;
          }}
        />
        <div className="absolute left-4 top-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-slate-600 shadow">
            {book.genre || 'General'}
          </span>
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(book.id)}
            className={clsx(
              'absolute right-4 top-4 rounded-full border px-2.5 py-2 transition',
              isFavorite
                ? 'border-rose-300 bg-rose-50 text-rose-500'
                : 'border-slate-200 bg-white/80 text-slate-500 hover:text-slate-900'
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={clsx('h-4 w-4', isFavorite && 'fill-current')} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Title</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">{book.title}</h3>
          <p className="text-sm text-slate-500">by {book.author}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span>{book.location || 'Remote'}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {book.ownerId?.slice(0, 6) || 'Owner'}
            </span>
          </div>
          <span
            className={clsx(
                'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              statusTone[book.status || 'available'] ??
                'border-emerald-200 bg-emerald-50 text-emerald-600'
            )}
          >
            {book.status || 'available'}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            {book.condition}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          {isOwner ? (
            <p className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
              Your listing
            </p>
          ) : (
            <>
              <button
                onClick={() => onRequestExchange?.(book)}
                disabled={book.status === 'exchanged'}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SparklesMini />
                Request
              </button>
              <button
                onClick={() => onChat?.(book)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SparklesMini = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
    <path
      d="M12 3v4m0 10v4m7-7h-4M9 12H5m9.5-5.5l-1.5 3-3 1.5m6 6l-1.5-3-3-1.5"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BookCard;

