'use client'

import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { SignupProgress } from '@/components/auth/signup-progress'
import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { guessCountryFromLocale, COUNTRIES } from '@/lib/auth/countries'
import { REGISTRATION_BODIES } from '@/lib/auth/clinician-signup-data'
import {
  draftToClinicianCredentials,
  draftToClinicianProfileStep1,
  INITIAL_CLINICIAN_SIGNUP_DRAFT,
  type ClinicianSignupDraft,
} from '@/lib/auth/clinician-signup-types'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { mapSignUpError } from '@/lib/auth/sign-up-errors'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 3

export function ClinicianSignupWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<ClinicianSignupDraft>(INITIAL_CLINICIAN_SIGNUP_DRAFT)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      practiceCountry: guessCountryFromLocale(),
    }))

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setCheckingSession(false)
        return
      }

      setUserId(user.id)
      setDraft((current) => ({ ...current, email: user.email ?? current.email }))

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.full_name) {
        setDraft((current) => ({ ...current, fullName: profile.full_name ?? current.fullName }))
      }

      const { data: clinician } = await supabase
        .from('clinician_profiles')
        .select('registration_number, onboarding_complete, practice_name, practice_address')
        .eq('id', user.id)
        .maybeSingle()

      if (clinician?.onboarding_complete) {
        router.replace(AUTH_ROUTES.pendingVerification)
        return
      }

      if (clinician?.registration_number) {
        setStep(3)
      } else if (clinician) {
        setStep(2)
      }

      setCheckingSession(false)
    })
  }, [router])

  function updateDraft(partial: Partial<ClinicianSignupDraft>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  async function handleAccountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: draft.email.trim(),
      password: draft.password,
      options: {
        data: { full_name: draft.fullName.trim() },
      },
    })

    if (signUpError) {
      setError(mapSignUpError(signUpError))
      setLoading(false)
      return
    }

    let user = data.user

    if (!data.session && user) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: draft.email.trim(),
        password: draft.password,
      })
      if (signInError) {
        setError(mapSignUpError(signInError))
        setLoading(false)
        return
      }
      user = signInData.user
    }

    if (!user) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      role: 'clinician',
      full_name: draft.fullName.trim(),
    })

    if (profileError && profileError.code !== '23505') {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const { error: clinicianError } = await supabase
      .from('clinician_profiles')
      .upsert(draftToClinicianProfileStep1(user.id, draft))

    if (clinicianError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setUserId(user.id)
    setLoading(false)
    setStep(2)
    router.refresh()
  }

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('clinician_profiles')
      .update(draftToClinicianCredentials(draft))
      .eq('id', userId)

    if (updateError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    try {
      await fetch('/api/clinician-verification-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: draft.fullName,
          email: draft.email,
          practice_name: draft.practiceName,
          registration_body: draft.registrationBody,
          registration_number: draft.registrationNumber,
        }),
      })
    } catch {
      // Notification failure should not block onboarding
    }

    setLoading(false)
    setStep(3)
  }

  async function finishOnboarding(sendInvite: boolean) {
    if (!userId) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (sendInvite && draft.inviteEmail.trim()) {
      const { error: inviteError } = await supabase.from('clinician_patients').insert({
        clinician_id: userId,
        invite_email: draft.inviteEmail.trim().toLowerCase(),
        status: 'pending',
      })

      if (inviteError) {
        setError('Could not send invite. Try again or skip for now.')
        setLoading(false)
        return
      }
    }

    const { error: completeError } = await supabase
      .from('clinician_profiles')
      .update({ onboarding_complete: true })
      .eq('id', userId)

    if (completeError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push(AUTH_ROUTES.pendingVerification)
  }

  function goBack() {
    setError(null)
    setStep((current) => Math.max(1, current - 1))
  }

  if (checkingSession) {
    return (
      <AuthShell headline="Create your clinical account." subtext="Free to start. No procurement needed.">
        <p className="type-body text-center text-black/60">Loading…</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      headline={STEP_COPY[step].headline}
      subtext={STEP_COPY[step].subtext}
      maxWidthClass="max-w-[400px]"
    >
      <SignupProgress step={step} total={TOTAL_STEPS} />

      {step > 1 ? (
        <button
          type="button"
          onClick={goBack}
          className="type-body mb-6 inline-flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      ) : null}

      {step === 1 ? (
        <form onSubmit={handleAccountSubmit} className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
          <div>
            <label htmlFor="full_name" className={`${LABEL} mb-2 block`}>
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              required
              autoComplete="name"
              value={draft.fullName}
              onChange={(event) => updateDraft({ fullName: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className={`${LABEL} mb-2 block`}>
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={draft.email}
              onChange={(event) => updateDraft({ email: event.target.value })}
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
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={draft.password}
                onChange={(event) => updateDraft({ password: event.target.value })}
                className={`${AUTH_INPUT_CLASS} pr-11`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 hover:text-black"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="practice_name" className={`${LABEL} mb-2 block`}>
              Practice name
            </label>
            <input
              id="practice_name"
              type="text"
              required
              value={draft.practiceName}
              onChange={(event) => updateDraft({ practiceName: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="practice_city" className={`${LABEL} mb-2 block`}>
              Practice city
            </label>
            <input
              id="practice_city"
              type="text"
              required
              placeholder="e.g. London, Auckland"
              value={draft.practiceCity}
              onChange={(event) => updateDraft({ practiceCity: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="practice_country" className={`${LABEL} mb-2 block`}>
              Country
            </label>
            <select
              id="practice_country"
              value={draft.practiceCountry}
              onChange={(event) => updateDraft({ practiceCountry: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          {error ? (
            <p className="type-body text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading} className={`${BTN_PRIMARY} h-11 w-full disabled:opacity-60`}>
            {loading ? 'Creating account…' : 'Continue →'}
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={handleCredentialsSubmit} className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
          <div>
            <p className={`${LABEL} mb-3`}>Registration body</p>
            <div className="space-y-2">
              {REGISTRATION_BODIES.map((body) => (
                <button
                  key={body.value}
                  type="button"
                  onClick={() => updateDraft({ registrationBody: body.value })}
                  className={cn(
                    `${CARD} w-full rounded-full px-4 py-3 text-left text-sm font-medium transition-colors`,
                    draft.registrationBody === body.value && 'border-black bg-black text-white'
                  )}
                >
                  {body.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="registration_number" className={`${LABEL} mb-2 block`}>
              Registration number
            </label>
            <input
              id="registration_number"
              type="text"
              required
              placeholder="Your registration number"
              value={draft.registrationNumber}
              onChange={(event) => updateDraft({ registrationNumber: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
          </div>
          <p className="type-mono text-xs text-black/50">We verify manually within one business day.</p>
          {error ? (
            <p className="type-body text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || !draft.registrationBody || !draft.registrationNumber.trim()}
            className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? 'Submitting…' : 'Submit for verification →'}
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
          <div>
            <label htmlFor="invite_email" className={`${LABEL} mb-2 block`}>
              Patient email address
            </label>
            <input
              id="invite_email"
              type="email"
              placeholder="Patient email address"
              value={draft.inviteEmail}
              onChange={(event) => updateDraft({ inviteEmail: event.target.value })}
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
            type="button"
            disabled={loading || !draft.inviteEmail.trim()}
            onClick={() => finishOnboarding(true)}
            className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? 'Sending…' : 'Send invite'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => finishOnboarding(false)}
            className="type-body w-full text-center text-sm text-black/60 underline-offset-2 hover:underline"
          >
            I&apos;ll do this later →
          </button>
        </div>
      ) : null}
    </AuthShell>
  )
}

const STEP_COPY: Record<number, { headline: string; subtext: string }> = {
  1: {
    headline: 'Create your clinical account.',
    subtext: 'Free to start. No procurement needed.',
  },
  2: {
    headline: 'Verify your registration.',
    subtext: 'We check every clinician before granting patient access.',
  },
  3: {
    headline: 'Invite a patient to connect.',
    subtext: 'They join free. You see their body clock data once they consent.',
  },
}
