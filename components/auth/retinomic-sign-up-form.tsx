'use client'

import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

import {
  mergeOnboardingBridge,
  type OnboardingBridgePayload,
} from '@/lib/auth/onboarding-bridge'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgb(255_255_255/0.12)] bg-[#0f0f0f] px-4 py-3 text-sm text-[#fafaf7] placeholder:text-[rgb(250_250_247/0.35)] focus:border-photic-core/50 focus:outline-none focus:ring-1 focus:ring-photic-core/30'

type RetinomicSignUpFormProps = {
  initialBridge: OnboardingBridgePayload | null
}

export function RetinomicSignUpForm({ initialBridge }: RetinomicSignUpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bridge, setBridge] = useState<OnboardingBridgePayload | null>(initialBridge)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const merged = mergeOnboardingBridge(searchParams)
    if (merged.payload) setBridge(merged.payload)
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const lat = bridge?.onboardingLatLong.lat ?? -36.85
    const lng = bridge?.onboardingLatLong.lng ?? 174.76
    const irisPigment = bridge?.irisPigment ?? 'DARK'
    const skinITA = bridge?.skinITA ?? 38

    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          irisPigment,
          skinITA,
          onboardingLat: lat,
          onboardingLng: lng,
        }),
      })

      const registerJson = (await registerRes.json()) as {
        error?: string
        success?: boolean
        next?: string
      }

      if (!registerRes.ok) {
        setError(registerJson.error ?? 'Could not secure your baseline identity.')
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(
          'Account created. Sign in with your email and password to open your dashboard.'
        )
        setLoading(false)
        router.push(AUTH_ROUTES.authSignIn)
        return
      }

      router.push(registerJson.next ?? PATIENT_ROUTES.dashboard)
      router.refresh()
    } catch {
      setError('Something went wrong. Your scan data is still saved — try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[rgb(255_255_255/0.1)] bg-[#0f0f0f] p-8">
      {bridge ? (
        <div className="rounded-lg border border-photic-muted/30 bg-photic-deep/20 px-4 py-3 text-xs text-[rgb(250_250_247/0.72)]">
          <p className="font-medium text-photic-core">Bio-scan linked</p>
          <p className="mt-1 type-medical-dense">
            Iris {bridge.irisPigment} · Skin ITA {bridge.skinITA} · Zenith geo{' '}
            {bridge.onboardingLatLong.lat.toFixed(2)}, {bridge.onboardingLatLong.lng.toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="text-xs text-[rgb(250_250_247/0.5)]">
          No scan on file.{' '}
          <Link href="/onboarding" className="text-photic-core underline-offset-2 hover:underline">
            Run Retinomic baseline first
          </Link>
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="firstName" className="text-xs font-medium text-[rgb(250_250_247/0.55)]">
          First name
        </label>
        <input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
          className={INPUT_CLASS}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-medium text-[rgb(250_250_247/0.55)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
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
        {loading ? 'Securing identity…' : 'Secure your baseline identity'}
      </button>

      <p className="text-center text-xs text-[rgb(250_250_247/0.45)]">
        Already registered?{' '}
        <Link
          href={AUTH_ROUTES.authSignIn}
          className="text-photic-core underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
