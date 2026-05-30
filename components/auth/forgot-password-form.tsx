'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'

import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const trimmedEmail = email.trim()
    const redirectTo = `${window.location.origin}${AUTH_ROUTES.resetPassword}`

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo,
    })

    setLoading(false)

    if (resetError) {
      setError('Could not send reset email. Check the address and try again.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
        <p className="type-body text-sm text-black/70">
          If an account exists for <span className="font-medium text-black">{email.trim()}</span>,
          we sent a link to reset your password. Check your inbox and spam folder.
        </p>
        <Link
          href={AUTH_ROUTES.signIn}
          className="type-body inline-block text-sm font-medium text-black underline-offset-2 hover:underline"
        >
          Back to sign in →
        </Link>
      </div>
    )
  }

  return (
    <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={AUTH_INPUT_CLASS}
            disabled={loading}
          />
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
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="type-body text-center text-sm text-black/60">
        <Link
          href={AUTH_ROUTES.signIn}
          className="font-medium text-black underline-offset-2 hover:underline"
        >
          Back to sign in →
        </Link>
      </p>
    </div>
  )
}
