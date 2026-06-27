"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronDown, Lock, Trophy, Target, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { apiGetMyPredictions } from "@/lib/api"
import type { Prediction } from "@/lib/types"
import { cn } from "@/lib/utils"

const rules = [
  { points: 3, label: "Exact score", detail: "You predicted the precise final scoreline (e.g. 2-1 and it ends 2-1)." },
  { points: 1, label: "Correct outcome", detail: "You got the result right (win / draw / loss) but not the exact score." },
  { points: 0, label: "Wrong outcome", detail: "Wrong result entirely. The wall of shame is waiting." },
]

function RulesAccordion() {
  const [open, setOpen] = useState(true)
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left transition hover:bg-secondary/20"
        aria-expanded={open}
      >
        <div>
          <h2 className="text-sm font-semibold">How scoring works</h2>
          <p className="text-xs text-muted-foreground">The full points breakdown for every prediction.</p>
        </div>
        <ChevronDown className={cn("size-5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
            {rules.map((r) => (
              <div
                key={r.label}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/20 p-3"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums",
                    r.points === 3
                      ? "bg-primary/15 text-primary"
                      : r.points === 1
                        ? "bg-gold/15 text-gold"
                        : "bg-crimson/15 text-crimson",
                  )}
                >
                  +{r.points}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function GlobalView() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetMyPredictions()
      setPredictions(data)
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const totalPoints = predictions.reduce((sum, p) => sum + p.points, 0)
  const exactCount = predictions.filter(p => p.points === 3).length
  const correctCount = predictions.filter(p => p.points === 1).length
  const evaluatedCount = predictions.filter(p => p.isEvaluated).length
  const accuracy = evaluatedCount > 0 ? Math.round(((exactCount + correctCount) / evaluatedCount) * 100) : 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scoring & Stats</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your prediction performance and scoring rules.
        </p>
      </div>

      {/* Stats overview */}
      {!loading && predictions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card/60 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Points</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-primary">{totalPoints}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Predictions</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{predictions.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Accuracy</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gold">{accuracy}%</p>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exact Scores</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-primary">{exactCount}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      )}

      <RulesAccordion />
    </div>
  )
}
