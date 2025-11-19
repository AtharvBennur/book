import { BarChart3, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';

const SwapStats = ({ totalBooks = 0, availableBooks = 0, activeExchanges = 0, completedSwaps = 0 }) => {
  const cards = [
    {
      label: 'Total books',
      value: totalBooks,
      icon: BookOpen,
      tone: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Available now',
      value: availableBooks,
      icon: Sparkles,
      tone: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Active requests',
      value: activeExchanges,
      icon: HeartHandshake,
      tone: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Completed swaps',
      value: completedSwaps,
      icon: BarChart3,
      tone: 'text-slate-600 bg-slate-50 border-slate-100',
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Live marketplace stats</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border px-4 py-5 ${card.tone} shadow-inner shadow-white`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <card.icon className="h-4 w-4" />
              {card.label}
            </div>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SwapStats;

