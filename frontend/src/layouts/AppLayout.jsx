import Logo from '../components/Logo';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import InstallPwaPrompt from '../components/InstallPwaPrompt';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Wrench, Server, User, Sparkles, LogIn } from 'lucide-react';

const sidebarItems = [
  { to: '/',           label: 'Home',       icon: Home },
  { to: '/components', label: 'Komponen',   icon: Layers },
  { to: '/builder',    label: 'Rakit PC',   icon: Wrench },
  { to: '/my-builds',  label: 'Build Saya', icon: Server },
  { to: '/profile',    label: 'Profil',     icon: User },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-forge-bg text-forge-text flex flex-col">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-forge-surface/90 backdrop-blur-md border-b border-forge-border px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <Link to="/profile" className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-forge-elevated border border-forge-border">
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0B0F17&color=38BDF8`}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold text-forge-text max-w-20 truncate">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forge-accent/15 border border-forge-accent/40 text-forge-accent text-xs font-semibold hover:bg-forge-accent/25 transition-all"
            >
              <LogIn size={13} />
              <span>Masuk</span>
            </Link>
          )}
          <InstallPwaPrompt />
        </div>
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
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-forge-elevated border border-forge-border/80 hover:border-forge-accent/40 transition-all"
              >
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0B0F17&color=38BDF8`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-forge-accent/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-forge-text truncate">{user.name}</p>
                  <p className="text-[10px] text-forge-muted truncate">{user.email}</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-forge-accent/15 border border-forge-accent/40 text-forge-accent text-xs font-semibold hover:bg-forge-accent/25 transition-all"
              >
                <LogIn size={14} />
                <span>Masuk / Daftar Akun</span>
              </Link>
            )}
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
