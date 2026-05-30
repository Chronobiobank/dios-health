'use client'

import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { AuthToggle } from '@/components/auth/auth-toggle'
import { SignupProgress } from '@/components/auth/signup-progress'
import { BTN_PRIMARY, CARD, LABEL, LIST_LINE } from '@/components/sections/layout'
import { guessCountryFromLocale, COUNTRIES } from '@/lib/auth/countries'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import {
  ALERTNESS_OPTIONS,
  FITZPATRICK_TYPES,
  SHIFT_PATTERNS,
  SLEEP_TIME_OPTIONS,
  WAKE_TIME_OPTIONS,
  WEARABLE_OPTIONS,
} from '@/lib/auth/patient-signup-data'
import {
  draftToPatientProfile,
  INITIAL_PATIENT_SIGNUP_DRAFT,
  type PatientSignupDraft,
} from '@/lib/auth/patient-signup-types'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { mapSignUpError, SIGN_UP_EMAIL_EXISTS_MESSAGE } from '@/lib/auth/sign-up-errors'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 5

export function PatientSignupWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<PatientSignupDraft>(INITIAL_PATIENT_SIGNUP_DRAFT)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [step])

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      locationCountry: guessCountryFromLocale(),
    }))

    const supabase = createClient()
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const metadata = user.user_metadata as { full_name?: string; name?: string }
        const fullName =
          metadata.full_name?.trim() ||
          metadata.name?.trim() ||
          user.email?.split('@')[0] ||
          'Patient'

        await supabase.from('profiles').upsert(
          { id: user.id, role: 'patient', full_name: fullName },
          { onConflict: 'id' }
        )

        if (user.email) {
          updateDraft({ email: user.email, fullName })
        } else {
          updateDraft({ fullName })
        }

        setUserId(user.id)
        setStep(2)
      }
      setCheckingSession(false)
    })
  }, [])

  function updateDraft(partial: Partial<PatientSignupDraft>) {
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
      role: 'patient',
      full_name: draft.fullName.trim(),
    })

    if (profileError && profileError.code !== '23505') {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setUserId(user.id)
    setLoading(false)
    setStep(2)
    router.refresh()
  }

  async function handleFinish() {
    if (!userId) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: saveError } = await supabase
      .from('patient_profiles')
      .upsert(draftToPatientProfile(userId, draft))

    if (saveError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push(PATIENT_ROUTES.dashboard)
  }

  function goBack() {
    setError(null)
    setStep((current) => Math.max(1, current - 1))
  }

  if (checkingSession) {
    return (
      <AuthShell>
        <p className="type-body text-center text-black/60">Loading…</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell maxWidthClass={step === 2 ? 'max-w-2xl' : 'max-w-[400px]'}>
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
              name="full_name"
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
              Email
            </label>
            <input
              id="email"
              name="email"
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
                name="password"
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
          {error ? (
            <div role="alert">
              <p className="type-body text-sm text-red-600">{error}</p>
              {error === SIGN_UP_EMAIL_EXISTS_MESSAGE ? (
                <p className="type-body mt-1 text-sm text-red-600">
                  <Link
                    href={AUTH_ROUTES.signIn}
                    className="font-medium text-black underline-offset-2 hover:underline"
                  >
                    Sign in instead
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}
          <button type="submit" disabled={loading} className={`${BTN_PRIMARY} h-11 w-full disabled:opacity-60`}>
            {loading ? 'Creating account…' : 'Continue →'}
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div>
            <p className={`${LABEL} mb-3`}>
              What best describes your skin tone in winter, away from sun exposure?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FITZPATRICK_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateDraft({ fitzpatrickType: type.value })}
                  className={cn(
                    `${CARD} rounded-xl p-3 text-left transition-colors`,
                    draft.fitzpatrickType === type.value && 'border-black ring-1 ring-black'
                  )}
                >
                  <span
                    className="mb-2 block h-10 w-full rounded-lg border border-black/10"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="type-caption font-mono text-black/50">{type.value}</span>
                  <span className="type-body mt-1 block text-sm font-medium">{type.label}</span>
                  <span className="type-caption block text-black/50">{type.swatch}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="location_city" className={`${LABEL} mb-2 block`}>
              What city are you based in?
            </label>
            <input
              id="location_city"
              type="text"
              required
              placeholder="e.g. London, Auckland, Toronto"
              value={draft.locationCity}
              onChange={(event) => updateDraft({ locationCity: event.target.value })}
              className={AUTH_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="location_country" className={`${LABEL} mb-2 block`}>
              Country
            </label>
            <select
              id="location_country"
              value={draft.locationCountry}
              onChange={(event) => updateDraft({ locationCountry: event.target.value })}
              className={AUTH_INPUT_CLASS}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={`${LABEL} mb-3`}>Do you work shifts?</p>
            <div className="flex gap-3">
              {[
                { label: 'No', value: false },
                { label: 'Yes', value: true },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => updateDraft({ shiftWorker: option.value, shiftPattern: '' })}
                  className={cn(
                    `${CARD} flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors`,
                    draft.shiftWorker === option.value && 'border-black bg-black text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {draft.shiftWorker ? (
            <div>
              <p className={`${LABEL} mb-3`}>Shift pattern</p>
              <div className="flex flex-wrap gap-2">
                {SHIFT_PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    type="button"
                    onClick={() => updateDraft({ shiftPattern: pattern })}
                    className={cn(
                      'rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors',
                      draft.shiftPattern === pattern && 'border-black bg-black text-white'
                    )}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className="type-body text-sm text-red-600">{error}</p> : null}
          <button
            type="button"
            disabled={!draft.fitzpatrickType || !draft.locationCity.trim() || (draft.shiftWorker && !draft.shiftPattern)}
            onClick={() => {
              setError(null)
              setStep(3)
            }}
            className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Continue →
          </button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6">
          <div>
            <label htmlFor="chronotype_q1" className={`${LABEL} mb-2 block`}>
              Without an alarm, what time would you naturally wake up?
            </label>
            <select
              id="chronotype_q1"
              value={draft.chronotypeQ1}
              onChange={(event) => updateDraft({ chronotypeQ1: event.target.value })}
              className={AUTH_INPUT_CLASS}
            >
              <option value="">Select a time</option>
              {WAKE_TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={`${LABEL} mb-3`}>When do you feel most alert and focused?</p>
            <div className="space-y-2">
              {ALERTNESS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateDraft({ chronotypeQ2: option.label })}
                  className={cn(
                    `${CARD} w-full rounded-full px-4 py-3 text-left text-sm font-medium transition-colors`,
                    draft.chronotypeQ2 === option.label && 'border-black bg-black text-white'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="chronotype_q3" className={`${LABEL} mb-2 block`}>
              What time do you prefer to fall asleep?
            </label>
            <select
              id="chronotype_q3"
              value={draft.chronotypeQ3}
              onChange={(event) => updateDraft({ chronotypeQ3: event.target.value })}
              className={AUTH_INPUT_CLASS}
            >
              <option value="">Select a time</option>
              {SLEEP_TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={!draft.chronotypeQ1 || !draft.chronotypeQ2 || !draft.chronotypeQ3}
            onClick={() => setStep(4)}
            className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Continue →
          </button>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          {WEARABLE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                updateDraft({ wearableConnected: option.id })
                setStep(5)
              }}
              className={`${CARD} w-full rounded-2xl p-5 text-left text-[#0D0D0D] transition-colors hover:border-black/25`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`${LIST_LINE} text-lg`}>{option.name}</p>
                {option.recommended ? (
                  <span className="shrink-0 rounded-full bg-black px-2.5 py-1 text-xs font-medium leading-none text-white">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="type-body mt-2 text-sm text-black/70">{option.body}</p>
              <span className="mt-4 inline-block text-sm font-medium text-black">{option.cta}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              updateDraft({ wearableConnected: null })
              setStep(5)
            }}
            className="w-full rounded-2xl border border-dashed border-black/20 px-5 py-5 text-left text-[#0D0D0D] transition-colors hover:border-black/40"
          >
            <p className={`${LIST_LINE} text-lg`}>Skip for now</p>
            <p className="type-body mt-2 text-sm text-black/70">
              You can connect a device later in your dashboard.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-black/70">Skip →</span>
          </button>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-4">
          <AuthToggle
            label="Share with my GP"
            description="Your doctor sees your body clock data to inform your prescriptions."
            checked={draft.dataShareGp}
            onChange={(checked) => updateDraft({ dataShareGp: checked })}
            disabled={loading}
          />
          <AuthToggle
            label="Contribute to research"
            description="Anonymised data shared with researchers. You are never identifiable."
            checked={draft.dataShareResearch}
            onChange={(checked) => updateDraft({ dataShareResearch: checked })}
            disabled={loading}
          />
          <AuthToggle
            label="Contribute to health policy"
            description="Anonymised population data shared with policy organisations and insurers developing timing-based health models. You are never identifiable."
            checked={draft.dataSharePolicy}
            onChange={(checked) => updateDraft({ dataSharePolicy: checked })}
            disabled={loading}
          />

          <p className="type-body text-center text-sm text-black/60">Off means off. Immediately.</p>

          {error ? (
            <p className="type-body text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={handleFinish}
            className={`${BTN_PRIMARY} h-11 w-full disabled:opacity-60`}
          >
            {loading ? 'Saving…' : 'Go to my dashboard →'}
          </button>
        </div>
      ) : null}
    </AuthShell>
  )
}
