"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Crown, Flame, Loader2, Send, Trophy, Target } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { apiGetLeaderboard } from "@/lib/api"
import type { LeaderboardEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

type ChatMessage = { id: string; sender: string; text: string; time: Date }

function UserAvatar({ username, color, size = 'sm' }: { username: string; color: string; size?: 'sm' | 'md' }) {
  const initials = username.substring(0, 2).toUpperCase()
  const sizes = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs' }
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-black/85 ring-2 ring-white/10', sizes[size])}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

function getColor(i: number): string {
  const c = ['#34d399', '#f59e0b', '#60a5fa', '#f43f5e', '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9']
  return c[i % c.length]
}

function WallOfFameShame({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length < 2) return null
  const top = entries[0]
  const second = entries[1]
  const bottom = entries[entries.length - 1]
  const cards = [
    { title: 'League Leader', entry: top, tone: 'fame' as const, icon: Crown },
    { title: 'Hot on their heels', entry: second, tone: 'fame' as const, icon: Flame },
    { title: 'Most Room to Grow', entry: bottom, tone: 'shame' as const, icon: Target },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Wall of Fame &amp; Shame
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {cards.map((c, i) => {
          const Icon = c.icon
          const fame = c.tone === 'fame'
          return (
            <div
              key={c.title}
              className={cn(
                'group relative overflow-hidden rounded-xl border p-4 transition hover:-translate-y-0.5',
                fame
                  ? 'border-primary/25 bg-primary/[0.06] hover:border-primary/45'
                  : 'border-crimson/25 bg-crimson/[0.06] hover:border-crimson/45',
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn('flex size-9 items-center justify-center rounded-lg', fame ? 'bg-primary/15 text-primary' : 'bg-crimson/15 text-crimson')}>
                  <Icon className="size-4.5" />
                </div>
                <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', fame ? 'border-primary/40 text-primary' : 'border-crimson/40 text-crimson')}>
                  {fame ? 'Fame' : 'Shame'}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold tracking-tight">{c.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <UserAvatar username={c.entry.username} color={getColor(i)} />
                <span className="text-xs font-medium">{c.entry.username}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{c.entry.points} pts · {c.entry.correctPredictions} correct</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChatPanel() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to the match chat! Share your thoughts.', time: new Date() },
  ])
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = draft.trim()
    if (!text || !user) return
    setMessages(m => [...m, { id: `c${Date.now()}`, sender: user.username, text, time: new Date() }])
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="flex items-center justify-between border-b border-border bg-secondary/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
          <h2 className="text-sm font-semibold">Match Chat</h2>
        </div>
        <span className="text-[11px] text-muted-foreground">{messages.length} messages</span>
      </div>

      <div ref={scrollRef} className="thin-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map(m => {
          const mine = m.sender === user?.username
          return (
            <div key={m.id} className={cn('flex items-end gap-2', mine && 'flex-row-reverse')}>
              <UserAvatar username={m.sender} color={mine ? '#34d399' : '#60a5fa'} />
              <div className={cn('max-w-[78%]', mine && 'items-end text-right')}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">{mine ? 'You' : m.sender}</span>
                </div>
                <div
                  className={cn(
                    'mt-1 inline-block rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    mine ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-secondary/70 text-foreground',
                  )}
                >
                  {m.text}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-secondary/20 p-3">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Drop your trash talk…"
          className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50"
        />
        <button
          type="button"
          onClick={send}
          aria-label="Send message"
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function BanterView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetLeaderboard()
      setEntries(data)
    } catch { /* ignore */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">The Banter Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Celebrate the geniuses, roast the disasters, and never let a bad pick go unmentioned.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.05fr]">
          <WallOfFameShame entries={entries} />
          <ChatPanel />
        </div>
      )}
    </div>
  )
}
