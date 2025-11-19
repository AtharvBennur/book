import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

const STORAGE_KEY = 'be_challenge_month';
const PROGRESS_KEY = 'be_challenge_days';

const ReadingChallenge = () => {
  const [month, setMonth] = useState('');
  const [completedDays, setCompletedDays] = useState(0);

  useEffect(() => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    setMonth(monthName);
    const storedMonth = localStorage.getItem(STORAGE_KEY);
    const storedProgress = Number(localStorage.getItem(PROGRESS_KEY)) || 0;
    if (storedMonth === monthName) {
      setCompletedDays(storedProgress);
    } else {
      localStorage.setItem(STORAGE_KEY, monthName);
      localStorage.setItem(PROGRESS_KEY, '0');
      setCompletedDays(0);
    }
  }, []);

  const increment = () => {
    setCompletedDays((prev) => {
      const next = Math.min(prev + 1, 30);
      localStorage.setItem(PROGRESS_KEY, String(next));
      return next;
    });
  };

  const progress = Math.round((completedDays / 30) * 100);

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-emerald-500">
        <Flame className="h-4 w-4" />
        {month} reading marathon
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Stay consistent by logging every day you read. 30-day challenge resets monthly.
      </p>
      <p className="mt-4 text-4xl font-black text-slate-900">
        {completedDays}
        <span className="text-base font-semibold text-slate-500"> / 30 days</span>
      </p>
      <div className="mt-4 h-3 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={increment}
        className="mt-4 w-full rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-white"
      >
        Log today’s reading
      </button>
    </section>
  );
};

export default ReadingChallenge;

