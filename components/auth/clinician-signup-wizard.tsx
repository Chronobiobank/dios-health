'use client'

import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AuthShell } from '@/components/auth/auth-shell'
import { SignupProgress } from '@/components/auth/signup-progress'
import { TermsConsentField } from '@/components/auth/terms-consent-field'
import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { guessCountryFromLocale, COUNTRIES } from '@/lib/auth/countries'
import { REGISTRATION_BODIES } from '@/lib/auth/clinician-signup-data'
import {
  clinicianProfileToDraft,
  draftToClinicianCredentials,
  draftToClinicianProfileStep1,
  getClinicianDisplayName,
  INITIAL_CLINICIAN_SIGNUP_DRAFT,
  type ClinicianSignupDraft,
} from '@/lib/auth/clinician-signup-types'
import { buildFullName, parseOAuthNames } from '@/lib/auth/parse-oauth-names'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { mapSignUpError } from '@/lib/auth/sign-up-errors'
import { recordTermsAcceptance } from '@/lib/auth/terms'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 4

export function ClinicianSignupWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<ClinicianSignupDraft>(INITIAL_CLINICIAN_SIGNUP_DRAFT)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [signedUpWithOAuth, setSignedUpWithOAuth] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsAlreadyRecorded, setTermsAlreadyRecorded] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [step])

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      practiceCountry: guessCountryFromLocale(),
    }))

    const supabase = createClient()
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setCheckingSession(false)
        return
      }

      const metadata = user.user_metadata as {
        full_name?: string
        name?: string
        given_name?: string
        family_name?: string
      }
      const { firstName, familyName } = parseOAuthNames(metadata)

      await supabase.from('profiles').upsert(
        { id: user.id, role: 'clinician' },
        { onConflict: 'id' }
      )

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('terms_accepted_at')
        .eq('id', user.id)
        .maybeSingle<{ terms_accepted_at: string | null }>()

      const hasTerms = Boolean(profileRow?.terms_accepted_at)
      setTermsAlreadyRecorded(hasTerms)
      setAcceptedTerms(hasTerms)

      const { data: clinician } = await supabase
        .from('clinician_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (clinician?.onboarding_complete && clinician.first_name) {
        router.replace(AUTH_ROUTES.pendingVerification)
        return
      }

      const draftPatch: Partial<ClinicianSignupDraft> = {
        email: user.email ?? '',
        firstName,
        familyName,
      }

      if (clinician) {
        Object.assign(draftPatch, clinicianProfileToDraft(clinician))
        if (!draftPatch.firstName) draftPatch.firstName = firstName
        if (!draftPatch.familyName) draftPatch.familyName = familyName
      }

      updateDraft(draftPatch)
      setUserId(user.id)
      setSignedUpWithOAuth(true)

      if (!clinician?.first_name) {
        setStep(2)
      } else if (clinician.registration_number) {
        setStep(4)
      } else {
        setStep(3)
      }

      setCheckingSession(false)
    })
  }, [router])

  function updateDraft(partial: Partial<ClinicianSignupDraft>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  async function handleAccountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: draft.email.trim(),
      password: draft.password,
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
    })

    if (profileError && profileError.code !== '23505') {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const { error: termsError } = await recordTermsAcceptance(supabase, user.id)
    if (termsError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setTermsAlreadyRecorded(true)
    setUserId(user.id)
    setLoading(false)
    setStep(2)
    router.refresh()
  }

  function canContinueAboutYou() {
    const termsOk = termsAlreadyRecorded || acceptedTerms

    return (
      draft.firstName.trim().length > 0 &&
      draft.familyName.trim().length > 0 &&
      draft.practiceName.trim().length > 0 &&
      draft.practiceCity.trim().length > 0 &&
      draft.practiceCountry.trim().length > 0 &&
      termsOk
    )
  }

  async function handleAboutYouContinue() {
    if (!userId || !canContinueAboutYou()) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (!termsAlreadyRecorded) {
      if (!acceptedTerms) {
        setError('Please accept the Terms of Service and Privacy Policy.')
        setLoading(false)
        return
      }

      const { error: termsError } = await recordTermsAcceptance(supabase, userId)
      if (termsError) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setTermsAlreadyRecorded(true)
    }

    const fullName = buildFullName(draft.firstName, draft.familyName)

    const { error: profileNameError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', userId)

    if (profileNameError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const { error: clinicianError } = await supabase
      .from('clinician_profiles')
      .upsert(draftToClinicianProfileStep1(userId, draft))

    if (clinicianError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    setStep(3)
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
          full_name: getClinicianDisplayName(draft),
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
    setStep(4)
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
      <AuthShell withSiteNav>
        <p className="type-body text-center text-black/60">Loading…</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell withSiteNav maxWidthClass="max-w-[400px]">
      <SignupProgress step={step} total={TOTAL_STEPS} />

      {step > 1 && (step !== 2 || !signedUpWithOAuth) ? (
        <button
          type="button"
          onClick={goBack}
          className="type-body mb-6 inline-flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      ) : null}

      {step === 1 && !userId ? (
        <form onSubmit={handleAccountSubmit} className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
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
          {error ? (
            <p className="type-body text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <TermsConsentField
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            disabled={loading || termsAlreadyRecorded}
          />
          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className={`${BTN_PRIMARY} h-11 w-full disabled:opacity-60`}
          >
            {loading ? 'Creating account…' : 'Continue →'}
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <div className={`${CARD} space-y-4 rounded-2xl p-6 sm:p-8`}>
          <div>
            <label htmlFor="first_name" className={`${LABEL} mb-2 block`}>
              First name
            </label>
            <input
              id="first_name"
              type="text"
              required
              autoComplete="given-name"
              value={draft.firstName}
              onChange={(event) => updateDraft({ firstName: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="family_name" className={`${LABEL} mb-2 block`}>
              Family name
            </label>
            <input
              id="family_name"
              type="text"
              required
              autoComplete="family-name"
              value={draft.familyName}
              onChange={(event) => updateDraft({ familyName: event.target.value })}
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
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
          {!termsAlreadyRecorded ? (
            <TermsConsentField
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
              disabled={loading}
            />
          ) : null}
          {error ? (
            <p className="type-body text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!canContinueAboutYou() || loading}
            onClick={handleAboutYouContinue}
            className={`${BTN_PRIMARY} h-11 w-full disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? 'Saving…' : 'Continue →'}
          </button>
        </div>
      ) : null}

      {step === 3 ? (
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

      {step === 4 ? (
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
