import type { AuthResponse, Match, Prediction, LeaderboardEntry, AdminStats, User } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wcbackend-6iib.onrender.com/api'

// ── Token management ──
const TOKEN_KEY = 'knockout.auth.token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// ── Base fetch wrapper ──
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Something went wrong' }))
    throw new Error(body.message || `Request failed (${res.status})`)
  }

  return res.json()
}

// ── Auth ──
export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiSendRegisterOtp(name: string, email: string, password: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/register/send-otp', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function apiVerifyRegisterOtp(email: string, otp: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export async function apiGetMe(): Promise<User> {
  return apiFetch<User>('/auth/me')
}

// ── Matches ──
export async function apiGetMatches(): Promise<Match[]> {
  return apiFetch<Match[]>('/matches')
}

export async function apiGetMatch(id: string): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}`)
}

// ── Predictions ──
export async function apiSubmitPrediction(matchId: string, homeScore: number, awayScore: number): Promise<Prediction> {
  return apiFetch<Prediction>('/predictions', {
    method: 'POST',
    body: JSON.stringify({ matchId, homeScore, awayScore }),
  })
}

export async function apiGetMyPredictions(): Promise<Prediction[]> {
  return apiFetch<Prediction[]>('/predictions/my')
}

export async function apiGetMatchPredictions(matchId: string): Promise<Prediction[]> {
  return apiFetch<Prediction[]>(`/predictions/match/${matchId}`)
}

// ── Leaderboard ──
export async function apiGetLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiFetch<LeaderboardEntry[]>('/leaderboard')
}

// ── Admin ──
export async function apiCreateMatch(data: Partial<Match>): Promise<Match> {
  return apiFetch<Match>('/matches', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiUpdateMatch(id: string, data: Partial<Match>): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function apiUpdateMatchScore(id: string, homeScore: number, awayScore: number): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}/score`, {
    method: 'PUT',
    body: JSON.stringify({ homeScore, awayScore }),
  })
}

export async function apiDeleteMatch(id: string): Promise<void> {
  return apiFetch(`/matches/${id}`, { method: 'DELETE' })
}

export async function apiEvaluatePredictions(matchId: string): Promise<{ message: string; results: unknown[] }> {
  return apiFetch(`/admin/evaluate/${matchId}`, { method: 'PUT' })
}

export async function apiGetAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>('/admin/stats')
}
