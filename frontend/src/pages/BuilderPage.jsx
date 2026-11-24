import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuilder } from '../hooks/useBuilder';
import { useToast } from '../hooks/useToast';
import { compatibilityApi, buildsApi } from '../services/api';
import { formatRupiah, formatDots, CATEGORIES, getCategoryInfo } from '../utils/helpers';
import CategoryIcon from '../components/CategoryIcon';
import { LoadingSpinner } from '../components/LoadingState';
import {
  Wrench, Trash2, Plus, ArrowRight, ShieldCheck, AlertTriangle, XCircle,
  Save, RotateCcw, Package, Wallet, TrendingDown, TrendingUp
} from 'lucide-react';

export default function BuilderPage() {
  const navigate = useNavigate();
  const {
    selectedComponents, budget, totalPrice, remainingBudget,
    isOverBudget, percentageUsed, selectedCount,
    removeComponent, updateBudget, clearBuild
  } = useBuilder();
  const { success, error, info } = useToast();

  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [compatResult, setCompatResult] = useState(null);
  const [checkingCompat, setCheckingCompat] = useState(false);

  const handleSave = async () => {
    if (!saveName.trim()) {
      error('Nama rakitan tidak boleh kosong!');
      return;
    }
    if (selectedCount === 0) {
      error('Pilih minimal satu komponen sebelum menyimpan.');
      return;
    }

    setIsSaving(true);
    try {
      const items = Object.entries(selectedComponents)
        .filter(([, comp]) => comp !== null)
        .map(([cat, comp]) => ({
          component_id: comp.id,
          category: cat,
          price_at_selection: comp.price
        }));

      let compatStatus = 'compatible';
      if (compatResult) {
        compatStatus = compatResult.compatibility?.status || 'compatible';
      }

      await buildsApi.create({
        name: saveName.trim(),
        budget: budget || 0,
        total_price: totalPrice,
        compatibility_status: compatStatus,
        items
      });

      success(`Rakitan "${saveName}" berhasil disimpan!`);
      setShowSaveModal(false);
      setSaveName('');
    } catch (err) {
      error('Gagal menyimpan rakitan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckCompat = async () => {
    if (selectedCount === 0) {
      info('Pilih minimal satu komponen terlebih dahulu.');
      return;
    }
    setCheckingCompat(true);
    try {
      const res = await compatibilityApi.check({
        components: selectedComponents,
        budget: budget || 0
      });
      setCompatResult(res.data.data);
    } catch (err) {
      error('Gagal memeriksa kompatibilitas: ' + err.message);
    } finally {
      setCheckingCompat(false);
    }
  };

  const budgetBarColor = isOverBudget
    ? 'bg-red-500'
    : percentageUsed > 85
    ? 'bg-yellow-500'
    : 'bg-forge-accent';

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forge-text flex items-center gap-2">
          <Wrench size={24} className="text-forge-accent" />
          Simulasi Rakit PC
        </h1>
        <p className="text-forge-muted text-sm mt-1">Pilih komponen untuk setiap kategori dan pantau anggaran Anda</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Component Slots */}
        <div className="lg:col-span-2 space-y-3">
          {CATEGORIES.map(cat => {
            const comp = selectedComponents[cat.key];
            return (
              <div
                key={cat.key}
                className={`bg-forge-surface border rounded-2xl p-4 transition-all duration-200 ${
                  comp ? 'border-forge-accent/30' : 'border-forge-border hover:border-forge-border/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon + Category */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-forge-elevated flex items-center justify-center">
                      <CategoryIcon category={cat.key} size={20} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-forge-muted text-xs font-medium mb-0.5">{cat.label}</p>
                    {comp ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <p className="text-forge-text font-semibold text-sm truncate" title={comp.name}>{comp.name}</p>
                          <p className="text-forge-accent text-sm font-bold">{formatRupiah(comp.price)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-forge-muted text-sm italic">Belum dipilih</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {comp && (
                      <button
                        onClick={() => removeComponent(cat.key)}
                        className="p-2 rounded-lg text-forge-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Hapus komponen"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <Link
                      to={`/components?category=${cat.key}&fromBuilder=true`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap
                        border-forge-accent/40 text-forge-accent hover:bg-forge-accent hover:text-forge-bg"
                    >
                      <Plus size={14} />
                      {comp ? 'Ganti' : 'Pilih'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Budget & Summary Panel */}
        <div className="space-y-4">
          {/* Budget Input */}
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-5">
            <label className="text-forge-text text-sm font-semibold mb-3 flex items-center gap-2 block">
              <Wallet size={16} className="text-forge-accent" />
              Anggaran Rakitan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-muted text-sm font-semibold">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={formatDots(budget)}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '');
                  updateBudget(raw ? parseInt(raw, 10) : 0);
                }}
                placeholder="10.000.000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-5">
            <h3 className="text-forge-text font-semibold text-sm mb-4 flex items-center gap-2">
              <Package size={16} className="text-forge-accent" />
              Ringkasan Rakitan
            </h3>

            <div className="space-y-2 mb-4">
              {CATEGORIES.map(cat => {
                const comp = selectedComponents[cat.key];
                if (!comp) return null;
                return (
                  <div key={cat.key} className="flex justify-between items-center text-xs">
                    <span className="text-forge-muted truncate max-w-[55%]">{cat.label}</span>
                    <span className="text-forge-text font-semibold">{formatRupiah(comp.price)}</span>
                  </div>
                );
              })}
              {selectedCount === 0 && (
                <p className="text-forge-muted text-xs text-center py-3">Belum ada komponen dipilih</p>
              )}
            </div>

            {selectedCount > 0 && (
              <>
                <div className="border-t border-forge-border pt-3 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-forge-muted text-sm">Total Harga</span>
                    <span className="text-forge-text font-bold text-base">{formatRupiah(totalPrice)}</span>
                  </div>
                  {budget > 0 && (
                    <div className={`flex justify-between items-center mt-1 ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                      <span className="text-xs flex items-center gap-1">
                        {isOverBudget ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isOverBudget ? 'Melebihi anggaran' : 'Sisa anggaran'}
                      </span>
                      <span className="font-semibold text-sm">{formatRupiah(Math.abs(remainingBudget))}</span>
                    </div>
                  )}
                </div>

                {/* Budget progress bar */}
                {budget > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-forge-muted mb-1.5">
                      <span>{percentageUsed}% dari anggaran</span>
                      <span>{formatRupiah(budget)}</span>
                    </div>
                    <div className="w-full h-2 bg-forge-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${budgetBarColor}`}
                        style={{ width: `${Math.min(100, percentageUsed)}%` }}
                      />
                    </div>
                    {isOverBudget && (
                      <div className="mt-2 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-xs leading-relaxed">
                          Anggaran terlampaui sebesar <strong>{formatRupiah(Math.abs(remainingBudget))}</strong>.
                          Pertimbangkan mengganti komponen yang lebih terjangkau.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckCompat}
                disabled={checkingCompat || selectedCount === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forge-primary/15 border border-forge-primary/40 text-forge-primary text-sm font-semibold hover:bg-forge-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {checkingCompat ? (
                  <span className="w-4 h-4 border-2 border-forge-primary/40 border-t-forge-primary rounded-full animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                Cek Kompatibilitas
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                disabled={selectedCount === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forge-accent text-forge-bg text-sm font-semibold hover:bg-forge-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save size={16} />
                Simpan Rakitan
              </button>

              {selectedCount > 0 && (
                <button
                  onClick={clearBuild}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-forge-border text-forge-muted hover:text-red-400 hover:border-red-500/40 text-sm transition-all"
                >
                  <RotateCcw size={14} />
                  Reset Rakitan
                </button>
              )}
            </div>
          </div>

          {/* Quick nav to compatibility page */}
          {compatResult && (
            <div className="bg-forge-surface border border-forge-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {compatResult.compatibility?.status === 'compatible' && <ShieldCheck size={16} className="text-green-400" />}
                {compatResult.compatibility?.status === 'warning' && <AlertTriangle size={16} className="text-yellow-400" />}
                {compatResult.compatibility?.status === 'incompatible' && <XCircle size={16} className="text-red-400" />}
                <span className="text-forge-text text-sm font-semibold">
                  {compatResult.compatibility?.status === 'compatible' && 'Kompatibel'}
                  {compatResult.compatibility?.status === 'warning' && 'Perlu Diperiksa'}
                  {compatResult.compatibility?.status === 'incompatible' && 'Ada Masalah Kompatibilitas'}
                </span>
              </div>
              <p className="text-forge-muted text-xs mb-3">
                {compatResult.compatibility?.checks?.length || 0} aturan diperiksa
              </p>
              <Link
                to="/compatibility"
                className="text-forge-accent text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Lihat Analisis Lengkap <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="bg-forge-surface border border-forge-border rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-forge-text font-bold text-lg mb-4">Simpan Rakitan PC</h3>
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Nama rakitan, misal: Gaming PC 2024"
              className="w-full px-4 py-3 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 mb-4"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <div className="text-forge-muted text-xs mb-5 space-y-1">
              <p>Total harga: <span className="text-forge-text font-semibold">{formatRupiah(totalPrice)}</span></p>
              {budget > 0 && <p>Anggaran: <span className="text-forge-text font-semibold">{formatRupiah(budget)}</span></p>}
              <p>Komponen: <span className="text-forge-text font-semibold">{selectedCount} item</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text text-sm transition-colors">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !saveName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forge-accent/90 transition-all"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
