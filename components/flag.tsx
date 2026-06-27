import type { Team } from "@/lib/data"
import { cn } from "@/lib/utils"

export function Flag({ team, className }: { team: Team; className?: string }) {
  const vertical = team.orientation === "vertical"
  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-md ring-1 ring-white/15 shadow-sm",
        vertical ? "flex-row" : "flex-col",
        className,
      )}
      role="img"
      aria-label={`${team.name} flag`}
    >
      {team.colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  )
}
