const LoadingScreen = ({ label = 'Loading experience…' }) => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-600 shadow-lg">
      <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
      {label}
    </div>
  </div>
);

export default LoadingScreen;

