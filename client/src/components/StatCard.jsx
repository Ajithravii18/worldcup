






export function StatCard({ label, homeValue, awayValue, suffix = "" }) {
  const total = Math.max(homeValue + awayValue, 1);
  const homePercent = homeValue / total * 100;
  const awayPercent = awayValue / total * 100;

  return (
    <div className="rounded-app bg-white p-4 shadow-card ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-base font-black text-app-ink">
          {homeValue}
          {suffix}
        </span>
        <span className="text-sm font-extrabold text-app-muted">{label}</span>
        <span className="text-base font-black text-app-ink">
          {awayValue}
          {suffix}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="bg-app-primary" style={{ width: `${homePercent}%` }} />
        <div className="bg-app-success" style={{ width: `${awayPercent}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-wide text-slate-400">
        <span>Home</span>
        <span>{Math.round(awayPercent)}%</span>
      </div>
    </div>);

}