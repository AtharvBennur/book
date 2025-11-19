import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  MessageSquare,
  PlusCircle,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

const navItems = [
  { to: '/browse', label: 'Browse' },
  { to: '/insights', label: 'Insights' },
  { to: '/favorites', label: 'Favorites', requiresAuth: true },
  { to: '/exchanges', label: 'Requests', requiresAuth: true },
  { to: '/chat', label: 'Chat', requiresAuth: true },
];

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { exchanges } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingCount = exchanges.filter((item) => item.status === 'requested').length;

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth/signin', { state: { from: location.pathname } });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-slate-900">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 p-2 text-slate-900 shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">BookLoop</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Exchange</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'text-sm font-semibold transition-colors',
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {item.label}
                {item.to === '/exchanges' && pendingCount > 0 && (
                  <span className="ms-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500/90 px-2 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/browse')}
            className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white md:flex"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Discover
          </button>

          <button
            onClick={() => navigate(isAuthenticated ? '/add' : '/auth/signin')}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:opacity-95"
          >
            <PlusCircle className="h-4 w-4" />
            List a Book
          </button>

          <button
            onClick={handleAuthClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-slate-900"
            aria-label={isAuthenticated ? 'Open profile' : 'Sign in'}
          >
            {isAuthenticated ? (
              <span className="text-xs font-bold uppercase">
                {(user?.name || user?.email || '?')
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            ) : (
              <UserCircle2 className="h-5 w-5" />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={logout}
              className="hidden text-xs font-semibold text-slate-500 transition hover:text-slate-900 md:inline-flex"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

