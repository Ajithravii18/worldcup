"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const { user, ready } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (ready && user) router.replace("/home")
  }, [ready, user, router])

  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}
