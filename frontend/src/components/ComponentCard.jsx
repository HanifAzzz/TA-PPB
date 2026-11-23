import { useNavigate } from 'react-router-dom';
import { formatRupiah, getCategoryInfo, truncate } from '../utils/helpers';
import { Plus, Eye } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function ComponentCard({ component, onSelect, fromCatalog = true }) {
  const navigate = useNavigate();
  const catInfo = getCategoryInfo(component?.category);

  if (!component) return null;

  const handleView = () => navigate(`/components/${component.id}`);

  const getSpecBadge = () => {
    const specs = component.specifications || {};
    if (component.category === 'cpu')         return specs.socket ? `Socket ${specs.socket}` : null;
    if (component.category === 'motherboard') return specs.ram_type ? specs.ram_type : null;
    if (component.category === 'ram')         return specs.capacity ? `${specs.capacity}GB ${specs.ram_type || ''}` : null;
    if (component.category === 'gpu')         return specs.vram || null;
    if (component.category === 'storage')     return specs.capacity || null;
    if (component.category === 'psu')         return specs.wattage ? `${specs.wattage}W` : null;
    if (component.category === 'casing')      return specs.form_factor || null;
    if (component.category === 'cooler')      return specs.cooler_type || null;
    return null;
  };

  const badge = getSpecBadge();

  const imgSrc = component.image_url ||
    `https://placehold.co/400x300/111827/38BDF8?text=${encodeURIComponent(component.category)}`;

  return (
    <div className="bg-forge-surface border border-forge-border rounded-2xl overflow-hidden hover:border-forge-accent/40 hover:shadow-glow-cyan transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div
        className="relative h-44 overflow-hidden cursor-pointer bg-forge-elevated flex items-center justify-center"
        onClick={handleView}
      >
        <img
          src={imgSrc}
          alt={component.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x300/111827/38BDF8?text=${encodeURIComponent(component.category)}`;
          }}
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-forge-bg/85 backdrop-blur-sm border border-forge-border ${catInfo.color}`}>
            <CategoryIcon category={component.category} size={11} />
            {catInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-forge-muted text-xs mb-0.5">{component.brand}</p>
          <h3
            className="font-semibold text-forge-text text-sm leading-tight mb-2 cursor-pointer hover:text-forge-accent transition-colors line-clamp-2"
            onClick={handleView}
            title={component.name}
          >
            {component.name}
          </h3>
          {badge && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-forge-elevated text-forge-muted border border-forge-border mb-2">
              {badge}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-forge-border mt-auto">
          <div className="mb-3">
            <span className="font-bold text-forge-accent text-base">{formatRupiah(component.price)}</span>
          </div>
          <div className="flex gap-2">
            {/* Detail button — always visible in catalog mode */}
            {fromCatalog && (
              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-accent/40 transition-all duration-200 text-xs font-medium"
              >
                <Eye size={13} />
                Detail
              </button>
            )}
            {/* Select button — shown when onSelect is provided (fromBuilder mode) */}
            {onSelect && (
              <button
                onClick={() => onSelect(component)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-forge-accent/10 border border-forge-accent/40 text-forge-accent hover:bg-forge-accent hover:text-forge-bg transition-all duration-200 text-xs font-semibold"
              >
                <Plus size={13} />
                Pilih
              </button>
            )}
            {/* Catalog mode without onSelect: just the detail button takes full width */}
            {!fromCatalog && !onSelect && (
              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-forge-border text-forge-muted hover:text-forge-text hover:border-forge-accent/40 transition-all duration-200 text-xs font-medium"
              >
                <Eye size={13} />
                Detail
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
