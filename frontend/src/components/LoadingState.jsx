export function LoadingSpinner({ size = 'md', label = 'Memuat data...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4">
      <div className={`${sizes[size] || sizes.md} border-4 border-forge-border border-t-forge-accent rounded-full animate-spin`} />
      {label && <p className="text-forge-muted text-sm">{label}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
      {icon && <div className="text-5xl mb-2">{icon}</div>}
      <h3 className="text-lg font-semibold text-forge-text">{title}</h3>
      {description && <p className="text-forge-muted text-sm max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
