'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'

type Mode = 'signin' | 'signup'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/patient/onboarding/consent'
  const callbackError = searchParams.get('error')
  const callbackReason = searchParams.get('reason')

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split('@')[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        router.push(next)
        router.refresh()
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

    router.push(next)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <p className="seco-page__lede" style={{ marginBottom: '1.5rem' }}>
        {mode === 'signin' ? 'Sign in to your account' : 'Create your patient account'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
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
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {callbackError === 'auth_callback_failed' && !error && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-warning" role="alert">
            Email confirmation failed.
            {callbackReason ? ` ${callbackReason}` : ' The link may have expired.'}
            {' '}Try signing in below.
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-xl bg-accent-light px-3 py-2 text-sm text-accent" role="status">
            {message}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-muted">
        {mode === 'signin' ? (
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
        )}
      </p>
    </div>
  )
}
