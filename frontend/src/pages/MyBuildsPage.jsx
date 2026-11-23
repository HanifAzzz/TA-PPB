import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildsApi } from '../services/api';
import { formatRupiah, getCompatibilityStyle } from '../utils/helpers';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner, EmptyState } from '../components/LoadingState';
import { Server, Plus, Eye, Trash2, Calendar, Package, ArrowRight } from 'lucide-react';

export default function MyBuildsPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchBuilds = () => {
    setLoading(true);
    buildsApi.getAll()
      .then(res => setBuilds(res.data.data || []))
      .catch(err => error('Gagal memuat daftar rakitan: ' + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBuilds(); }, []);

  const handleDelete = async (id) => {
    try {
      await buildsApi.delete(id);
      setBuilds(prev => prev.filter(b => b.id !== id));
      success('Rakitan berhasil dihapus.');
    } catch (err) {
      error('Gagal menghapus: ' + err.message);
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) return <div className="pt-10"><LoadingSpinner label="Memuat daftar rakitan..." /></div>;

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forge-text flex items-center gap-2">
            <Server size={24} className="text-forge-accent" />
            Build Saya
          </h1>
          <p className="text-forge-muted text-sm mt-1">Daftar rakitan PC yang telah Anda simpan</p>
        </div>
        <Link
          to="/builder"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-semibold text-sm hover:bg-forge-accent/90 transition-all shadow-glow-cyan"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Buat Rakitan</span>
        </Link>
      </div>

      {builds.length === 0 ? (
        <EmptyState
          icon="🛠️"
          title="Belum ada rakitan tersimpan"
          description="Mulai simulasi perakitan PC dan simpan hasilnya ke daftar Build Saya."
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
                    className="p-2 rounded-xl border border-forge-border text-forge-muted hover:text-red-400 hover:border-red-500/40 transition-all"
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
            <p className="text-forge-muted text-sm mb-5">Rakitan yang dihapus tidak dapat dikembalikan. Lanjutkan?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text text-sm transition-colors">
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
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
