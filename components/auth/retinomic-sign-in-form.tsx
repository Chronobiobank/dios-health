'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { mapSignInError } from '@/lib/auth/errors'
import { isSafeRelativePath } from '@/lib/auth/post-sign-in-redirect'
import { resolvePatientAuthDestination } from '@/lib/auth/resolve-patient-destination'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { getPatientRetinomicTier } from '@/lib/auth/retinomic-access'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgb(255_255_255/0.12)] bg-[#0f0f0f] px-4 py-3 text-sm text-[#fafaf7] placeholder:text-[rgb(250_250_247/0.35)] focus:border-photic-core/50 focus:outline-none focus:ring-1 focus:ring-photic-core/30'

export function RetinomicSignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(mapSignInError(authError))
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Wrong email or password.')
      setLoading(false)
      return
    }

    const nextParam = searchParams.get('next')
    let destination = await resolvePatientAuthDestination(supabase, authData.user.id)

    const tier = await getPatientRetinomicTier(supabase, authData.user.id)
    if (tier === 'PREMIUM_VERIFICATION') {
      destination = PATIENT_ROUTES.dashboard
    }

    if (nextParam && isSafeRelativePath(nextParam)) {
      if (!nextParam.startsWith('/signup') && nextParam !== '/pending-verification') {
        destination = nextParam
      }
    }

    router.refresh()
    router.push(destination)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[rgb(255_255_255/0.1)] bg-[#0f0f0f] p-8"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-medium text-[rgb(250_250_247/0.55)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={INPUT_CLASS}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-medium text-[rgb(250_250_247/0.55)]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete="current-password"
            className={cn(INPUT_CLASS, 'pr-11')}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[rgb(250_250_247/0.4)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-right">
          <Link
            href={AUTH_ROUTES.forgotPassword}
            className="text-xs text-[rgb(250_250_247/0.45)] underline-offset-2 hover:text-photic-core hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-400/90" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-photic-core py-3.5 text-sm font-medium text-[#0a0a0a] disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Open protocol dashboard'}
      </button>

      <p className="text-center text-xs text-[rgb(250_250_247/0.45)]">
        New to DIOS?{' '}
        <Link
          href={AUTH_ROUTES.authSignUp}
          className="text-photic-core underline-offset-2 hover:underline"
        >
          Secure baseline identity
        </Link>
      </p>
    </form>
  )
}
