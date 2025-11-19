const EmptyState = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
    {icon && <div className="text-emerald-500">{icon}</div>}
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    {description && <p className="max-w-md text-sm text-slate-600">{description}</p>}
    {action}
  </div>
);

export default EmptyState;

