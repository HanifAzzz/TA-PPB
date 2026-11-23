import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 18, text: 'text-lg' },
    md: { icon: 24, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-4xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className="flex items-center gap-2.5 group no-underline">
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-forge-accent to-forge-primary p-1.5 shadow-glow-cyan group-hover:shadow-glow-indigo transition-shadow`} style={{ width: s.icon + 20, height: s.icon + 20 }}>
        <Cpu size={s.icon} className="text-forge-bg" strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-black tracking-tight text-forge-text`}>
        Hani<span className="text-forge-accent">forge</span>
      </span>
    </Link>
  );
}
