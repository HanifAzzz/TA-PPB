// Format Rupiah currency
export function formatRupiah(amount) {
  if (!amount && amount !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

// Category display info
export const CATEGORIES = [
  { key: 'cpu',         label: 'Processor (CPU)',     icon: 'Cpu',         color: 'text-blue-400' },
  { key: 'motherboard', label: 'Motherboard',          icon: 'CircuitBoard', color: 'text-purple-400' },
  { key: 'ram',         label: 'RAM (Memory)',         icon: 'Layers',      color: 'text-green-400' },
  { key: 'gpu',         label: 'VGA / Kartu Grafis',  icon: 'Monitor',     color: 'text-pink-400' },
  { key: 'storage',     label: 'Storage (SSD/HDD)',   icon: 'HardDrive',   color: 'text-yellow-400' },
  { key: 'psu',         label: 'Power Supply (PSU)',  icon: 'Zap',         color: 'text-orange-400' },
  { key: 'casing',      label: 'Casing PC',           icon: 'Box',         color: 'text-teal-400' },
  { key: 'cooler',      label: 'CPU Cooler',          icon: 'Fan',         color: 'text-cyan-400' },
];

export function getCategoryInfo(key) {
  return CATEGORIES.find(c => c.key === key?.toLowerCase()) || {
    key, label: key, icon: 'Package', color: 'text-gray-400'
  };
}

// Compatibility status display
export function getCompatibilityStyle(status) {
  switch (status) {
    case 'compatible':
      return { text: 'Kompatibel', textColor: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
    case 'warning':
      return { text: 'Perlu Diperiksa', textColor: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    case 'incompatible':
      return { text: 'Tidak Kompatibel', textColor: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    default:
      return { text: 'Belum Dianalisis', textColor: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' };
  }
}

export function truncate(str, n = 80) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '...' : str;
}
