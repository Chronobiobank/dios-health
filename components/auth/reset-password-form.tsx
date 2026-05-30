'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { resolveSignInDestination } from '@/lib/auth/post-sign-in-redirect'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const supabase = createClient()

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError || !data.user) {
      setError('Could not update password. Request a new reset link and try again.')
      setLoading(false)
      return
    }

    const destination = await resolveSignInDestination(supabase, data.user.id, null)
    router.refresh()
    router.push(destination)
  }

  if (!ready) {
    return (
      <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
        <p className="type-body text-sm text-black/70">
          This reset link is invalid or has expired. Request a new one below.
        </p>
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="type-body inline-block text-sm font-medium text-black underline-offset-2 hover:underline"
        >
          Request new reset link →
        </Link>
      </div>
    )
  }

  return (
    <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className={`${LABEL} mb-2 block`}>
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
