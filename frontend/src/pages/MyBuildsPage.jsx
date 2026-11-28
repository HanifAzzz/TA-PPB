import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildsApi } from '../services/api';
import { formatRupiah, getCompatibilityStyle } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner, EmptyState } from '../components/LoadingState';
import { Server, Plus, Eye, Trash2, Calendar, Package, ArrowRight, Lock, LogIn, UserPlus, CheckCircle } from 'lucide-react';

export default function MyBuildsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchBuilds = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    buildsApi.getAll()
      .then(res => setBuilds(res.data.data || []))
      .catch(err => {
        if (err.message && err.message.includes('401')) {
          // Token unauthorized
        } else {
          error('Gagal memuat daftar rakitan: ' + err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBuilds();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await buildsApi.delete(id);
      setBuilds(prev => prev.filter(b => b.id !== id));
      success('Rakitan berhasil dihapus dari database.');
    } catch (err) {
      error('Gagal menghapus: ' + err.message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // 1. Loading auth state
  if (authLoading) {
    return <div className="pt-10"><LoadingSpinner label="Memeriksa sesi akun..." /></div>;
  }

  // 2. Protected Route: If not authenticated, show Access Gate
  if (!isAuthenticated) {
    return (
      <div className="px-4 lg:px-10 pt-10 pb-16 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-forge-accent/20 to-forge-primary/20 border border-forge-accent/40 mx-auto flex items-center justify-center mb-4 shadow-glow-cyan">
          <Lock size={28} className="text-forge-accent" />
        </div>
        <h1 className="text-2xl font-bold text-forge-text mb-2">Build Saya Khusus Pengguna Terdaftar</h1>
        <p className="text-forge-muted text-sm leading-relaxed mb-6">
          Daftar rakitan PC disimpan secara aman di akun Anda dan disinkronkan ke database PostgreSQL Supabase. Silakan masuk atau buat akun baru untuk mengakses menu ini.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/login"
            state={{ from: '/my-builds' }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-bold text-sm hover:bg-forge-accent/90 transition-all shadow-glow-cyan"
          >
            <LogIn size={16} />
            <span>Masuk ke Akun</span>
          </Link>
          <Link
            to="/register"
            state={{ from: '/my-builds' }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-forge-border text-forge-text hover:bg-forge-elevated font-semibold text-sm transition-all"
          >
            <UserPlus size={16} />
            <span>Daftar Akun Baru</span>
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-forge-surface border border-forge-border/60 text-xs text-forge-muted flex items-center justify-center gap-2">
          <span>Belum ingin masuk?</span>
          <Link to="/builder" className="text-forge-accent font-semibold hover:underline flex items-center gap-1">
            Simulasi Rakit PC Dulu <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Loading builds
  if (loading) return <div className="pt-10"><LoadingSpinner label="Memuat daftar rakitan Anda..." /></div>;

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-forge-text flex items-center gap-2">
              <Server size={24} className="text-forge-accent" />
              Build Saya
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-forge-accent/15 text-forge-accent border border-forge-accent/30 font-medium hidden sm:inline-flex items-center gap-1">
              <CheckCircle size={11} /> {user?.name}
            </span>
          </div>
          <p className="text-forge-muted text-sm mt-1">Daftar rakitan PC tersimpan milik akun Anda</p>
        </div>
        <Link
          to="/builder"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-semibold text-sm hover:bg-forge-accent/90 transition-all shadow-glow-cyan self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Buat Rakitan Baru</span>
        </Link>
      </div>

      {builds.length === 0 ? (
        <EmptyState
          icon="🛠️"
          title="Belum ada rakitan tersimpan di akun Anda"
          description="Mulai simulasi perakitan PC dan simpan hasilnya ke database akun Anda."
          action={
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-semibold text-sm hover:bg-forge-accent/90 transition-all"
            >
              <Plus size={16} />
              Buat Rakitan Pertama
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map(build => {
            const style = getCompatibilityStyle(build.compatibility_status);
            return (
              <div key={build.id} className="bg-forge-surface border border-forge-border rounded-2xl p-5 hover:border-forge-accent/30 transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-forge-text font-bold text-sm leading-tight mb-1">{build.name}</h3>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${style.bg} ${style.border} ${style.textColor}`}>
                      {style.text}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-forge-muted">Total Harga</span>
                    <span className="text-forge-text font-semibold">{formatRupiah(build.total_price)}</span>
                  </div>
                  {build.budget > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-forge-muted">Anggaran</span>
                      <span className="text-forge-text font-semibold">{formatRupiah(build.budget)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-forge-muted flex items-center gap-1"><Package size={11} /> Komponen</span>
                    <span className="text-forge-text font-semibold">{build.item_count || build.items?.length || 0} item</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-forge-muted flex items-center gap-1"><Calendar size={11} /> Dibuat</span>
                    <span className="text-forge-muted">
                      {new Date(build.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-forge-border">
                  <Link
                    to={`/my-builds/${build.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-forge-accent/40 text-forge-accent text-xs font-semibold hover:bg-forge-accent hover:text-forge-bg transition-all"
                  >
                    <Eye size={13} />
                    Detail
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(build.id)}
                    className="p-2 rounded-xl border border-forge-border text-forge-muted hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer"
                    title="Hapus rakitan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <Trash2 size={22} className="text-red-400" />
              <h3 className="text-forge-text font-bold">Hapus Rakitan?</h3>
            </div>
            <p className="text-forge-muted text-sm mb-5">Rakitan yang dihapus dari database akun Anda tidak dapat dikembalikan. Lanjutkan?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text text-sm transition-colors cursor-pointer">
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
