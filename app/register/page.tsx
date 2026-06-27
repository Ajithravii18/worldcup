"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  const { user, ready } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (ready && user) router.replace("/home")
  }, [ready, user, router])

  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  )
}
