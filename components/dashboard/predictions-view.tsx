"use client"

import { useCallback, useEffect, useState } from "react"
import { CheckCircle2, Clock, Loader2, Target, XCircle } from "lucide-react"
import { apiGetMyPredictions } from "@/lib/api"
import type { Match, Prediction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getTeamData } from "@/lib/teams"
import { Flag } from "@/components/flag"

type FilterType = 'all' | 'evaluated' | 'pending'

export function PredictionsView() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetMyPredictions()
      setPredictions(data)
    } catch (err) {
      console.error('Failed to load predictions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = predictions.filter(p => {
    if (filter === 'evaluated') return p.isEvaluated
    if (filter === 'pending') return !p.isEvaluated
    return true
  })

  const totalPoints = predictions.reduce((sum, p) => sum + p.points, 0)
  const exactCount = predictions.filter(p => p.points === 3).length
  const correctCount = predictions.filter(p => p.points === 1).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Predictions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {predictions.length} predictions · {totalPoints} total points
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-primary/30 bg-primary/[0.06] p-4">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exact</span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{exactCount}</p>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Correct</span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-gold">{correctCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pending</span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums">{predictions.filter(p => !p.isEvaluated).length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1">
        {(['all', 'evaluated', 'pending'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[11px] font-semibold capitalize transition',
              filter === f
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:bg-secondary/40 border border-transparent'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Predictions list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-semibold text-muted-foreground">No predictions yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Go to Matches to start predicting!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(pred => {
            const match = typeof pred.match === 'object' ? pred.match as Match : null
            if (!match) return null

            const homeTeam = getTeamData(match.homeTeam)
            const awayTeam = getTeamData(match.awayTeam)

            return (
              <div
                key={pred._id}
                className={cn(
                  'relative overflow-hidden rounded-xl border bg-card/60 p-4 transition hover:border-white/20',
                  pred.isEvaluated
                    ? pred.points === 3 ? 'border-primary/30' : pred.points === 1 ? 'border-gold/30' : 'border-crimson/30'
                    : 'border-border'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Flag team={homeTeam} className="h-5 w-7" />
                      <span className="text-sm font-semibold truncate">{match.homeTeam}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <div className="flex items-center gap-2">
                      <Flag team={awayTeam} className="h-5 w-7" />
                      <span className="text-sm font-semibold truncate">{match.awayTeam}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Your prediction */}
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pick</p>
                      <p className="text-lg font-bold tabular-nums">{pred.homeScore} : {pred.awayScore}</p>
                    </div>

                    {/* Actual result */}
                    {match.status === 'completed' && match.homeScore !== null && (
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Result</p>
                        <p className="text-lg font-bold tabular-nums text-muted-foreground">{match.homeScore} : {match.awayScore}</p>
                      </div>
                    )}

                    {/* Points badge */}
                    {pred.isEvaluated ? (
                      <span className={cn(
                        'rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                        pred.points === 3 ? 'border-primary/40 bg-primary/10 text-primary' :
                        pred.points === 1 ? 'border-gold/40 bg-gold/10 text-gold' :
                        'border-crimson/40 bg-crimson/10 text-crimson'
                      )}>
                        {pred.points === 3 ? '🎯 Exact' : pred.points === 1 ? '✅ Correct' : '❌ Wrong'} +{pred.points}
                      </span>
                    ) : (
                      <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{match.group}</span>
                  <span>·</span>
                  <span>{match.venue}</span>
                  <span>·</span>
                  <span>{new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
