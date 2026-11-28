import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Cpu, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user, logout } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const redirectPath = location.state?.from || '/builder';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!formData.name.trim()) {
        error('Nama lengkap wajib diisi.');
        return;
      }
      if (!formData.email.trim()) {
        error('Alamat email wajib diisi.');
        return;
      }
      if (formData.password.length < 6) {
        error('Password minimal 6 karakter.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        error('Konfirmasi password tidak cocok.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await register(formData.name.trim(), formData.email.trim(), formData.password);
        success(res.message || 'Pendaftaran berhasil! Selamat datang di Haniforge.');
        navigate(redirectPath, { replace: true });
      } catch (err) {
        error(err.message || 'Gagal mendaftar. Silakan coba lagi.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Login
      if (!formData.email.trim() || !formData.password) {
        error('Email dan password wajib diisi.');
        return;
      }

      setSubmitting(true);
      try {
        const res = await login(formData.email.trim(), formData.password);
        success(res.message || 'Berhasil masuk ke akun Anda.');
        navigate(redirectPath, { replace: true });
      } catch (err) {
        error(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // If already logged in, show current session card
  if (isAuthenticated && user) {
    return (
      <div className="px-4 py-12 max-w-md mx-auto">
        <div className="bg-forge-surface border border-forge-border rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full mx-auto p-1 bg-gradient-to-tr from-forge-accent to-forge-primary">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0B0F17&color=38BDF8`}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-forge-accent font-semibold mb-1">
              <CheckCircle size={14} /> Sesi Aktif
            </div>
            <h2 className="text-xl font-bold text-forge-text">{user.name}</h2>
            <p className="text-forge-muted text-sm">{user.email}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/builder')}
              className="w-full py-2.5 rounded-xl bg-forge-accent text-forge-bg font-bold text-sm hover:bg-forge-accent/90 transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke PC Builder</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-2.5 rounded-xl border border-forge-border text-forge-text hover:bg-forge-elevated text-sm transition-all"
            >
              Lihat Profil Saya
            </button>
            <button
              onClick={() => {
                logout();
                success('Anda telah keluar dari akun.');
              }}
              className="w-full py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs transition-all mt-1"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:py-12 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-forge-accent/20 to-forge-primary/20 border border-forge-accent/40 mb-3 shadow-glow-cyan">
          <Cpu size={24} className="text-forge-accent" />
        </div>
        <h1 className="text-2xl font-bold text-forge-text tracking-tight">
          {mode === 'login' ? 'Masuk ke Haniforge' : 'Daftar Akun Baru'}
        </h1>
        <p className="text-forge-muted text-xs mt-1.5 max-w-xs mx-auto">
          {mode === 'login'
            ? 'Akses rakitan PC dan simpan riwayat simulasi langsung ke database PostgreSQL.'
            : 'Buat akun untuk menyimpan rakitan PC dan sinkronisasi ke cloud database.'}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-forge-surface border border-forge-border rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-forge-accent/10 rounded-full blur-2xl pointer-events-none" />

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-forge-elevated rounded-xl mb-6 border border-forge-border/60">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-forge-accent text-forge-bg shadow-sm'
                : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-forge-accent text-forge-bg shadow-sm'
                : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-forge-muted text-xs font-medium mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Hanif Arifandi"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-forge-muted text-xs font-medium mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-forge-muted text-xs font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-muted">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forge-muted hover:text-forge-text p-0.5"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-forge-muted text-xs font-medium mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-muted">
                  <ShieldCheck size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password di atas"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forge-elevated border border-forge-border text-forge-text text-sm focus:outline-none focus:border-forge-accent/60 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-forge-accent to-forge-primary text-forge-bg font-bold text-sm hover:opacity-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-forge-bg border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-forge-border/60 flex items-center justify-center gap-1.5 text-[11px] text-forge-muted">
          <Sparkles size={12} className="text-forge-accent" />
          <span>Tersimpan aman di database PostgreSQL Supabase</span>
        </div>
      </div>
    </div>
  );
}
