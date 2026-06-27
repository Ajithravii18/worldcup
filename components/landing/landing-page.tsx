import Image from "next/image"
import Link from "next/link"
import {
  Goal,
  Trophy,
  CalendarClock,
  MessageSquareText,
  Globe,
  Target,
  ArrowRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: CalendarClock,
    title: "Predict every match",
    body: "Call the exact scoreline for each fixture. Picks auto-lock 30 minutes before kickoff so nobody can cheat.",
  },
  {
    icon: Trophy,
    title: "Live leaderboard",
    body: "3 points for an exact score, 1 for the right result. Climb the table and watch the rank arrows move.",
  },
  {
    icon: MessageSquareText,
    title: "Banter hub",
    body: "A wall of fame and shame plus a live match-day chat. Talk your trash, back it up on the pitch.",
  },
  {
    icon: Globe,
    title: "Global picks",
    body: "Lock in your champion, golden boot and dark horse before the tournament kicks off.",
  },
]

const scoring = [
  { points: "+3", label: "Exact score", tone: "text-emerald", ring: "border-emerald/30 bg-emerald/10" },
  { points: "+1", label: "Correct outcome", tone: "text-gold", ring: "border-gold/30 bg-gold/10" },
  { points: "+0", label: "Wrong result", tone: "text-crimson", ring: "border-crimson/30 bg-crimson/10" },
]

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_-6px] shadow-primary/60">
              <Goal className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight">Knockout</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button render={<Link href="/login" />} variant="ghost" size="sm">
              Log in
            </Button>
            <Button render={<Link href="/register" />} size="sm">
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-stadium.png"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
              World Cup · Knockout Stage is live
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Predict the scores. <span className="text-primary">Out-pick your mates.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Knockout is the prediction league for your group chat. Call every scoreline, climb the
              leaderboard, and settle who really knows football.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button render={<Link href="/register" />} size="lg" className="w-full sm:w-auto">
                Create your league
                <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/login" />}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                I already have an account
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free to play · No credit card · Just bragging rights</p>
          </div>
        </div>
      </section>

      {/* features bento */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything your group chat was missing
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            One dashboard for picks, points, and pure unfiltered banter.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/30 hover:bg-card"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary/12">
                  <Icon className="size-5.5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* scoring */}
      <section className="relative overflow-hidden border-y border-border bg-card/30">
        <div className="absolute inset-0 opacity-20">
          <Image src="/pitch-lines.png" alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Target className="size-4" /> Simple scoring
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Get the score spot on, get rewarded
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                No complicated math. Nail the exact scoreline for the big points, or grab a consolation
                point for calling the right winner.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["Picks lock automatically at kickoff", "Friends' guesses revealed once locked", "Trends update after every match"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <Check className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              {scoring.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
                >
                  <span className="text-base font-medium">{s.label}</span>
                  <span
                    className={`flex h-10 min-w-14 items-center justify-center rounded-xl border px-3 text-lg font-bold tabular-nums ${s.ring} ${s.tone}`}
                  >
                    {s.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center md:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to prove you know ball?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
              Set up your league in seconds and invite the group. The next kickoff is closer than you think.
            </p>
            <Button render={<Link href="/register" />} size="lg" className="mt-7">
              Start predicting
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Goal className="size-4" />
            </span>
            <span className="text-sm font-semibold">Knockout</span>
          </div>
          <p className="text-xs text-muted-foreground">Built for the group chat. Play responsibly, talk freely.</p>
        </div>
      </footer>
    </div>
  )
}
