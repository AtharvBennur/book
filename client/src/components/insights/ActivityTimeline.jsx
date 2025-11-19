import { ArrowRightLeft, CheckCircle2, Clock3 } from 'lucide-react';
import clsx from 'clsx';

const statusTone = {
  requested: 'bg-amber-50 text-amber-600 border-amber-100',
  accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  declined: 'bg-rose-50 text-rose-600 border-rose-100',
};

const statusIcon = {
  requested: Clock3,
  accepted: CheckCircle2,
  declined: ArrowRightLeft,
};

const ActivityTimeline = ({ exchanges = [] }) => {
  if (!exchanges.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        No exchange activity yet.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent activity</div>
      <ol className="mt-4 space-y-4">
        {exchanges.slice(0, 5).map((item) => {
          const Icon = statusIcon[item.status] || ArrowRightLeft;
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div
                className={clsx(
                  'mt-1 rounded-full border p-2',
                  statusTone[item.status] || 'bg-slate-50 text-slate-500 border-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)} • Book {item.bookId}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()} — {item.message || 'No note provided'}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ActivityTimeline;

