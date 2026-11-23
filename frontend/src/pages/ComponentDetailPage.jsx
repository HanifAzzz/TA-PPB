import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { componentsApi } from '../services/api';
import { formatRupiah, getCategoryInfo } from '../utils/helpers';
import { useBuilder } from '../hooks/useBuilder';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingState';
import CategoryIcon from '../components/CategoryIcon';
import { ArrowLeft, Plus, Check, Cpu, HardDrive, Zap, Layers } from 'lucide-react';

export default function ComponentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectComponent, selectedComponents } = useBuilder();
  const { success, info } = useToast();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    componentsApi.getById(id)
      .then(res => setComponent(res.data.data))
      .catch(() => navigate('/components'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-10"><LoadingSpinner /></div>;
  if (!component) return null;

  const catInfo = getCategoryInfo(component.category);
  const isSelected = selectedComponents[component.category]?.id === component.id;

  const handleAddToBuild = () => {
    selectComponent(component.category, component);
    if (isSelected) {
      info(`${component.name} sudah ada di rakitan Anda.`);
    } else {
      success(`${component.name} berhasil ditambahkan ke rakitan!`);
    }
  };

  const specs = component.specifications || {};
  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && v !== '');

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-forge-muted hover:text-forge-text text-sm font-medium mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Katalog
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-forge-surface border border-forge-border rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
          <img
            src={component.image_url || `https://placehold.co/600x600/111827/38BDF8?text=${encodeURIComponent(component.name.slice(0, 10))}`}
            alt={component.name}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.src = `https://placehold.co/600x600/111827/38BDF8?text=${encodeURIComponent(component.category)}`;
            }}
          />
        </div>

        {/* Detail */}
        <div>
          {/* Category badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forge-elevated border border-forge-border ${catInfo.color} mb-4`}>
            <CategoryIcon category={component.category} size={12} />
            {catInfo.label}
          </span>

          <h1 className="text-2xl font-bold text-forge-text leading-tight mb-1">{component.name}</h1>
          <p className="text-forge-muted text-sm mb-4">{component.brand}</p>

          {component.description && (
            <p className="text-forge-muted text-sm leading-relaxed mb-5 pb-5 border-b border-forge-border">
              {component.description}
            </p>
          )}

          <div className="mb-6">
            <span className="text-3xl font-black text-forge-accent">{formatRupiah(component.price)}</span>
            <p className="text-forge-muted text-xs mt-1">* Harga katalog demo, bukan harga pasar terkini</p>
          </div>

          {/* Add to build */}
          <button
            onClick={handleAddToBuild}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all mb-3 ${
              isSelected
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-forge-accent text-forge-bg hover:bg-forge-accent/90 shadow-glow-cyan'
            }`}
          >
            {isSelected ? (
              <><Check size={18} /> Sudah di Rakitan Anda</>
            ) : (
              <><Plus size={18} /> Tambahkan ke Rakitan</>
            )}
          </button>

          <button
            onClick={() => navigate('/builder')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-accent/40 text-sm font-medium transition-all"
          >
            Lihat PC Builder
          </button>
        </div>
      </div>

      {/* Specifications */}
      {specEntries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-forge-text mb-4">Spesifikasi Teknis</h2>
          <div className="bg-forge-surface border border-forge-border rounded-2xl overflow-hidden">
            {specEntries.map(([key, val], i) => {
              const label = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
              const value = Array.isArray(val) ? val.join(', ') : String(val);
              return (
                <div
                  key={key}
                  className={`flex items-start justify-between px-5 py-3.5 ${
                    i < specEntries.length - 1 ? 'border-b border-forge-border' : ''
                  } ${i % 2 === 0 ? 'bg-forge-surface' : 'bg-forge-elevated/30'}`}
                >
                  <span className="text-forge-muted text-sm font-medium">{label}</span>
                  <span className="text-forge-text text-sm font-semibold text-right max-w-[55%]">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
