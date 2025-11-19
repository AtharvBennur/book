import { Sparkles } from 'lucide-react';

const ShuffleSpotlight = ({ book, onShuffle }) => (
  <div className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-emerald-50 p-5 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Serendipity shuffle
        </p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">{book.title}</h3>
        <p className="text-sm text-slate-500">by {book.author}</p>
      </div>
      <button
        onClick={onShuffle}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-white"
      >
        <Sparkles className="h-4 w-4" />
        Shuffle again
      </button>
    </div>
  </div>
);

export default ShuffleSpotlight;

