




export function LoadingSkeleton({ className = "", rows = 1 }) {
  return (
    <div className={`space-y-3 ${className}`} aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) =>
      <div
        key={index}
        className="h-24 animate-pulse rounded-app bg-white shadow-card ring-1 ring-slate-100" />

      )}
    </div>);

}