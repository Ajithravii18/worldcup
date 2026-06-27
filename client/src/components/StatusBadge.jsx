import { getStatusTone } from "../utils/status";





export function StatusBadge({ status }) {
  const tone = getStatusTone(status);
  const className =
  tone === "live" ?
  "bg-red-50 text-app-danger ring-red-100" :
  tone === "success" ?
  "bg-emerald-50 text-app-success ring-emerald-100" :
  tone === "primary" ?
  "bg-blue-50 text-app-primary ring-blue-100" :
  "bg-slate-100 text-slate-500 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1 ${className}`}>
      
      {status}
    </span>);

}