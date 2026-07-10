'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/client'
import { isStaffLoginPath, loginEyebrow, loginLede, loginTitle, resolvePatientPostLoginPath, resolvePostLoginPath } from '@/lib/auth/post-login-path'
import { completeActivationLink } from '@/lib/care/complete-activation-link'
import {
  buildAuthCallbackUrl,
  persistPendingActivation,
  readPendingActivation,
} from '@/lib/care/pending-activation'
import { resolvePathAfterActivationAttempt } from '@/lib/care/resolve-activation-path'
import { planProfileDisplayName, readPlanProfile } from '@/lib/patient/plan-profile'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'
import { Input, Label } from '@/components/ui/Input'

type Mode = 'signin' | 'signup'

type LoginFormProps = {
  /** Splash home gate: compact signup-first, no page chrome title. */
  variant?: 'page' | 'splash'
}

export default function LoginForm({ variant = 'page' }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const activationParam = searchParams.get('activation')
  const staffLogin = isStaffLoginPath(next)
  const signupFromUrl = searchParams.get('signup') === '1'
  const callbackError = searchParams.get('error')
  const callbackReason = searchParams.get('reason')
  const activationFailed = callbackError === 'activation_failed'
  const isSplash = variant === 'splash'

  const [mode, setMode] = useState<Mode>(() =>
    isSplash || signupFromUrl ? 'signup' : 'signin'
  )
  const effectiveMode: Mode = staffLogin ? 'signin' : mode
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fromPlan = planProfileDisplayName(readPlanProfile())
    if (fromPlan) setDisplayName(fromPlan)
  }, [])

  useEffect(() => {
    if (activationParam) persistPendingActivation(activationParam)
  }, [activationParam])

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

    const activation = activationParam ?? readPendingActivation()
    let destination =
      tier === 'patient' || !tier
        ? await resolvePatientPostLoginPath(supabase, user!.id, next)
        : resolvePostLoginPath(tier, next)

    if (activation) {
      const linkResult = await completeActivationLink(activation)
      destination = resolvePathAfterActivationAttempt(tier, next, activation, linkResult)
      if (!linkResult.ok && linkResult.code !== 'consent_required') {
        setError(linkResult.error)
      }
    }

    router.push(destination)
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const activation = activationParam ?? readPendingActivation()

    if (effectiveMode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split('@')[0] },
          emailRedirectTo: buildAuthCallbackUrl(window.location.origin, next, activation),
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        await redirectAfterAuth()
        return
      }

      setMessage('Check your email to confirm your account, then sign in.')
      setMode('signin')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    await redirectAfterAuth()
  }

  const submitLabel = loading
    ? 'Please wait…'
    : isSplash
      ? 'Enter'
      : effectiveMode === 'signin'
        ? 'Sign in'
        : 'Create account'

  return (
    <div className={isSplash ? 'seco-auth-form seco-auth-form--splash' : 'seco-auth-form'}>
      {!isSplash ? (
        <header className="seco-auth-head">
          {loginEyebrow(next, activationParam) ? (
            <p className="seco-page__eyebrow seco-auth-head__eyebrow">{loginEyebrow(next, activationParam)}</p>
          ) : null}
          <h1 className="seco-page__title seco-auth-head__title">{loginTitle(next, effectiveMode)}</h1>
          {loginLede(next, effectiveMode, activationParam) ? (
            <p className="seco-page__lede seco-auth-head__lede">{loginLede(next, effectiveMode, activationParam)}</p>
          ) : null}
        </header>
      ) : null}

      <form onSubmit={handleSubmit} className="seco-auth-form__fields space-y-3">
        {effectiveMode === 'signup' && (
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How we address you"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSplash ? 'Email' : undefined}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={effectiveMode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSplash ? 'Password (8+ characters)' : undefined}
          />
        </div>

        {callbackError === 'auth_callback_failed' && !error && (
          <Callout tone="warning" className="text-sm">
            Email confirmation failed.
            {callbackReason ? ` ${callbackReason}` : ' The link may have expired.'}
            {' '}Try signing in below.
          </Callout>
        )}

        {activationFailed && callbackReason && !error && (
          <Callout tone="warning" className="text-sm">
            Clinician link failed: {callbackReason}
          </Callout>
        )}

        {error && (
          <Callout tone="error" className="text-sm">
            {error}
          </Callout>
        )}

        {message && (
          <Callout tone="info" className="text-sm">
            {message}
          </Callout>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {submitLabel}
        </Button>
      </form>

      <p className="seco-auth-form__switch text-center text-sm text-ink-muted">
        {!staffLogin && (mode === 'signin' ? (
          <>
            New to {DEEPDOSE_NAME}?{' '}
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
              className="font-medium text-accent hover:underline"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </button>
          </>
        ))}
      </p>
    </div>
  )
}
