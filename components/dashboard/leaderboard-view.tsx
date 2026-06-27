"use client"

import { useCallback, useEffect, useState } from "react"
import { Crown, Loader2, Minus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { apiGetLeaderboard } from "@/lib/api"
import type { LeaderboardEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

function UserAvatar({ username, color, size = 'md', glow }: { username: string; color: string; size?: 'sm' | 'md' | 'lg'; glow?: boolean }) {
  const initials = username.substring(0, 2).toUpperCase()
  const sizes = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-11 text-sm' }
  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-black/85 ring-2 ring-white/10', sizes[size])}
      style={{ backgroundColor: color, boxShadow: glow ? `0 0 0 2px ${color}40, 0 0 18px ${color}55` : undefined }}
    >
      {initials}
    </div>
  )
}

function getColor(index: number): string {
  const colors = ['#34d399', '#f59e0b', '#60a5fa', '#f43f5e', '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9']
  return colors[index % colors.length]
}

export function LeaderboardView() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetch = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const data = await apiGetLeaderboard()
      setEntries(data)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  // Auto refresh every 30s
  useEffect(() => {
    const id = setInterval(() => fetch(), 30000)
    return () => clearInterval(id)
  }, [fetch])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const leader = entries[0]
  const maxPoints = leader?.points || 1

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Leaderboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length} players · Updated live every 30 seconds
          </p>
        </div>
        <button
          onClick={() => fetch(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-white/25 hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn('size-3.5', refreshing && 'animate-spin')} /> Refresh
        </button>
      </div>

      {/* leader spotlight */}
      {leader && (
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 shadow-[0_0_50px_-20px] shadow-gold/40">
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar username={leader.username} color={getColor(0)} size="lg" glow />
              <Crown className="absolute -right-1.5 -top-2.5 size-5 -rotate-12 fill-gold text-gold drop-shadow" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight">{leader.username}</span>
                {user?.username === leader.username && (
                  <span className="rounded border border-primary/40 bg-primary/10 px-1.5 text-[10px] font-bold uppercase text-primary">You</span>
                )}
                <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">League leader</span>
              </div>
              <p className="text-xs text-muted-foreground">{leader.correctPredictions} correct · {leader.totalPredictions} total</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-gold">{leader.points}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">points</p>
            </div>
          </div>
        </div>
      )}

      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="hidden grid-cols-[44px_1fr_70px_70px_84px] items-center gap-2 border-b border-border bg-secondary/30 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
          <span>#</span>
          <span>Player</span>
          <span className="text-center">Correct</span>
          <span className="text-center">Total</span>
          <span className="text-right">Points</span>
        </div>

        <ul>
          {entries.map((entry, i) => {
            const isLeader = i === 0
            const isYou = user?.username === entry.username
            const accuracy = entry.totalPredictions > 0 ? Math.round((entry.correctPredictions / entry.totalPredictions) * 100) : 0
            return (
              <li
                key={entry.username}
                className={cn(
                  'grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-border/70 px-4 py-3 transition last:border-0 sm:grid-cols-[44px_1fr_70px_70px_84px]',
                  isLeader && 'bg-gold/[0.04]',
                  isYou && 'bg-primary/[0.05]',
                  'hover:bg-secondary/30',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-lg text-sm font-bold tabular-nums',
                    i === 0 ? 'bg-gold/15 text-gold' : i === 1 ? 'bg-[#C0C0C0]/15 text-[#C0C0C0]' : i === 2 ? 'bg-[#CD7F32]/15 text-[#CD7F32]' : 'bg-secondary/60 text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>

                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar username={entry.username} color={getColor(i)} size="md" glow={isLeader} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{entry.username}</span>
                      {isYou && (
                        <span className="rounded border border-primary/40 bg-primary/10 px-1.5 text-[10px] font-bold uppercase text-primary">You</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground sm:hidden">
                      {entry.correctPredictions} correct · {accuracy}%
                    </p>
                  </div>
                </div>

                <span className="hidden text-center text-sm font-semibold tabular-nums text-primary sm:block">
                  {entry.correctPredictions}
                </span>
                <span className="hidden text-center text-sm font-semibold tabular-nums text-gold sm:block">
                  {entry.totalPredictions}
                </span>

                <div className="flex items-center justify-end gap-2 sm:block sm:text-right">
                  <span className="text-lg font-bold tabular-nums">{entry.points}</span>
                  <div className="hidden h-1 w-full overflow-hidden rounded-full bg-secondary/60 sm:mt-1 sm:block">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', isLeader ? 'bg-gold' : 'bg-primary')}
                      style={{ width: `${(entry.points / maxPoints) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
