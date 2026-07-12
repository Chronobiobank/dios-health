'use client'

import { useCallback, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { HomeDrugSearch } from '@/components/deepdose/HomeDrugSearch'
import { FOUNDERS_JOIN } from '@/lib/deepdose-marketing/founders-content'
import { createClient } from '@/lib/supabase/client'
import { buildAuthCallbackUrl } from '@/lib/care/pending-activation'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import { savePlanDraft } from '@/lib/patient/plan-draft'
import { DEFAULT_PATIENT_HOME } from '@/lib/auth/post-login-path'

type PlanSnapshot = {
  medCodes: string[]
  medTimes: string[]
  wake: string | null
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 10V8a4 4 0 0 1 8 0v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Founder join: med tile + auth pills → profile. */
export function FounderJoinForm() {
  const router = useRouter()
  const [plan, setPlan] = useState<PlanSnapshot>({
    medCodes: [],
    medTimes: [],
    wake: null,
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const profileHref = useMemo(
    () =>
      buildPatientLandingPath({
        medCodes: plan.medCodes,
        medTimes: plan.medTimes,
        wake: plan.wake ?? undefined,
      }),
    [plan]
  )

  const handlePlanChange = useCallback((next: PlanSnapshot) => {
    setPlan(next)
    savePlanDraft(next)
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: email.split('@')[0] },
        emailRedirectTo: buildAuthCallbackUrl(
          window.location.origin,
          profileHref || DEFAULT_PATIENT_HOME
        ),
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      router.push(profileHref)
      router.refresh()
      return
    }

    setMessage('Check your email to confirm, then sign in.')
    setLoading(false)
  }

  return (
    <div className="seco-spectrum-tiles dd-join__stack dd-gate">
      <section
        className="seco-spectrum-tile dd-join__meds dd-gate__baseline"
        style={{ '--cue': '#acd3de' } as CSSProperties}
        aria-labelledby="dd-join-med-title"
      >
        <h2 id="dd-join-med-title" className="seco-spectrum-tile__title">
          {FOUNDERS_JOIN.medTitle}
        </h2>
        <div className="seco-spectrum-tile__body">
          <HomeDrugSearch showCta={false} destination="profile" onPlanChange={handlePlanChange} />
        </div>
      </section>

      <section
        className="seco-spectrum-tile dd-join__auth"
        style={{ '--cue': '#c9b6f2' } as CSSProperties}
        aria-label="Create free account"
      >
        <form className="dd-gate__form" onSubmit={handleSubmit}>
          <label className="dd-gate__field">
            <span className="dd-gate__field-icon">
              <MailIcon />
            </span>
            <input
              className="dd-gate__input"
              type="email"
              name="email"
              autoComplete="email"
              required
              aria-label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="dd-gate__field">
            <span className="dd-gate__field-icon">
              <LockIcon />
            </span>
            <input
              className="dd-gate__input"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              aria-label="Password"
              placeholder="Password (8+)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="dd-gate__msg dd-gate__msg--error">{error}</p> : null}
          {message ? <p className="dd-gate__msg">{message}</p> : null}

          <button type="submit" className="dd-gate__signup" disabled={loading}>
            {loading ? 'Please wait…' : FOUNDERS_JOIN.submitLabel}
          </button>
        </form>
      </section>
    </div>
  )
}
