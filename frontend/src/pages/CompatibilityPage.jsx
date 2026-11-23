import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../hooks/useBuilder';
import { useToast } from '../hooks/useToast';
import { compatibilityApi } from '../services/api';
import { formatRupiah, getCompatibilityStyle, CATEGORIES } from '../utils/helpers';
import { LoadingSpinner, EmptyState } from '../components/LoadingState';
import CategoryIcon from '../components/CategoryIcon';
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Info,
  Wrench, ArrowLeft, RefreshCw
} from 'lucide-react';

const StatusIcon = ({ status, size = 18 }) => {
  if (status === 'compatible')   return <CheckCircle2 size={size} className="text-green-400" />;
  if (status === 'warning')      return <AlertTriangle size={size} className="text-yellow-400" />;
  if (status === 'incompatible') return <XCircle size={size} className="text-red-400" />;
  return <Info size={size} className="text-forge-muted" />;
};

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const { selectedComponents, budget, totalPrice, isOverBudget, remainingBudget, selectedCount } = useBuilder();
  const { error } = useToast();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (selectedCount === 0) {
      error('Pilih minimal satu komponen pada PC Builder sebelum menganalisis.');
      return;
    }
    setLoading(true);
    try {
      const res = await compatibilityApi.check({
        components: selectedComponents,
        budget: budget || 0,
      });
      setResult(res.data.data);
    } catch (err) {
      error('Gagal memeriksa kompatibilitas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const overall = result?.compatibility;
  const budgetAnalysis = result?.budget_analysis;
  const overallStyle = overall ? getCompatibilityStyle(overall.status) : null;

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forge-text flex items-center gap-2">
          <ShieldCheck size={24} className="text-forge-accent" />
          Analisis Kompatibilitas
        </h1>
        <p className="text-forge-muted text-sm mt-1">
          Periksa apakah seluruh komponen rakitan Anda saling kompatibel
        </p>
      </div>

      {/* Selected components preview */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-5 mb-5">
        <h3 className="text-forge-text font-semibold text-sm mb-3">Komponen Rakitan Saat Ini</h3>
        {selectedCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-forge-muted text-sm">Belum ada komponen dipilih.</p>
            <button
              onClick={() => navigate('/builder')}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forge-accent/10 border border-forge-accent/40 text-forge-accent text-sm font-medium hover:bg-forge-accent hover:text-forge-bg transition-all"
            >
              <Wrench size={14} />
              Buka PC Builder
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {CATEGORIES.map(cat => {
              const comp = selectedComponents[cat.key];
              return (
                <div key={cat.key} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${comp ? 'bg-forge-elevated' : 'bg-forge-bg/50'}`}>
                  <CategoryIcon category={cat.key} size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-forge-muted text-xs">{cat.label}</p>
                    {comp ? (
                      <>
                        <p className="text-forge-text text-xs font-semibold truncate">{comp.name}</p>
                        <p className="text-forge-accent text-xs">{formatRupiah(comp.price)}</p>
                      </>
                    ) : (
                      <p className="text-forge-muted text-xs italic">Belum dipilih</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleCheck}
        disabled={loading || selectedCount === 0}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-forge-primary text-white font-bold text-sm mb-6 hover:bg-forge-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-indigo"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <RefreshCw size={18} />
        )}
        {loading ? 'Menganalisis...' : 'Jalankan Analisis Kompatibilitas'}
      </button>

      {loading && <LoadingSpinner label="Menganalisis kompatibilitas komponen..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5">
          {/* Overall Status */}
          <div className={`p-5 rounded-2xl border ${overallStyle.bg} ${overallStyle.border}`}>
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={overall.status} size={24} />
              <h2 className="text-lg font-bold" style={{ color: 'inherit' }}>
                <span className={overallStyle.textColor}>{overallStyle.text}</span>
              </h2>
            </div>
            <p className="text-forge-muted text-sm">
              {overall.status === 'compatible' && 'Semua komponen yang diperiksa saling kompatibel. Rakitan Anda siap dirakit!'}
              {overall.status === 'warning' && 'Beberapa komponen perlu diperiksa lebih lanjut. Pastikan detail spesifikasi sudah benar.'}
              {overall.status === 'incompatible' && 'Ditemukan ketidakcocokan komponen. Perbaiki item yang bertanda merah sebelum melanjutkan pembelian.'}
            </p>
          </div>

          {/* Budget analysis */}
          {budgetAnalysis && budgetAnalysis.budget > 0 && (
            <div className={`p-5 rounded-2xl border ${budgetAnalysis.is_over_budget ? 'bg-red-500/5 border-red-500/30' : 'bg-green-500/5 border-green-500/30'}`}>
              <h3 className="font-semibold text-forge-text text-sm mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className={budgetAnalysis.is_over_budget ? 'text-red-400' : 'text-green-400'} />
                Analisis Anggaran
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-forge-muted text-xs">Total Harga</p>
                  <p className="text-forge-text font-bold">{formatRupiah(budgetAnalysis.total_price)}</p>
                </div>
                <div>
                  <p className="text-forge-muted text-xs">Anggaran</p>
                  <p className="text-forge-text font-bold">{formatRupiah(budgetAnalysis.budget)}</p>
                </div>
                <div>
                  <p className="text-forge-muted text-xs">{budgetAnalysis.is_over_budget ? 'Kelebihan' : 'Sisa'}</p>
                  <p className={`font-bold ${budgetAnalysis.is_over_budget ? 'text-red-400' : 'text-green-400'}`}>
                    {formatRupiah(Math.abs(budgetAnalysis.remaining_budget))}
                  </p>
                </div>
                <div>
                  <p className="text-forge-muted text-xs">Penggunaan</p>
                  <p className="text-forge-text font-bold">{budgetAnalysis.percentage_used}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Per-rule checks */}
          <div>
            <h3 className="text-forge-text font-semibold text-sm mb-3">Detail Pemeriksaan ({overall.checks?.length || 0} aturan)</h3>
            <div className="space-y-3">
              {(overall.checks || []).map((check, i) => {
                const style = getCompatibilityStyle(check.status);
                return (
                  <div key={i} className={`p-4 rounded-xl border ${style.bg} ${style.border}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <StatusIcon status={check.status} size={18} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${style.textColor}`}>{check.title}</p>
                        <p className="text-forge-muted text-xs leading-relaxed mt-1">{check.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations if over budget */}
          {budgetAnalysis?.recommendations?.length > 0 && (
            <div>
              <h3 className="text-forge-text font-semibold text-sm mb-3">
                💡 Rekomendasi Penghematan Anggaran
              </h3>
              <div className="space-y-3">
                {budgetAnalysis.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="bg-forge-surface border border-forge-border rounded-xl p-4">
                    <p className="text-forge-muted text-xs mb-1">Ganti pada kategori: <strong className="text-forge-text">{rec.category}</strong></p>
                    <div className="flex items-start gap-3 mt-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-forge-muted text-xs mb-1 line-through">{rec.current.name} — {formatRupiah(rec.current.price)}</p>
                        <p className="text-forge-text text-xs font-semibold">{rec.alternative.name}</p>
                        <p className="text-forge-accent text-xs font-bold mt-0.5">{formatRupiah(rec.alternative.price)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-green-400 text-xs font-bold">Hemat {formatRupiah(rec.savings)}</p>
                        {rec.willBeUnderBudget && (
                          <span className="text-green-400 text-[10px]">✓ Dalam anggaran</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
