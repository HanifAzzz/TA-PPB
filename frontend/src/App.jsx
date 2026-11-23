import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BuilderProvider } from './hooks/useBuilder';
import { ToastProvider } from './hooks/useToast';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import ComponentsPage from './pages/ComponentsPage';
import ComponentDetailPage from './pages/ComponentDetailPage';
import BuilderPage from './pages/BuilderPage';
import CompatibilityPage from './pages/CompatibilityPage';
import MyBuildsPage from './pages/MyBuildsPage';
import BuildDetailPage from './pages/BuildDetailPage';
import ProfilePage from './pages/ProfilePage';
import OfflinePage from './pages/OfflinePage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <BuilderProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/components/:id" element={<ComponentDetailPage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/compatibility" element={<CompatibilityPage />} />
              <Route path="/my-builds" element={<MyBuildsPage />} />
              <Route path="/my-builds/:id" element={<BuildDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                  <p className="text-6xl mb-4">🔧</p>
                  <h1 className="text-2xl font-bold text-forge-text mb-2">Halaman Tidak Ditemukan</h1>
                  <p className="text-forge-muted text-sm mb-6">URL yang Anda akses tidak tersedia.</p>
                  <a href="/" className="px-5 py-2.5 rounded-xl bg-forge-accent text-forge-bg font-semibold text-sm hover:bg-forge-accent/90 transition-all">Kembali ke Beranda</a>
                </div>
              } />
            </Routes>
          </AppLayout>
        </BuilderProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
