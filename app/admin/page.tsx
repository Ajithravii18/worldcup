"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  Loader2,
  Play,
  Shield,
  Trophy,
  Users,
  Calendar,
  Target,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  apiGetMatches,
  apiGetAdminStats,
  apiUpdateMatchScore,
  apiEvaluatePredictions,
} from "@/lib/api"
import type { AdminStats, Match } from "@/lib/types"
import { cn } from "@/lib/utils"

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number | string; color: string }) {
  return (
    <div className={cn('rounded-xl border p-5 transition hover:-translate-y-0.5', `border-${color}/30 bg-${color}/[0.06]`)}>
      <div className="flex items-center gap-2">
        <Icon className={cn('size-5', `text-${color}`)} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className={cn('mt-3 text-3xl font-bold tabular-nums', `text-${color}`)}>{value}</p>
    </div>
  )
}

export default function AdminPage() {
  const { user, ready, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [scoreInputs, setScoreInputs] = useState<Record<string, { home: string; away: string }>>({})
  const [evaluating, setEvaluating] = useState<string | null>(null)
  const [updatingScore, setUpdatingScore] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

  useEffect(() => {
    if (ready && (!user || !isAdmin)) {
      router.replace('/home')
    }
  }, [ready, user, isAdmin, router])

  const fetchData = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([apiGetAdminStats(), apiGetMatches()])
      setStats(s)
      setMatches(m)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (isAdmin) fetchData() }, [isAdmin, fetchData])

  async function handleUpdateScore(matchId: string) {
    const input = scoreInputs[matchId]
    if (!input) return
    const home = parseInt(input.home)
    const away = parseInt(input.away)
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      setMessage({ type: 'error', text: 'Enter valid scores' })
      return
    }
    setUpdatingScore(matchId)
    setMessage(null)
    try {
      await apiUpdateMatchScore(matchId, home, away)
      setMessage({ type: 'success', text: 'Score updated successfully!' })
      fetchData()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update score' })
    } finally {
      setUpdatingScore(null)
    }
  }

  async function handleEvaluate(matchId: string) {
    setEvaluating(matchId)
    setMessage(null)
    try {
      const result = await apiEvaluatePredictions(matchId)
      setMessage({ type: 'success', text: result.message || 'Predictions evaluated!' })
      fetchData()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to evaluate' })
    } finally {
      setEvaluating(null)
    }
  }

  const filteredMatches = matches.filter(m => {
    if (filter === 'upcoming') return m.status === 'upcoming'
    if (filter === 'completed') return m.status === 'completed'
    return true
  }).sort((a, b) => a.matchNumber - b.matchNumber)

  if (!ready || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-dvh bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/home')}
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition hover:text-foreground hover:border-white/20"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Shield className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage matches and evaluate predictions</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {message && (
          <div className={cn(
            'mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm',
            message.type === 'success' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-crimson/30 bg-crimson/10 text-crimson'
          )}>
            {message.type === 'success' ? <CheckCircle2 className="size-4" /> : <Target className="size-4" />}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto text-xs hover:underline">Dismiss</button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
            <div className="rounded-xl border border-primary/30 bg-primary/[0.06] p-5">
              <div className="flex items-center gap-2"><Users className="size-5 text-primary" /><span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Users</span></div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-primary">{stats.totalUsers}</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-gold/[0.06] p-5">
              <div className="flex items-center gap-2"><Calendar className="size-5 text-gold" /><span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Matches</span></div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-gold">{stats.totalMatches}</p>
            </div>
            <div className="rounded-xl border border-emerald/30 bg-emerald/[0.06] p-5">
              <div className="flex items-center gap-2"><BarChart3 className="size-5 text-emerald" /><span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Predictions</span></div>
              <p className="mt-3 text-3xl font-bold tabular-nums text-emerald">{stats.totalPredictions}</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-5">
              <div className="flex items-center gap-2"><Check className="size-5 text-muted-foreground" /><span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completed</span></div>
              <p className="mt-3 text-3xl font-bold tabular-nums">{stats.completedMatches}</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          {(['all', 'upcoming', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition',
                filter === f
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-muted-foreground hover:bg-secondary/40 border border-transparent'
              )}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filteredMatches.length} matches</span>
        </div>

        {/* Match Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
          <div className="hidden md:grid grid-cols-[60px_1fr_1fr_100px_120px_150px_120px] items-center gap-2 border-b border-border bg-secondary/30 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>#</span>
            <span>Home</span>
            <span>Away</span>
            <span>Group</span>
            <span>Status</span>
            <span>Set Score</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-border/70">
            {filteredMatches.map(match => (
              <div
                key={match._id}
                className="grid grid-cols-1 md:grid-cols-[60px_1fr_1fr_100px_120px_150px_120px] items-center gap-2 px-4 py-3 transition hover:bg-secondary/20"
              >
                <span className="text-sm font-bold tabular-nums text-muted-foreground">{match.matchNumber}</span>
                <span className="text-sm font-semibold">{match.homeTeam} {match.status === 'completed' && <span className="text-primary font-bold">({match.homeScore})</span>}</span>
                <span className="text-sm font-semibold">{match.awayTeam} {match.status === 'completed' && <span className="text-primary font-bold">({match.awayScore})</span>}</span>
                <span className="text-xs text-muted-foreground">{match.group}</span>
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase w-fit',
                  match.status === 'completed' ? 'border-primary/40 bg-primary/10 text-primary' :
                  match.status === 'live' ? 'border-crimson/40 bg-crimson/10 text-crimson' :
                  'border-border bg-secondary/40 text-muted-foreground'
                )}>
                  {match.status === 'completed' && <Check className="size-3" />}
                  {match.status === 'live' && <Play className="size-3" />}
                  {match.status}
                </span>

                {/* Score inputs */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="H"
                    value={scoreInputs[match._id]?.home ?? ''}
                    onChange={e => setScoreInputs(prev => ({
                      ...prev,
                      [match._id]: { ...prev[match._id], home: e.target.value, away: prev[match._id]?.away ?? '' }
                    }))}
                    className="h-8 w-12 rounded border border-border bg-secondary/40 px-2 text-center text-xs outline-none focus:border-primary/50"
                  />
                  <span className="text-xs text-muted-foreground">:</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="A"
                    value={scoreInputs[match._id]?.away ?? ''}
                    onChange={e => setScoreInputs(prev => ({
                      ...prev,
                      [match._id]: { home: prev[match._id]?.home ?? '', away: e.target.value }
                    }))}
                    className="h-8 w-12 rounded border border-border bg-secondary/40 px-2 text-center text-xs outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={() => handleUpdateScore(match._id)}
                    disabled={updatingScore === match._id}
                    className="flex h-8 items-center gap-1 rounded bg-primary px-2 text-[10px] font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                  >
                    {updatingScore === match._id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                  </button>
                </div>

                {/* Evaluate */}
                <div>
                  {match.status === 'completed' && (
                    <button
                      onClick={() => handleEvaluate(match._id)}
                      disabled={evaluating === match._id}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-gold/15 px-3 text-[10px] font-semibold text-gold transition hover:bg-gold/25 disabled:opacity-50"
                    >
                      {evaluating === match._id ? <Loader2 className="size-3 animate-spin" /> : <Trophy className="size-3" />}
                      Evaluate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
