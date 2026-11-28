import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Cpu, Server, ShieldCheck, Wallet, Wrench, Code, Database, Globe, Smartphone, CheckCircle, Download, Wifi, User, LogIn, LogOut } from 'lucide-react';

const APP_INFO = {
  name: 'Haniforge',
  version: '1.0.0',
  tagline: 'Build Your Dream PC, Within Your Budget.',
  description: 'Haniforge adalah aplikasi web Progressive Web App (PWA) untuk simulasi perakitan PC secara virtual. Pengguna dapat memilih komponen, menganalisis kompatibilitas, dan merencanakan rakitan sesuai anggaran.',
  purpose: 'Dikembangkan sebagai Tugas Akhir dengan judul: "Haniforge: Pengembangan Progressive Web App untuk Simulasi Perakitan PC dan Analisis Kompatibilitas Komponen Berdasarkan Anggaran".',
  techStack: [
    { label: 'Frontend', items: ['React.js (JavaScript ES6+)', 'Vite', 'Tailwind CSS', 'React Router DOM', 'Axios', 'Lucide React'], icon: Globe },
    { label: 'Backend', items: ['Node.js (JavaScript)', 'Express.js', 'REST API'], icon: Server },
    { label: 'Database', items: ['PostgreSQL (Neon)', 'node-postgres (pg)', 'Embedded Store Fallback'], icon: Database },
    { label: 'PWA', items: ['Web App Manifest', 'Service Worker (Cache Storage)', 'Offline Fallback', 'Installable Standalone'], icon: Smartphone },
  ],
  developer: {
    name: 'Hanif Arifandi Zulfikar',
    nim: '21120124140154',
    email: 'hanifarifandi@students.undip.ac.id',
    institution: 'Universitas Diponegoro',
    year: '2024',
  }
};

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [swStatus, setSwStatus] = useState('Memeriksa...');
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          setSwStatus('Aktif & Terdaftar');
        } else {
          setSwStatus('Siap / Dalam Pendaftaran');
        }
      });
    } else {
      setSwStatus('Tidak didukung browser');
    }

    // Check display mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Online status
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Install prompt listener
    const promptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', promptHandler);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', promptHandler);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('Aplikasi sudah terpasang atau browser Anda dapat menginstalnya melalui menu browser (ikon Install di address bar).');
    }
  };

  return (
    <div className="px-4 lg:px-10 pt-6 pb-12 max-w-2xl mx-auto">
      {/* User Account Status */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-forge-text font-semibold text-sm flex items-center gap-2">
            <User size={16} className="text-forge-accent" />
            Akun Pengguna
          </h3>
          {isAuthenticated ? (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-medium">
              ● Terhubung ke Database
            </span>
          ) : (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-medium">
              Mode Tamu
            </span>
          )}
        </div>

        {isAuthenticated && user ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-forge-elevated p-4 rounded-xl border border-forge-border/60">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0B0F17&color=38BDF8`}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border border-forge-accent/40 shadow-sm"
            />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-forge-text">{user.name}</h4>
              <p className="text-forge-muted text-xs">{user.email}</p>
              <p className="text-forge-accent text-[11px] font-medium mt-0.5">Role: {user.role || 'User'}</p>
            </div>
            <button
              onClick={() => {
                logout();
                success('Berhasil keluar dari akun.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div className="bg-forge-elevated p-4 rounded-xl border border-forge-border/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-forge-text text-sm font-semibold">Anda belum masuk</p>
              <p className="text-forge-muted text-xs mt-0.5">Masuk atau buat akun untuk menyimpan rakitan PC ke database.</p>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forge-accent text-forge-bg font-bold text-xs hover:bg-forge-accent/90 transition-all shadow-sm flex-shrink-0"
            >
              <LogIn size={14} />
              <span>Masuk / Daftar</span>
            </Link>
          </div>
        )}
      </div>

      {/* App Identity */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-8 mb-6 text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <p className="text-forge-muted text-sm italic mb-4">"{APP_INFO.tagline}"</p>
        <p className="text-forge-muted text-sm leading-relaxed mb-5">{APP_INFO.description}</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forge-accent/30 bg-forge-accent/10 text-forge-accent text-xs font-semibold">
          <Smartphone size={13} /> Progressive Web App (PWA) · Versi {APP_INFO.version}
        </div>
      </div>

      {/* PWA Status & Diagnostic Card */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-forge-text font-semibold text-sm flex items-center gap-2">
            <Smartphone size={16} className="text-forge-accent" />
            Status Progressive Web App (PWA)
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-forge-accent/15 text-forge-accent border border-forge-accent/30 font-medium">
            PWA Ready
          </span>
        </div>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-forge-border/60">
            <span className="text-forge-muted">Service Worker:</span>
            <span className="text-forge-success font-medium flex items-center gap-1">
              <CheckCircle size={13} /> {swStatus}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-forge-border/60">
            <span className="text-forge-muted">Web App Manifest:</span>
            <span className="text-forge-success font-medium flex items-center gap-1">
              <CheckCircle size={13} /> manifest.json (Valid)
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-forge-border/60">
            <span className="text-forge-muted">Tampilan Saat Ini:</span>
            <span className="text-forge-text font-medium">
              {isStandalone ? '📱 Standalone App (PWA Terpasang)' : '🌐 Web Browser Mode'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-forge-muted">Status Jaringan:</span>
            <span className={`font-medium flex items-center gap-1 ${isOnline ? 'text-forge-success' : 'text-forge-warning'}`}>
              <Wifi size={13} /> {isOnline ? 'Online' : 'Offline (Cache Mode)'}
            </span>
          </div>
        </div>

        {!isStandalone && (
          <button
            onClick={triggerInstall}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-forge-accent to-forge-primary text-forge-bg font-bold text-xs hover:opacity-95 transition-all shadow-glow-cyan"
          >
            <Download size={14} />
            Pasang Haniforge ke Perangkat (Install PWA)
          </button>
        )}
      </div>

      {/* Purpose */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-5">
        <h3 className="text-forge-text font-semibold text-sm mb-3 flex items-center gap-2">
          <Wrench size={16} className="text-forge-accent" />
          Tujuan Tugas Akhir
        </h3>
        <p className="text-forge-muted text-sm leading-relaxed">{APP_INFO.purpose}</p>
      </div>

      {/* Tech Stack */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-5">
        <h3 className="text-forge-text font-semibold text-sm mb-4 flex items-center gap-2">
          <Code size={16} className="text-forge-accent" />
          Teknologi yang Digunakan
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {APP_INFO.techStack.map(({ label, items, icon: Icon }) => (
            <div key={label} className="bg-forge-elevated rounded-xl p-3.5 border border-forge-border/60">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-forge-accent" />
                <p className="text-forge-text font-semibold text-xs">{label}</p>
              </div>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="text-forge-muted text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forge-accent/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Info */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-5">
        <h3 className="text-forge-text font-semibold text-sm mb-4 flex items-center gap-2">
          <Cpu size={16} className="text-forge-accent" />
          Informasi Pengembang
        </h3>
        <div className="space-y-3">
          {Object.entries({
            Nama: APP_INFO.developer.name,
            NIM: APP_INFO.developer.nim,
            Email: APP_INFO.developer.email,
            Institusi: APP_INFO.developer.institution,
            Tahun: APP_INFO.developer.year,
          }).map(([label, value]) => (
            <div key={label} className="flex justify-between items-start border-b border-forge-border pb-2 last:border-0 last:pb-0 text-xs">
              <span className="text-forge-muted">{label}</span>
              <span className="text-forge-text font-semibold text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-forge-warning/30 bg-forge-warning/5">
        <p className="text-forge-warning text-xs font-semibold mb-1">⚠️ Catatan Data Demo</p>
        <p className="text-forge-muted text-xs leading-relaxed">
          Seluruh data komponen pada Haniforge adalah katalog demo/contoh untuk demonstrasi aplikasi Tugas Akhir.
          Harga yang ditampilkan bukan merupakan harga pasar terkini dan tidak berasal dari web scraping atau API berbayar.
        </p>
      </div>
    </div>
  );
}
