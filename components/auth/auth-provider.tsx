"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { apiLogin, apiSendRegisterOtp, apiVerifyRegisterOtp, apiGetMe, getToken, setToken } from "@/lib/api"
import type { User } from "@/lib/types"

export type { User }

type AuthContextValue = {
  user: User | null
  ready: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  sendRegisterOtp: (name: string, email: string, password: string) => Promise<void>
  verifyRegisterOtp: (email: string, otp: string) => Promise<void>
  logout: () => void
}

const USER_KEY = "knockout.auth.user"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  const persistUser = useCallback((u: User | null) => {
    setUser(u)
    try {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
      else localStorage.removeItem(USER_KEY)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    async function init() {
      const token = getToken()
      if (token) {
        try {
          const me = await apiGetMe()
          persistUser(me)
        } catch {
          // token expired or invalid
          setToken(null)
          persistUser(null)
        }
      } else {
        // try loading cached user (offline fallback)
        try {
          const raw = localStorage.getItem(USER_KEY)
          if (raw) setUser(JSON.parse(raw) as User)
        } catch { /* ignore */ }
      }
      setReady(true)
    }
    init()
  }, [persistUser])

  async function login(email: string, password: string) {
    if (!email || !password) throw new Error("Enter your email and password.")
    const res = await apiLogin(email, password)
    setToken(res.token)
    const me = await apiGetMe()
    persistUser(me)
  }

  async function sendRegisterOtp(name: string, email: string, password: string) {
    if (!name || !email || !password) throw new Error("Fill in every field.")
    if (password.length < 6) throw new Error("Password must be at least 6 characters.")
    await apiSendRegisterOtp(name, email, password)
  }

  async function verifyRegisterOtpAndLogin(email: string, otp: string) {
    if (!email || !otp) throw new Error("Missing email or OTP.")
    const res = await apiVerifyRegisterOtp(email, otp)
    setToken(res.token)
    const me = await apiGetMe()
    persistUser(me)
  }

  function logout() {
    setToken(null)
    persistUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin, login, sendRegisterOtp, verifyRegisterOtp: verifyRegisterOtpAndLogin, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
