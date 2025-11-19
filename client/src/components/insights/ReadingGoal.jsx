import { useEffect, useMemo, useState } from 'react';
import { Trophy, BookOpenCheck } from 'lucide-react';

const STORAGE_KEY = 'be_reading_goal';

const ReadingGoal = ({ completed = 0 }) => {
  const [goal, setGoal] = useState(12);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (stored > 0) setGoal(stored);
  }, []);

  const progress = useMemo(() => {
    if (!goal) return 0;
    return Math.min(100, Math.round((completed / goal) * 100));
  }, [goal, completed]);

  const handleChange = (value) => {
    const next = Number(value);
    setGoal(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
        <Trophy className="h-4 w-4 text-amber-500" />
        Yearly reading goal
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{goal} books</p>
      <p className="text-sm text-slate-500">Completed swaps: {completed}</p>
      <div className="mt-4">
        <input
          type="range"
          min="4"
          max="52"
          value={goal}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full accent-emerald-500"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        <BookOpenCheck className="h-5 w-5" />
        Keep a steady rhythm of one swap every {Math.max(1, Math.round(52 / goal))} week(s).
      </div>
    </div>
  );
};

export default ReadingGoal;

