// Backend API type definitions matching the Express.js/MongoDB backend

export interface User {
  id: string
  _id?: string
  username: string
  email: string
  role: 'user' | 'admin'
  points: number
  correctPredictions: number
  totalPredictions: number
  createdAt?: string
}

export interface Match {
  _id: string
  matchNumber: number
  homeTeam: string
  awayTeam: string
  group: string
  venue: string
  date: string
  stage: 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'third_place' | 'final'
  status: 'upcoming' | 'live' | 'completed'
  homeScore: number | null
  awayScore: number | null
  createdAt?: string
}

export interface Prediction {
  _id: string
  user: string | User
  match: string | Match
  homeScore: number
  awayScore: number
  points: number
  isEvaluated: boolean
  createdAt?: string
}

export interface LeaderboardEntry {
  _id?: string
  username: string
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
    username: string
    email: string
    role: 'user' | 'admin'
    points: number
  }
}

export interface ApiError {
  message: string
}
