import { Github, Linkedin, Twitter } from 'lucide-react';

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center md:flex-row md:text-left">
        <div>
          <p className="text-slate-700">© {new Date().getFullYear()} BookLoop</p>
          <p className="text-xs text-slate-400">
            Built with ❤️ for readers. File-based backend, ready to deploy anywhere.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {socials.map(({ icon: Icon, ...item }) => (
            <a
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 transition hover:border-slate-300 hover:text-slate-900"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

