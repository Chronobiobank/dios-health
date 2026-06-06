'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { AuthDivider } from '@/components/auth/auth-divider'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { mapSignInError } from '@/lib/auth/errors'
import { isSafeRelativePath } from '@/lib/auth/post-sign-in-redirect'
import { resolvePatientAuthDestination } from '@/lib/auth/resolve-patient-destination'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { getPatientRetinomicTier } from '@/lib/auth/retinomic-access'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function RetinomicSignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error') === 'auth'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    authError ? 'Google sign-in could not be completed. Try again or use email.' : null
  )
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
    <div className="dios-glass-outer calm-auth-form p-8">
      <GoogleSignInButton />

      <AuthDivider label="or sign in with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="calm-auth-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="calm-auth-input"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="calm-auth-label">
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
            className={cn('calm-auth-input', 'pr-11')}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-faint)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-right">
          <Link href={AUTH_ROUTES.forgotPassword} className="calm-auth-muted calm-auth-link">
            Forgot password?
          </Link>
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600/90" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="dios-btn-on-light calm-auth-btn-primary">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="calm-auth-muted text-center">
        New to DIOS?{' '}
        <Link href={AUTH_ROUTES.authSignUp} className="calm-auth-link">
          Create account
        </Link>
      </p>
      </form>
    </div>
  )
}
