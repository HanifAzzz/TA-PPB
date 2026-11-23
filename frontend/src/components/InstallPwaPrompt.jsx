import { useState, useEffect } from 'react';
import { Download, Check, Smartphone, X } from 'lucide-react';

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // If already installed, show subtle badge or nothing
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forge-success/10 border border-forge-success/30 text-forge-success text-xs font-medium">
        <Check size={13} />
        <span>PWA Aktif</span>
      </div>
    );
  }

  // If deferredPrompt is available and not dismissed, show prompt button/banner
  if (deferredPrompt && !dismissed) {
    return (
      <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-gradient-to-r from-forge-accent/20 to-forge-primary/20 border border-forge-accent/40 shadow-glow-cyan text-xs">
        <Smartphone size={16} className="text-forge-accent flex-shrink-0 animate-pulse" />
        <span className="text-forge-text font-medium hidden sm:inline">
          Pasang Haniforge di Perangkat Anda
        </span>
        <span className="text-forge-text font-medium sm:hidden">
          Pasang App
        </span>
        <button
          onClick={handleInstallClick}
          className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg bg-forge-accent text-forge-bg font-bold hover:bg-forge-accent/90 transition-all flex-shrink-0 shadow-sm"
        >
          <Download size={13} />
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-forge-muted hover:text-forge-text p-1"
          title="Tutup"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return null;
}
