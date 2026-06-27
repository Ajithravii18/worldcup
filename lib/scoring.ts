import type { Prediction } from "@/lib/data"

export type Outcome = "exact" | "outcome" | "miss"

export function scorePrediction(pred: Prediction, result: Prediction): { outcome: Outcome; points: number } {
  if (pred.a === result.a && pred.b === result.b) return { outcome: "exact", points: 3 }
  const sign = (p: Prediction) => Math.sign(p.a - p.b)
  if (sign(pred) === sign(result)) return { outcome: "outcome", points: 1 }
  return { outcome: "miss", points: 0 }
}

export function formatCountdown(ms: number): { label: string; locked: boolean; live: boolean } {
  if (ms <= -90 * 60 * 1000) return { label: "Full time", locked: true, live: false }
  if (ms <= 0) return { label: "LIVE", locked: true, live: true }
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  if (h > 0) return { label: `${h}h ${pad(m)}m`, locked: false, live: false }
  return { label: `${pad(m)}:${pad(s)}`, locked: false, live: false }
}
