const SectionHeading = ({ eyebrow, title, description, align = 'center', actions }) => (
  <div className={`mb-8 text-${align}`}>
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
        {eyebrow}
      </p>
    )}
    <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className={align === 'left' ? 'text-left' : 'text-center md:text-left'}>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
        {description && <p className="mt-2 text-base text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  </div>
);

export default SectionHeading;

