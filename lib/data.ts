export type Friend = {
  id: string
  name: string
  handle: string
  initials: string
  /** tailwind-ish accent for avatar ring/bg via inline style */
  color: string
}

export type Team = {
  name: string
  code: string
  /** flag stripe colors, top-to-bottom or left-to-right */
  colors: string[]
  /** "horizontal" | "vertical" */
  orientation?: "horizontal" | "vertical"
}

export type Prediction = { a: number; b: number }

export type Match = {
  id: string
  stage: string
  teamA: Team
  teamB: Team
  /** minutes from "now" (mount time). negative = already played */
  kickoffOffsetMin: number
  venue: string
  /** actual score, only present for finished matches */
  result?: Prediction
  /** friendId -> prediction */
  predictions: Record<string, Prediction>
}

export const LOCK_WINDOW_MIN = 30

export const friends: Friend[] = [
  { id: "you", name: "You", handle: "@you", initials: "YO", color: "#34d399" },
  { id: "marco", name: "Marco", handle: "@marco_g", initials: "MA", color: "#f59e0b" },
  { id: "leo", name: "Leo", handle: "@leothegoat", initials: "LE", color: "#60a5fa" },
  { id: "sam", name: "Sam", handle: "@samspurs", initials: "SA", color: "#f43f5e" },
  { id: "nina", name: "Nina", handle: "@nina11", initials: "NI", color: "#a78bfa" },
]

// Leaderboard stats (precomputed for the league so far)
export type Standing = {
  friendId: string
  exactScores: number
  correctOutcomes: number
  totalPoints: number
  /** rank change vs previous matchday: +up / -down / 0 */
  trend: number
}

export const standings: Standing[] = [
  { friendId: "leo", exactScores: 6, correctOutcomes: 9, totalPoints: 27, trend: 1 },
  { friendId: "you", exactScores: 5, correctOutcomes: 10, totalPoints: 25, trend: 2 },
  { friendId: "marco", exactScores: 4, correctOutcomes: 11, totalPoints: 23, trend: -2 },
  { friendId: "nina", exactScores: 3, correctOutcomes: 8, totalPoints: 17, trend: 0 },
  { friendId: "sam", exactScores: 1, correctOutcomes: 6, totalPoints: 9, trend: -1 },
]

const T = {
  brazil: { name: "Brazil", code: "BRA", colors: ["#009b3a", "#ffcc29", "#002776"] },
  france: { name: "France", code: "FRA", colors: ["#0055a4", "#ffffff", "#ef4135"], orientation: "vertical" as const },
  argentina: { name: "Argentina", code: "ARG", colors: ["#75aadb", "#ffffff", "#75aadb"] },
  spain: { name: "Spain", code: "ESP", colors: ["#aa151b", "#f1bf00", "#aa151b"] },
  england: { name: "England", code: "ENG", colors: ["#ffffff", "#cf142b"] },
  portugal: { name: "Portugal", code: "POR", colors: ["#006600", "#ff0000"], orientation: "vertical" as const },
  germany: { name: "Germany", code: "GER", colors: ["#000000", "#dd0000", "#ffce00"] },
  netherlands: { name: "Netherlands", code: "NED", colors: ["#ae1c28", "#ffffff", "#21468b"] },
}

export const matches: Match[] = [
  {
    id: "m1",
    stage: "Quarter-final · Match 49",
    teamA: T.brazil,
    teamB: T.france,
    kickoffOffsetMin: 14, // locked (within 30 min)
    venue: "Estadio Azteca",
    predictions: {
      you: { a: 2, b: 1 },
      marco: { a: 1, b: 1 },
      leo: { a: 0, b: 2 },
      sam: { a: 3, b: 2 },
      nina: { a: 1, b: 0 },
    },
  },
  {
    id: "m2",
    stage: "Quarter-final · Match 50",
    teamA: T.argentina,
    teamB: T.spain,
    kickoffOffsetMin: 58, // open
    venue: "MetLife Stadium",
    predictions: {
      you: { a: 2, b: 2 },
      marco: { a: 1, b: 0 },
      leo: { a: 2, b: 1 },
      sam: { a: 0, b: 1 },
      nina: { a: 3, b: 1 },
    },
  },
  {
    id: "m3",
    stage: "Quarter-final · Match 51",
    teamA: T.england,
    teamB: T.portugal,
    kickoffOffsetMin: 182, // open
    venue: "SoFi Stadium",
    predictions: {
      you: { a: 1, b: 1 },
      marco: { a: 2, b: 1 },
      leo: { a: 1, b: 2 },
      sam: { a: 1, b: 0 },
      nina: { a: 0, b: 0 },
    },
  },
  {
    id: "m4",
    stage: "Round of 16 · Match 48",
    teamA: T.germany,
    teamB: T.netherlands,
    kickoffOffsetMin: -120, // finished
    venue: "AT&T Stadium",
    result: { a: 2, b: 1 },
    predictions: {
      you: { a: 2, b: 1 },
      marco: { a: 1, b: 1 },
      leo: { a: 2, b: 0 },
      sam: { a: 0, b: 2 },
      nina: { a: 2, b: 1 },
    },
  },
]

export type BanterCard = {
  id: string
  title: string
  friendId: string
  stat: string
  tone: "shame" | "fame"
  icon: "clown" | "fire" | "dice" | "skull" | "crown"
}

export const banterCards: BanterCard[] = [
  { id: "b1", title: "Most Wrong Predictions", friendId: "sam", stat: "7 misses this week", tone: "shame", icon: "clown" },
  { id: "b2", title: "Hot Streak", friendId: "you", stat: "4 exact scores in a row", tone: "fame", icon: "fire" },
  { id: "b3", title: "Biggest Risk Taker", friendId: "nina", stat: "Avg 3.4 goals predicted", tone: "fame", icon: "dice" },
  { id: "b4", title: "Cold as Ice", friendId: "marco", stat: "0 exacts last matchday", tone: "shame", icon: "skull" },
]

export type ChatMessage = {
  id: string
  friendId: string
  text: string
  /** minutes ago */
  ago: number
}

export const chatSeed: ChatMessage[] = [
  { id: "c1", friendId: "marco", text: "Brazil 2-1, lock it in. France has no midfield.", ago: 42 },
  { id: "c2", friendId: "leo", text: "Bold of you to bet against Mbappé 😤 I've got France 2-0", ago: 38 },
  { id: "c3", friendId: "nina", text: "you're all overthinking it. 1-0 grind game.", ago: 31 },
  { id: "c4", friendId: "sam", text: "3-2 thriller incoming. screenshot this.", ago: 24 },
  { id: "c5", friendId: "you", text: "Sam predicting 3-2 again like it's his personality", ago: 19 },
  { id: "c6", friendId: "leo", text: "lmao Sam is the wall of shame mascot at this point", ago: 12 },
  { id: "c7", friendId: "marco", text: "14 min to lock. last calls 👀", ago: 3 },
]

export type GlobalPick = {
  id: string
  label: string
  value: string
  locked: boolean
}

export const globalPicks: GlobalPick[] = [
  { id: "g1", label: "Tournament Champion", value: "Argentina", locked: true },
  { id: "g2", label: "Runner-up", value: "France", locked: true },
  { id: "g3", label: "Golden Boot", value: "Kylian Mbappé", locked: true },
  { id: "g4", label: "Golden Glove", value: "Emiliano Martínez", locked: true },
  { id: "g5", label: "Dark Horse", value: "Morocco", locked: true },
  { id: "g6", label: "Top Scorer (group)", value: "Harry Kane", locked: true },
]

export const rules: { points: number; label: string; detail: string }[] = [
  { points: 3, label: "Exact score", detail: "You predicted the precise final scoreline (e.g. 2-1 and it ends 2-1)." },
  { points: 1, label: "Correct outcome", detail: "You got the result right (win / draw / loss) but not the exact score." },
  { points: 0, label: "Wrong outcome", detail: "Wrong result entirely. The wall of shame is waiting." },
]
