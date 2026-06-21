'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/client'
import { isStaffLoginPath, loginEyebrow, loginLede, loginTitle, resolvePostLoginPath } from '@/lib/auth/post-login-path'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'
import { Input, Label } from '@/components/ui/Input'

type Mode = 'signin' | 'signup'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const staffLogin = isStaffLoginPath(next)
  const callbackError = searchParams.get('error')
  const callbackReason = searchParams.get('reason')

  const [mode, setMode] = useState<Mode>('signin')
  const effectiveMode: Mode = staffLogin ? 'signin' : mode
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
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

    router.push(resolvePostLoginPath(tier, next))
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()

    if (effectiveMode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split('@')[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ''
          }`,
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

  return (
    <div className="seco-auth-form">
      <header className="seco-auth-head">
        {loginEyebrow(next) ? (
          <p className="seco-page__eyebrow seco-auth-head__eyebrow">{loginEyebrow(next)}</p>
        ) : null}
        <h1 className="seco-page__title seco-auth-head__title">{loginTitle(next, effectiveMode)}</h1>
        {loginLede(next, effectiveMode) ? (
          <p className="seco-page__lede seco-auth-head__lede">{loginLede(next, effectiveMode)}</p>
        ) : null}
      </header>

      <form onSubmit={handleSubmit} className="seco-auth-form__fields space-y-4">
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
          />
        </div>

        {callbackError === 'auth_callback_failed' && !error && (
          <Callout tone="warning" className="text-sm">
            Email confirmation failed.
            {callbackReason ? ` ${callbackReason}` : ' The link may have expired.'}
            {' '}Try signing in below.
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
          {loading ? 'Please wait…' : effectiveMode === 'signin' ? 'Sign in' : 'Create account'}
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
