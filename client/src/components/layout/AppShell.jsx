import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppShell = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-0 h-64 w-64 rounded-full bg-emerald-200/50 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-sky-200/50 blur-[140px]" />
      </div>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppShell;

