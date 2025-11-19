import { Link } from 'react-router-dom';
import { Sparkles, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-6 py-14 shadow-2xl shadow-emerald-100 sm:px-12">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25)_0,_transparent_60%)] opacity-70 lg:block" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            <Sparkles className="h-4 w-4" />
            Swap smarter
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Give stories a second life. Find your next favorite read today.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            BookLoop pairs a clean interface with instant messaging, exchange workflows, and even an
            AI librarian. Built to be delightful on mobile and powerful on desktop.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/browse"
              className="rounded-full bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-emerald-100 transition hover:-translate-y-0.5"
            >
              Browse library
            </Link>
            <Link
              to={isAuthenticated ? '/add' : '/auth/signup'}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              {isAuthenticated ? 'List a book' : 'Create account'}
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, idx) => (
                <span
                  key={idx}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-xs font-bold text-slate-600 shadow"
                >
                  {['AK', 'JS', 'PM', 'VR'][idx]}
                </span>
              ))}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">
                2,100+ swaps completed without a lost book.
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Since 2023</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <Users className="h-4 w-4 text-emerald-500" />
            Live community snapshot
          </div>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { label: 'Books listed', value: '5,126' },
              { label: 'Instant matches', value: '982' },
              { label: 'Avg. response', value: '7m' },
              { label: 'Cities represented', value: '74' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Hero;

