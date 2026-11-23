import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import { formatRupiah, CATEGORIES } from '../utils/helpers';
import Logo from '../components/Logo';
import ComponentCard from '../components/ComponentCard';
import CategoryIcon from '../components/CategoryIcon';
import { LoadingSpinner } from '../components/LoadingState';
import { Wrench, Package, Server, ArrowRight, Sparkles, ShieldCheck, Wallet, Cpu } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-10 pb-16 lg:px-10 lg:pt-16">
        {/* BG Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forge-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-forge-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forge-accent/30 bg-forge-accent/10 text-forge-accent text-xs font-semibold mb-6">
            <Sparkles size={12} />
            Simulasi Perakitan PC Berbasis Web
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-forge-text leading-tight mb-4">
            Rakit PC Impian Anda,{' '}
            <span className="bg-gradient-to-r from-forge-accent to-forge-primary bg-clip-text text-transparent">
              Sesuai Anggaran.
            </span>
          </h1>
          <p className="text-forge-muted text-base lg:text-lg leading-relaxed mb-8 max-w-2xl">
            Haniforge membantu Anda memilih dan merakit komponen PC secara virtual,
            menganalisis kompatibilitas antar-komponen, dan menyesuaikan rakitan
            dengan anggaran Anda — tanpa perlu keahlian teknis mendalam.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forge-accent text-forge-bg font-bold text-sm hover:bg-forge-accent/90 transition-all shadow-glow-cyan"
            >
              <Wrench size={18} />
              Mulai Rakit PC
            </Link>
            <Link
              to="/components"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-accent/40 transition-all text-sm font-medium"
            >
              <Package size={18} />
              Lihat Komponen
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {!loading && stats && (
        <section className="px-4 lg:px-10 mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Komponen', value: stats.total_components, icon: Package, color: 'text-blue-400' },
              { label: 'Rakitan Tersimpan', value: stats.total_builds, icon: Server, color: 'text-purple-400' },
              { label: 'Kategori', value: stats.categories?.length || 8, icon: Cpu, color: 'text-green-400' },
              { label: 'Versi App', value: 'v1.0.0', icon: Sparkles, color: 'text-yellow-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-forge-surface border border-forge-border rounded-2xl p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-forge-elevated ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-forge-text font-bold text-xl">{value}</p>
                  <p className="text-forge-muted text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 lg:px-10 mb-12">
        <h2 className="text-xl font-bold text-forge-text mb-5">Mengapa Haniforge?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Wrench,
              title: 'Simulasi Perakitan',
              desc: 'Pilih dan rakit komponen PC secara virtual dari katalog yang lengkap.',
              color: 'text-forge-accent',
              bg: 'bg-forge-accent/10'
            },
            {
              icon: ShieldCheck,
              title: 'Analisis Kompatibilitas',
              desc: 'Cek kompatibilitas socket, RAM, form factor, dan kebutuhan daya secara otomatis.',
              color: 'text-green-400',
              bg: 'bg-green-500/10'
            },
            {
              icon: Wallet,
              title: 'Manajemen Anggaran',
              desc: 'Pantau total harga, sisa anggaran, dan dapatkan rekomendasi komponen alternatif.',
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10'
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-forge-surface border border-forge-border rounded-2xl p-5 hover:border-forge-accent/30 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="text-forge-text font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-forge-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section className="px-4 lg:px-10 mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-forge-text">Kategori Komponen</h2>
          <Link to="/components" className="text-forge-accent text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              to={`/components?category=${cat.key}`}
              className="bg-forge-surface border border-forge-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-forge-accent/40 hover:bg-forge-elevated transition-all group text-center"
            >
              <CategoryIcon category={cat.key} size={24} />
              <span className="text-forge-text text-xs font-medium leading-tight group-hover:text-forge-accent transition-colors">{cat.label}</span>
              {stats?.categories && (
                <span className="text-forge-muted text-[10px]">
                  {stats.categories.find(c => c.key === cat.key)?.count || 0} item
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Components */}
      {!loading && stats?.featured_components?.length > 0 && (
        <section className="px-4 lg:px-10 mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-forge-text">Komponen Pilihan</h2>
            <Link to="/components" className="text-forge-accent text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Semua Komponen <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.featured_components.slice(0, 4).map(comp => (
              <ComponentCard key={comp.id} component={comp} onSelect={null} />
            ))}
          </div>
        </section>
      )}

      {loading && <LoadingSpinner label="Memuat data dashboard..." />}

      {/* CTA Banner */}
      <section className="px-4 lg:px-10 mb-16">
        <div className="bg-gradient-to-r from-forge-primary/20 to-forge-accent/20 border border-forge-accent/20 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-forge-primary/5 to-forge-accent/5 pointer-events-none" />
          <Wrench size={36} className="text-forge-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forge-text mb-2">Siap Merakit PC Anda?</h2>
          <p className="text-forge-muted text-sm mb-6 max-w-md mx-auto">
            Mulai simulasi perakitan, periksa kompatibilitas, dan sesuaikan anggaran Anda sekarang.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-forge-accent text-forge-bg font-bold hover:bg-forge-accent/90 transition-all shadow-glow-cyan"
          >
            <Wrench size={18} />
            Mulai Rakit PC Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
