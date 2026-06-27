import type { Friend } from "@/lib/data"
import { cn } from "@/lib/utils"

const sizes = {
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
}

export function Avatar({
  friend,
  size = "md",
  glow,
  className,
}: {
  friend: Friend
  size?: keyof typeof sizes
  glow?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-black/85 ring-2 ring-white/10",
        sizes[size],
        className,
      )}
      style={{
        backgroundColor: friend.color,
        boxShadow: glow ? `0 0 0 2px ${friend.color}40, 0 0 18px ${friend.color}55` : undefined,
      }}
      aria-hidden
    >
      {friend.initials}
    </div>
  )
}
