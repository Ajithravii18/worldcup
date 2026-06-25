import { CloudOff } from "lucide-react";





export function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-100">
      <CloudOff size={18} className="shrink-0" />
      <p>
        Showing offline sample data. <span className="font-semibold">{message}</span>
      </p>
    </div>);

}