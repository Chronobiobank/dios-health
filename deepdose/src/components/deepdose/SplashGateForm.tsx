'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { resolvePatientPostLoginPath, resolvePostLoginPath } from '@/lib/auth/post-login-path'
import { completeActivationLink } from '@/lib/care/complete-activation-link'
import {
  buildAuthCallbackUrl,
  persistPendingActivation,
  readPendingActivation,
} from '@/lib/care/pending-activation'
import { resolvePathAfterActivationAttempt } from '@/lib/care/resolve-activation-path'
import { planProfileDisplayName, readPlanProfile } from '@/lib/patient/plan-profile'

type SplashGateFormProps = {
  aboutHref: string
  aboutLabel: string
  signInLabel: string
  signUpLabel: string
  brand: ReactNode
  headline: ReactNode
  orbit: ReactNode
  footer: ReactNode
}

type AuthIntent = 'signup' | 'signin'

/** Chrome + fields + one Sign up CTA. Sign In lives in the header. */
export function SplashGateForm({
  aboutHref,
  aboutLabel,
  signInLabel,
  signUpLabel,
  brand,
  headline,
  orbit,
  footer,
}: SplashGateFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<AuthIntent | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function redirectAfterAuth() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let tier: string | undefined
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tier')
        .eq('id', user.id)
        .maybeSingle()
      tier = profile?.tier
    }

    const activation = readPendingActivation()
    let destination =
      tier === 'patient' || !tier
        ? await resolvePatientPostLoginPath(supabase, user!.id, null)
        : resolvePostLoginPath(tier, null)

    if (activation) {
      const linkResult = await completeActivationLink(activation)
      destination = resolvePathAfterActivationAttempt(tier, null, activation, linkResult)
      if (!linkResult.ok && linkResult.code !== 'consent_required') {
        setError(linkResult.error)
      }
    }

    router.push(destination)
    router.refresh()
  }

  async function handleAuth(intent: AuthIntent) {
    setLoading(intent)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const activation = readPendingActivation()
    if (activation) persistPendingActivation(activation)

    if (intent === 'signup') {
      const displayName =
        planProfileDisplayName(readPlanProfile()) || email.split('@')[0] || 'Member'
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: buildAuthCallbackUrl(window.location.origin, '/connect', activation),
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(null)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        await redirectAfterAuth()
        return
      }

      setMessage('Check your email to confirm, then sign in.')
      setLoading(null)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(null)
      return
    }

    await redirectAfterAuth()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void handleAuth('signup')
  }

  const busy = loading !== null

  return (
    <form className="dd-gate__shell" onSubmit={handleSubmit}>
      <header className="dd-gate__chrome">
        {brand}
        <nav className="dd-gate__chrome-links" aria-label="Account">
          <Link href={aboutHref} className="dd-gate__chrome-link">
            {aboutLabel}
          </Link>
          <button
            type="button"
            className="dd-gate__chrome-link"
            disabled={busy}
            onClick={() => void handleAuth('signin')}
          >
            {loading === 'signin' ? '…' : signInLabel}
          </button>
        </nav>
      </header>

      <div className="dd-gate__main">
        {headline}
        {orbit}

        <div className="dd-gate__form">
          <label className="dd-gate__field">
            <span className="dd-gate__field-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25V6.75Zm2.48.53a.75.75 0 0 0-.73 1.28l7.85 4.48a1.5 1.5 0 0 0 1.5 0l7.85-4.48a.75.75 0 1 0-.73-1.28L12 11.56 3.98 7.28Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              className="dd-gate__input"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
            />
          </label>

          <label className="dd-gate__field">
            <span className="dd-gate__field-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              className="dd-gate__input"
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
            />
          </label>

          {error ? (
            <p className="dd-gate__msg dd-gate__msg--error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="dd-gate__msg" role="status">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="dd-gate__signup"
            disabled={busy}
          >
            {loading === 'signup' ? '…' : signUpLabel}
          </button>
        </div>
      </div>

      {footer ? <div className="dd-gate__foot">{footer}</div> : null}
    </form>
  )
}
