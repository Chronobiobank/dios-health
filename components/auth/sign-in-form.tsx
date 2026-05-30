'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { AuthDivider } from '@/components/auth/auth-divider'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { mapSignInError } from '@/lib/auth/errors'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { resolveSignInDestination } from '@/lib/auth/post-sign-in-redirect'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error') === 'auth'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    authError ? 'Google sign-in could not be completed. Try again or use email.' : null
  )
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const form = event.currentTarget
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
      setError('Wrong email or password. Try again.')
      setLoading(false)
      return
    }

    const destination = await resolveSignInDestination(
      supabase,
      authData.user.id,
      searchParams.get('next')
    )
    router.refresh()
    router.push(destination)
  }

  return (
    <div className={`${CARD} space-y-0 rounded-2xl p-6 sm:p-8`}>
      <GoogleSignInButton />

      <AuthDivider label="or sign in with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={`${LABEL} mb-2 block`}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={AUTH_INPUT_CLASS}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className={`${LABEL} mb-2 block`}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              minLength={8}
              className={`${AUTH_INPUT_CLASS} pr-11`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition-colors hover:text-black"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-right">
            <Link
              href={AUTH_ROUTES.forgotPassword}
              className="type-body text-sm text-black/60 underline-offset-2 hover:text-black hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>

        {error ? (
          <p className="type-body text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {loading ? 'Signing in…' : 'Sign in with email'}
        </button>

        <p className="type-body pt-2 text-center text-sm text-black/60">
          New to DIOS?{' '}
          <Link
            href={AUTH_ROUTES.signUp}
            className="font-medium text-black underline-offset-2 hover:underline"
          >
            Create account →
          </Link>
        </p>
      </form>
    </div>
  )
}
