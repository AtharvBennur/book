const BADGES = [
  { label: 'Newcomer', threshold: 1, description: 'Completed your first swap' },
  { label: 'Connector', threshold: 3, description: 'Matched with three readers' },
  { label: 'Super Lender', threshold: 6, description: 'Six successful exchanges' },
  { label: 'Library Hero', threshold: 10, description: 'Ten swaps and counting' },
];

const SwapBadges = ({ completed = 0 }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Swap badges</div>
    <p className="mt-1 text-sm text-slate-500">
      Earn digital badges as you build trust within the community.
    </p>
    <ul className="mt-4 space-y-3">
      {BADGES.map((badge) => {
        const earned = completed >= badge.threshold;
        return (
          <li
            key={badge.label}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
              earned
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-100 bg-slate-50 text-slate-400'
            }`}
          >
            <div>
              <p className="text-sm font-semibold">{badge.label}</p>
              <p className="text-xs">{badge.description}</p>
            </div>
            <span className="text-xs font-semibold">
              {completed}/{badge.threshold}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);

export default SwapBadges;

