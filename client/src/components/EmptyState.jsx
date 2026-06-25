import { SearchX } from "lucide-react";






export function EmptyState({ title, description }) {
  return (
    <div className="rounded-app bg-white px-5 py-8 text-center shadow-card ring-1 ring-slate-100">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-app-primary">
        <SearchX size={21} />
      </div>
      <h3 className="text-base font-extrabold text-app-ink">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-app-muted">{description}</p>
    </div>);

}