const steps = [
  {
    title: 'List a book',
    detail: 'Add a few details and upload an optional cover. Listings go live instantly.',
    tag: 'Step 1',
  },
  {
    title: 'Match & chat',
    detail: 'Receive exchange requests, chat privately, and verify availability in one place.',
    tag: 'Step 2',
  },
  {
    title: 'Swap confidently',
    detail: 'Mark books reserved or exchanged, track history, and keep your library updated.',
    tag: 'Step 3',
  },
];

const Steps = () => (
  <ol className="space-y-6">
    {steps.map((step, idx) => (
      <li
        key={step.title}
        className="relative rounded-3xl border border-slate-200 bg-white p-6 ps-8 text-slate-600 shadow-lg shadow-slate-100"
      >
        <div className="absolute left-3 top-6 h-2 w-2 rounded-full bg-emerald-500" />
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">{step.tag}</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{step.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
        <div className="mt-4 text-xs text-slate-400">Takes ~{idx + 1} min</div>
      </li>
    ))}
  </ol>
);

export default Steps;

