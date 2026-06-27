"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Eye, EyeOff, Lock, Loader2, Minus, Plus, Radio, Search } from "lucide-react"
import { Flag } from "@/components/flag"
import { useAuth } from "@/components/auth/auth-provider"
import { apiGetMatches, apiGetMyPredictions, apiSubmitPrediction } from "@/lib/api"
import type { Match, Prediction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getTeamData } from "@/lib/teams"

function ScoreStepper({
  value,
  onChange,
  disabled,
  accent,
}: {
  value: number
  onChange: (n: number) => void
  disabled?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label="Increase score"
        disabled={disabled}
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex size-7 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:opacity-30"
      >
        <Plus className="size-3.5" />
      </button>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl border text-2xl font-bold tabular-nums",
          disabled
            ? "border-border bg-card/40 text-muted-foreground"
            : accent
              ? "border-primary/40 bg-primary/10 text-foreground shadow-[0_0_18px_-6px] shadow-primary/40"
              : "border-border bg-secondary/40 text-foreground",
        )}
      >
        {value}
      </div>
      <button
        type="button"
        aria-label="Decrease score"
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex size-7 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:opacity-30"
      >
        <Minus className="size-3.5" />
      </button>
    </div>
  )
}

function TeamRow({ teamName }: { teamName: string }) {
  const team = getTeamData(teamName)
  return (
    <div className="flex items-center gap-2.5">
      <Flag team={team} className="h-6 w-9" />
      <span className="text-sm font-semibold tracking-tight">{teamName}</span>
    </div>
  )
}

function MatchCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 animate-pulse">
      <div className="px-4 pt-4 flex justify-between">
        <div className="h-3 w-32 rounded bg-secondary/60" />
        <div className="h-5 w-20 rounded-full bg-secondary/60" />
      </div>
      <div className="px-4 pt-3 pb-1"><div className="h-3 w-24 rounded bg-secondary/40" /></div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-6 w-36 rounded bg-secondary/40" />
          <div className="h-6 w-36 rounded bg-secondary/40" />
        </div>
        <div className="flex gap-2"><div className="h-20 w-12 rounded-xl bg-secondary/40" /><div className="h-20 w-12 rounded-xl bg-secondary/40" /></div>
      </div>
      <div className="border-t border-border bg-secondary/20 px-4 py-3 h-12" />
    </div>
  )
}

function MatchCard({
  match,
  onPredictionSubmitted,
}: {
  match: Match & { userPrediction?: { homeGoals: number, awayGoals: number, points?: number } }
  onPredictionSubmitted: () => void
}) {
  const isLocked = match.timeState === 'locked' || match.status !== 'upcoming'
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'
  const matchDate = new Date(match.date)
  const now = new Date()
  const msUntilKickoff = matchDate.getTime() - now.getTime()

  const [homeScore, setHomeScore] = useState(match.userPrediction?.homeGoals ?? 0)
  const [awayScore, setAwayScore] = useState(match.userPrediction?.awayGoals ?? 0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (match.userPrediction) {
      setHomeScore(match.userPrediction.homeGoals)
      setAwayScore(match.userPrediction.awayGoals)
    }
  }, [match.userPrediction])

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      await apiSubmitPrediction(match._id, homeScore, awayScore)
      onPredictionSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  function formatCountdown(ms: number): string {
    if (ms <= 0) return 'Started'
    const totalSec = Math.floor(ms / 1000)
    const d = Math.floor(totalSec / 86400)
    const h = Math.floor((totalSec % 86400) / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    if (d > 0) return `${d}d ${h}h`
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur transition duration-300 hover:border-white/20 hover:shadow-[0_8px_40px_-12px] hover:shadow-black/60">
      {/* top accent line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          isLive ? "bg-crimson/70" : isCompleted ? "bg-muted-foreground/30" : match.userPrediction ? "bg-gold/50" : "bg-primary/50",
        )}
      />

      <header className="flex items-center justify-between gap-2 px-4 pt-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {match.group} · Match {match.matchNumber}
        </span>
        {isCompleted ? (
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Check className="size-3" /> Full time
          </span>
        ) : isLive ? (
          <span className="flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-[11px] font-semibold text-crimson">
            <Radio className="size-3 animate-pulse" /> Live now
          </span>
        ) : match.userPrediction ? (
          <span className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold">
            <Lock className="size-3" /> Predicted
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" /> {formatCountdown(msUntilKickoff)}
          </span>
        )}
      </header>

      <div className="px-4 pb-1 pt-2">
        <p className="text-[11px] text-muted-foreground">{match.venue}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          {matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* prediction body */}
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-1 flex-col gap-3">
          <TeamRow teamName={match.homeTeam} />
          <TeamRow teamName={match.awayTeam} />
        </div>

        {isCompleted ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Result</span>
            <div className="flex items-center gap-2 text-3xl font-bold tabular-nums">
              <span>{match.homeScore}</span>
              <span className="text-muted-foreground">:</span>
              <span>{match.awayScore}</span>
            </div>
            {match.userPrediction && (
              <div className="mt-1">
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  (match.userPrediction.points ?? 0) === 3 ? "border-primary/40 bg-primary/10 text-primary" :
                  (match.userPrediction.points ?? 0) === 1 ? "border-gold/40 bg-gold/10 text-gold" :
                  "border-crimson/40 bg-crimson/10 text-crimson"
                )}>
                  {(match.userPrediction.points ?? 0) === 3 ? 'Exact' : (match.userPrediction.points ?? 0) === 1 ? 'Outcome' : 'Missed'} +{match.userPrediction.points ?? 0}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <ScoreStepper
              value={homeScore}
              accent={!isLocked}
              disabled={isLocked}
              onChange={setHomeScore}
            />
            <span className="pt-9 text-lg font-bold text-muted-foreground">:</span>
            <ScoreStepper
              value={awayScore}
              accent={!isLocked}
              disabled={isLocked}
              onChange={setAwayScore}
            />
          </div>
        )}
      </div>

      {/* show user's prediction under completed matches */}
      {isCompleted && match.userPrediction && (
        <div className="border-t border-border bg-secondary/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Your prediction</span>
            <span className="text-sm font-bold tabular-nums">{match.userPrediction.homeGoals} : {match.userPrediction.awayGoals}</span>
          </div>
        </div>
      )}

      {/* footer */}
      <footer className="mt-auto flex items-center justify-between gap-2 border-t border-border bg-secondary/20 px-4 py-3">
        {isUpcoming && !isLocked ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[0_0_22px_-6px] shadow-primary/60 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Lock className="size-3.5" />}
            {submitted ? 'Update pick' : 'Lock in pick'}
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="size-3.5" />
            {isCompleted ? 'Match completed' : submitted ? 'Pick locked in' : 'Predictions closed'}
          </span>
        )}
        {error && <span className="text-[11px] text-crimson">{error}</span>}
      </footer>
    </article>
  )
}

const GROUPS = ['All', 'Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H']
const STATUS_FILTERS = ['All', 'Upcoming', 'Completed'] as const

export function MatchesView() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [m, p] = await Promise.all([
        apiGetMatches(),
        user ? apiGetMyPredictions().catch(() => []) : Promise.resolve([]),
      ])
      setMatches(m)
      setPredictions(p)
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const predByMatchId = useMemo(() => {
    const map: Record<string, Prediction> = {}
    predictions.forEach(p => {
      const matchId = typeof p.match === 'string' ? p.match : p.match._id
      map[matchId] = p
    })
    return map
  }, [predictions])

  const filtered = useMemo(() => {
    let result = matches
    if (group !== 'All') result = result.filter(m => m.group === group)
    if (statusFilter === 'Upcoming') result = result.filter(m => m.status === 'upcoming')
    if (statusFilter === 'Completed') result = result.filter(m => m.status === 'completed')
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m => m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q))
    }
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [matches, group, statusFilter, search])

  const openCount = matches.filter(m => m.status === 'upcoming').length
  const predictedCount = predictions.length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Match Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {matches.length} matches · {predictedCount} predicted · {openCount} open
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {openCount} open to predict
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="h-9 w-44 rounded-lg border border-border bg-secondary/40 pl-9 pr-3 text-xs outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition",
                group === g
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-secondary/40 border border-transparent"
              )}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition",
                statusFilter === s
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "text-muted-foreground hover:bg-secondary/40 border border-transparent"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-semibold text-muted-foreground">No matches found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(m => (
            <MatchCard
              key={m._id}
              match={m}
              userPrediction={predByMatchId[m._id]}
              onPredictionSubmitted={fetchData}
            />
          ))}
        </div>
      )}
    </div>
  )
}
