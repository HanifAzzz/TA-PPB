import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { componentsApi } from '../services/api';
import { CATEGORIES, formatDots } from '../utils/helpers';
import { useBuilder } from '../hooks/useBuilder';
import { useToast } from '../hooks/useToast';
import ComponentCard from '../components/ComponentCard';
import { LoadingSpinner, EmptyState } from '../components/LoadingState';
import { Search, X, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export default function ComponentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectComponent } = useBuilder();
  const { success } = useToast();

  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // fromBuilder: when navigated from /builder, show "Pilih" button on cards
  const fromBuilder = searchParams.get('fromBuilder') === 'true';

  const fetchComponents = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category !== 'all') params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    componentsApi.getAll(params)
      .then(res => setComponents(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(fetchComponents, 350);
    return () => clearTimeout(timer);
  }, [fetchComponents]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleSelectForBuild = (component) => {
    selectComponent(component.category, component);
    success(`${component.name} ditambahkan ke rakitan!`);
    // Navigate back to builder after selecting
    navigate('/builder');
  };

  const hasFilters = search || category !== 'all' || minPrice || maxPrice;

  return (
    <div className="px-4 lg:px-10 pt-6 pb-10">
      {/* Header */}
      <div className="mb-6">
        {fromBuilder && (
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 text-forge-muted hover:text-forge-text text-sm font-medium mb-3 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke PC Builder
          </button>
        )}
        <h1 className="text-2xl font-bold text-forge-text">
          {fromBuilder ? 'Pilih Komponen untuk Rakitan' : 'Katalog Komponen'}
        </h1>
        <p className="text-forge-muted text-sm mt-1">
          {fromBuilder
            ? 'Klik tombol "Pilih" pada komponen yang ingin Anda tambahkan ke rakitan'
            : 'Temukan komponen PC terbaik dari database Haniforge'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama komponen atau merek..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-forge-surface border border-forge-border text-forge-text text-sm placeholder-forge-muted focus:outline-none focus:border-forge-accent/60 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-text">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilter || minPrice || maxPrice
              ? 'bg-forge-accent/10 border-forge-accent/40 text-forge-accent'
              : 'bg-forge-surface border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-accent/30'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filter Harga</span>
        </button>
      </div>

      {/* Price Filter */}
      {showFilter && (
        <div className="bg-forge-surface border border-forge-border rounded-xl p-4 mb-5 flex flex-wrap gap-4">
          <div className="flex-1 min-w-36">
            <label className="text-forge-muted text-xs mb-1.5 block">Harga Minimum (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatDots(minPrice)}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '');
                setMinPrice(raw);
              }}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60"
            />
          </div>
          <div className="flex-1 min-w-36">
            <label className="text-forge-muted text-xs mb-1.5 block">Harga Maksimum (Rp)</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatDots(maxPrice)}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '');
                setMaxPrice(raw);
              }}
              placeholder="Tanpa batas"
              className="w-full px-3 py-2 rounded-lg bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60"
            />
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none" style={{scrollbarWidth:'none'}}>
        <button
          onClick={() => setCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            category === 'all'
              ? 'bg-forge-accent/15 text-forge-accent border border-forge-accent/40'
              : 'bg-forge-surface border border-forge-border text-forge-muted hover:text-forge-text'
          }`}
        >
          Semua
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              category === cat.key
                ? 'bg-forge-accent/15 text-forge-accent border border-forge-accent/40'
                : 'bg-forge-surface border border-forge-border text-forge-muted hover:text-forge-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-forge-muted text-sm">
          Menampilkan <span className="text-forge-text font-medium">{components.length}</span> komponen
          {category !== 'all' && ` — ${CATEGORIES.find(c => c.key === category)?.label}`}
        </p>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-forge-muted text-xs hover:text-forge-accent flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Reset Filter
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner label="Memuat komponen..." />
      ) : components.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Tidak ada komponen ditemukan"
          description="Coba ubah kata kunci pencarian atau filter kategori Anda."
          action={
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-forge-accent/10 border border-forge-accent/40 text-forge-accent text-sm font-medium hover:bg-forge-accent hover:text-forge-bg transition-all"
            >
              Tampilkan Semua Komponen
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {components.map(comp => (
            <ComponentCard
              key={comp.id}
              component={comp}
              onSelect={fromBuilder ? handleSelectForBuild : undefined}
              fromCatalog={!fromBuilder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
