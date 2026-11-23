import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error   = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info    = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  const typeStyles = {
    success: 'border-green-500/50 bg-green-500/10 text-green-300',
    error:   'border-red-500/50   bg-red-500/10   text-red-300',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
    info:    'border-blue-500/50  bg-blue-500/10  text-blue-300',
  };

  const icons = {
    success: '✓',
    error:   '✗',
    warning: '⚠',
    info:    'ℹ',
  };

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 max-w-xs w-full sm:max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm text-sm font-medium shadow-lg animate-fadeIn ${typeStyles[toast.type] || typeStyles.info}`}
          role="alert"
          aria-live="polite"
        >
          <span className="text-base flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 opacity-60 hover:opacity-100 flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
