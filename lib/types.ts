// Backend API type definitions matching the Express.js/MongoDB backend

export interface User {
  id: string
  _id?: string
  name: string
  email: string
  role: 'user' | 'admin'
  points: number
  correctPredictions: number
  totalPredictions: number
  createdAt?: string
}

export interface Match {
  _id: string
  homeTeam: string
  awayTeam: string
  group: string
  venue: string
  kickoffTime: string
  status: 'upcoming' | 'live' | 'completed'
  homeScore: number | null
  awayScore: number | null
  matchday: number
  timeState?: 'early' | 'open' | 'locked'
  createdAt?: string
}

export interface Prediction {
  _id: string
  user: string | User
  match: string | Match
  homeGoals: number
  awayGoals: number
  points: number
  submittedAt?: string
}

export interface LeaderboardEntry {
  _id?: string
  name: string
  points: number
  correctPredictions: number
  totalPredictions: number
}

export interface AdminStats {
  totalUsers: number
  totalMatches: number
  totalPredictions: number
  completedMatches: number
  evaluatedPredictions: number
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
    points: number
  }
}

export interface ApiError {
  message: string
}
