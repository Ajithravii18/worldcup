"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export function RegisterForm() {
  const { sendRegisterOtp, verifyRegisterOtp } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onStep1Submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await sendRegisterOtp(name, email, password)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  async function onStep2Submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await verifyRegisterOtp(email, otp)
      router.replace("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP.")
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Join the league</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {step === 1 ? "Create an account and start out-picking your mates." : `We sent a 6-digit code to ${email}`}
      </p>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={onStep1Submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className="h-11 w-full rounded-lg border border-input bg-secondary/40 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 w-full rounded-lg border border-input bg-secondary/40 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="h-11 w-full rounded-lg border border-input bg-secondary/40 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
            {!loading && <ArrowRight className="ml-2 size-4" />}
          </Button>
        </form>
      ) : (
        <form onSubmit={onStep2Submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
            <input
              id="otp"
              type="text"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="h-11 w-full rounded-lg border border-input bg-secondary/40 px-3.5 text-center text-lg font-bold tracking-[0.5em] outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              maxLength={6}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify & Create Account"}
          </Button>
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="w-full text-center text-xs text-muted-foreground hover:underline"
          >
            Change email address
          </button>
        </form>
      )}

      {step === 1 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already playing?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      )}
    </div>
  )
}
