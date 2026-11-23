import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-forge-warning/20 border-b border-forge-warning/40 px-4 py-2 text-center text-xs font-medium text-forge-warning flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
      <WifiOff size={14} className="animate-bounce" />
      <span>
        Mode Offline Aktif: Anda sedang membuka Haniforge tanpa koneksi internet (PWA Offline Cache).
      </span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 underline hover:text-white flex items-center gap-1"
      >
        <RefreshCw size={11} /> Coba Sambung Ulang
      </button>
    </div>
  );
}
