import Image from "next/image"
import Link from "next/link"
import { Goal, Trophy, Target, MessageSquareText } from "lucide-react"
import type { ReactNode } from "react"

const highlights = [
  { icon: Target, text: "Call exact scorelines for every match" },
  { icon: Trophy, text: "Climb a live, points-based leaderboard" },
  { icon: MessageSquareText, text: "Roast your friends in the banter hub" },
]

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      {/* visual panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border p-10 lg:flex">
        <Image src="/hero-stadium.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/70 to-background" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-6px] shadow-primary/60">
            <Goal className="size-5" />
          </span>
          <span className="text-base font-bold tracking-tight">Knockout</span>
        </Link>

        <div className="relative max-w-sm">
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight">
            The prediction league for your group chat.
          </h2>
          <ul className="mt-6 space-y-3.5">
            {highlights.map((h) => {
              const Icon = h.icon
              return (
                <li key={h.text} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-card/70 text-primary backdrop-blur">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="text-sm text-muted-foreground">{h.text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">World Cup · Knockout Stage</p>
      </div>

      {/* form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Goal className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight">Knockout</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
