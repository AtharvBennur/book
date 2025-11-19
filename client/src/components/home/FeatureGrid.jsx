import { MessageSquarePlus, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    title: 'Guided exchanges',
    description: 'Track every request with smart timelines, reminders, and automated status changes.',
    icon: Zap,
  },
  {
    title: 'Realtime chat',
    description: 'Private 1:1 messaging with read receipts, desktop notifications, and typing status.',
    icon: MessageSquarePlus,
  },
  {
    title: 'AI librarian',
    description: 'Ask for reading recommendations, contract tips, or dispute help without leaving the app.',
    icon: Sparkles,
  },
  {
    title: 'Trust profiles',
    description: 'Profiles with bios, swap stats, and verification make it easy to trust new readers.',
    icon: ShieldCheck,
  },
];

const FeatureGrid = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {features.map((feature) => (
      <div
        key={feature.title}
        className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100"
      >
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
          <feature.icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
);

export default FeatureGrid;

