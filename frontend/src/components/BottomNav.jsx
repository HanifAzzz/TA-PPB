import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, Wrench, Server, User } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';

const navItems = [
  { to: '/',          label: 'Home',      icon: Home },
  { to: '/components', label: 'Komponen', icon: Layers },
  { to: '/builder',   label: 'Rakit PC',  icon: Wrench },
  { to: '/my-builds', label: 'Build Saya', icon: Server },
  { to: '/profile',   label: 'Profil',   icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const { selectedCount } = useBuilder();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-forge-surface/95 border-t border-forge-border backdrop-blur-md">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const showBadge = to === '/builder' && selectedCount > 0;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 w-14 h-full justify-center relative group"
              aria-label={label}
            >
              <div className={`relative flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${isActive ? 'bg-forge-accent/15' : 'group-hover:bg-white/5'}`}>
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${isActive ? 'text-forge-accent' : 'text-forge-muted group-hover:text-forge-text'}`}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 bg-forge-accent text-forge-bg text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {selectedCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 leading-none ${isActive ? 'text-forge-accent' : 'text-forge-muted group-hover:text-forge-text'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
