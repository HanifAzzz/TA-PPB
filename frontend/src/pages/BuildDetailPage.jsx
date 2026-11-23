import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buildsApi } from '../services/api';
import { formatRupiah, getCompatibilityStyle, getCategoryInfo } from '../utils/helpers';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingState';
import CategoryIcon from '../components/CategoryIcon';
import {
  ArrowLeft, Trash2, Pencil, ShieldCheck, AlertTriangle, XCircle,
  CheckCircle2, Calendar, Wallet, Package, TrendingDown, TrendingUp
} from 'lucide-react';

export default function BuildDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    buildsApi.getById(id)
      .then(res => setBuild(res.data.data))
      .catch(() => navigate('/my-builds'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await buildsApi.delete(id);
      success('Rakitan berhasil dihapus.');
      navigate('/my-builds');
    } catch (err) {
      error('Gagal menghapus: ' + err.message);
    }
  };

  if (loading) return <div className="pt-10"><LoadingSpinner /></div>;
  if (!build) return null;

  const compat = build.compatibility_analysis;
  const compatStyle = getCompatibilityStyle(build.compatibility_status);
  const isOverBudget = build.budget > 0 && build.total_price > build.budget;
  const remaining = build.budget > 0 ? build.budget - build.total_price : 0;

  const StatusIcon = ({ status, size = 16 }) => {
    if (status === 'compatible')   return <CheckCircle2 size={size} className="text-green-400 flex-shrink-0" />;
    if (status === 'warning')      return <AlertTriangle size={size} className="text-yellow-400 flex-shrink-0" />;
    if (status === 'incompatible') return <XCircle size={size} className="text-red-400 flex-shrink-0" />;
    return null;
  };

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate('/my-builds')}
        className="flex items-center gap-2 text-forge-muted hover:text-forge-text text-sm font-medium mb-5 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Build Saya
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-forge-text mb-2">{build.name}</h1>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${compatStyle.bg} ${compatStyle.border} ${compatStyle.textColor}`}>
            <StatusIcon status={build.compatibility_status} size={12} />
            {compatStyle.text}
          </div>
          <p className="text-forge-muted text-xs mt-2 flex items-center gap-1.5">
            <Calendar size={12} />
            Disimpan pada {new Date(build.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
          >
            <Trash2 size={15} />
            Hapus
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
          <p className="text-forge-muted text-xs mb-1 flex items-center gap-1.5"><Package size={12} /> Total Harga</p>
          <p className="text-forge-text font-bold text-lg">{formatRupiah(build.total_price)}</p>
        </div>
        {build.budget > 0 && (
          <>
            <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
              <p className="text-forge-muted text-xs mb-1 flex items-center gap-1.5"><Wallet size={12} /> Anggaran</p>
              <p className="text-forge-text font-bold text-lg">{formatRupiah(build.budget)}</p>
            </div>
            <div className={`border rounded-xl p-4 ${isOverBudget ? 'bg-red-500/5 border-red-500/30' : 'bg-green-500/5 border-green-500/30'}`}>
              <p className={`text-xs mb-1 flex items-center gap-1.5 ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                {isOverBudget ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isOverBudget ? 'Kelebihan' : 'Sisa Anggaran'}
              </p>
              <p className={`font-bold text-lg ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                {formatRupiah(Math.abs(remaining))}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Component List */}
      <div className="mb-6">
        <h2 className="text-forge-text font-semibold text-sm mb-3">Daftar Komponen ({build.items?.length || 0} item)</h2>
        <div className="bg-forge-surface border border-forge-border rounded-2xl overflow-hidden">
          {(build.items || []).map((item, i) => {
            const catInfo = getCategoryInfo(item.category);
            return (
              <div
                key={item.build_item_id || i}
                className={`flex items-center gap-4 px-5 py-4 ${i < (build.items?.length - 1) ? 'border-b border-forge-border' : ''}`}
              >
                <CategoryIcon category={item.category} size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-forge-muted text-xs mb-0.5">{catInfo.label}</p>
                  <p className="text-forge-text font-semibold text-sm truncate">{item.name || 'Komponen tidak ditemukan'}</p>
                  {item.brand && <p className="text-forge-muted text-xs">{item.brand}</p>}
                </div>
                <span className="text-forge-accent font-bold text-sm">{formatRupiah(item.price_at_selection)}</span>
              </div>
            );
          })}
          {(!build.items || build.items.length === 0) && (
            <p className="text-forge-muted text-sm text-center py-8">Tidak ada data komponen.</p>
          )}
        </div>
      </div>

      {/* Compatibility Analysis */}
      {compat && (
        <div>
          <h2 className="text-forge-text font-semibold text-sm mb-3">Analisis Kompatibilitas</h2>
          <div className="space-y-3">
            {(compat.checks || []).map((check, i) => {
              const style = getCompatibilityStyle(check.status);
              return (
                <div key={i} className={`p-4 rounded-xl border ${style.bg} ${style.border}`}>
                  <div className="flex items-start gap-3">
                    <StatusIcon status={check.status} size={16} />
                    <div>
                      <p className={`font-semibold text-sm ${style.textColor}`}>{check.title}</p>
                      <p className="text-forge-muted text-xs mt-1 leading-relaxed">{check.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!compat.checks || compat.checks.length === 0) && (
              <p className="text-forge-muted text-sm italic">Data analisis kompatibilitas belum tersedia untuk rakitan ini.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <Trash2 size={24} className="text-red-400 mb-3" />
            <h3 className="text-forge-text font-bold mb-2">Hapus "{build.name}"?</h3>
            <p className="text-forge-muted text-sm mb-5">Rakitan yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-forge-border text-forge-muted text-sm hover:text-forge-text transition-colors">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
