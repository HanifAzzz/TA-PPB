import { Link } from 'react-router-dom';
import { WifiOff, Home } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <WifiOff size={56} className="text-forge-muted mb-6" />
      <h1 className="text-2xl font-bold text-forge-text mb-2">Anda Sedang Offline</h1>
      <p className="text-forge-muted text-sm max-w-sm mb-8 leading-relaxed">
        Koneksi internet tidak tersedia. Beberapa fitur Haniforge memerlukan koneksi aktif untuk mengambil data dari server.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forge-accent text-forge-bg font-bold hover:bg-forge-accent/90 transition-all"
      >
        <Home size={18} />
        Coba Kembali ke Beranda
      </Link>
    </div>
  );
}
