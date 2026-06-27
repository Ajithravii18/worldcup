"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarClock, MessageSquareText, Trophy, Globe, Goal, LogOut, Shield, ClipboardList } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { apiGetLeaderboard } from "@/lib/api"
import type { LeaderboardEntry } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MatchesView } from "@/components/dashboard/matches-view"
import { LeaderboardView } from "@/components/dashboard/leaderboard-view"
import { BanterView } from "@/components/dashboard/banter-view"
import { GlobalView } from "@/components/dashboard/global-view"
import { PredictionsView } from "@/components/dashboard/predictions-view"

type ViewId = "matches" | "leaderboard" | "predictions" | "banter" | "global"

const NAV: { id: ViewId; label: string; icon: typeof Goal }[] = [
  { id: "matches", label: "Matches", icon: CalendarClock },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "predictions", label: "My Picks", icon: ClipboardList },
  { id: "banter", label: "Banter Hub", icon: MessageSquareText },
  { id: "global", label: "Rules", icon: Globe },
]

function UserAvatar({ username, size = 'md' }: { username: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = username.substring(0, 2).toUpperCase()
  const sizes = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-11 text-sm' }
  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-black/85 ring-2 ring-white/10 bg-primary', sizes[size])}
    >
      {initials}
    </div>
  )
}

export function AppShell() {
  const [view, setView] = useState<ViewId>("matches")
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  const [rank, setRank] = useState<number | null>(null)
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    async function fetchRank() {
      try {
        const entries = await apiGetLeaderboard()
        const idx = entries.findIndex(e => e.username === user?.username)
        if (idx >= 0) {
          setRank(idx + 1)
          setPoints(entries[idx].points)
        }
      } catch { /* ignore */ }
    }
    if (user) fetchRank()
  }, [user])

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl">
        {/* desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-sidebar/60 px-4 py-5 backdrop-blur md:flex">
          <div className="flex items-center gap-2.5 px-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-6px] shadow-primary/60">
              <Goal className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold leading-tight tracking-tight">Knockout</p>
              <p className="text-[11px] text-muted-foreground">Prediction League</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-secondary/70 text-foreground shadow-[inset_0_0_0_1px] shadow-white/5"
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4.5", active && "text-primary")} />
                  {item.label}
                </button>
              )
            })}

            {isAdmin && (
              <>
                <div className="my-2 border-t border-border" />
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/10"
                >
                  <Shield className="size-4.5 text-gold" />
                  Admin Panel
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3">
            <UserAvatar username={user?.username || 'U'} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.username}</p>
              <p className="text-[11px] text-muted-foreground">
                {rank ? `Rank #${rank}` : 'Unranked'} · {points} pts
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          {/* top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Goal className="size-4.5" />
              </span>
              <span className="text-sm font-bold tracking-tight">Knockout</span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-sm font-medium text-muted-foreground">
                FIFA Club World Cup 2025
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="hidden md:flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold/20"
                >
                  <Shield className="size-3.5" /> Admin
                </button>
              )}
              <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5">
                <Trophy className="size-3.5 text-gold" />
                <span className="text-xs font-semibold text-gold">
                  #{rank || '–'} · {points} pts
                </span>
              </div>
              <UserAvatar username={user?.username || 'U'} size="md" />
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground md:hidden"
              >
                <LogOut className="size-4.5" />
              </button>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8">
            {view === "matches" && <MatchesView />}
            {view === "leaderboard" && <LeaderboardView />}
            {view === "predictions" && <PredictionsView />}
            {view === "banter" && <BanterView />}
            {view === "global" && <GlobalView />}
          </div>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition",
                    active && "bg-primary/12",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
