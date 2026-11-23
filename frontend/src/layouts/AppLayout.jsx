import Logo from '../components/Logo';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import InstallPwaPrompt from '../components/InstallPwaPrompt';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Wrench, Server, User, Sparkles } from 'lucide-react';

const sidebarItems = [
  { to: '/',           label: 'Home',       icon: Home },
  { to: '/components', label: 'Komponen',   icon: Layers },
  { to: '/builder',    label: 'Rakit PC',   icon: Wrench },
  { to: '/my-builds',  label: 'Build Saya', icon: Server },
  { to: '/profile',    label: 'Profil',     icon: User },
];

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text flex flex-col">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-forge-surface/90 backdrop-blur-md border-b border-forge-border px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <InstallPwaPrompt />
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-forge-border bg-forge-surface z-40">
          <div className="p-5 border-b border-forge-border flex flex-col gap-1">
            <Logo size="md" />
            <p className="text-forge-muted text-xs mt-1">Build Your Dream PC</p>
          </div>

          <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
            {sidebarItems.map(({ to, label, icon: Icon }) => {
              const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-forge-accent/15 text-forge-accent border border-forge-accent/30 shadow-sm'
                      : 'text-forge-muted hover:text-forge-text hover:bg-forge-elevated'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-forge-border flex flex-col gap-3">
            <InstallPwaPrompt />
            <div className="flex items-center justify-between text-[11px] text-forge-muted">
              <span>Haniforge v1.0.0</span>
              <span className="flex items-center gap-1 text-forge-accent">
                <Sparkles size={11} /> PWA Ready
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-8 min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
