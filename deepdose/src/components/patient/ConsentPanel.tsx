'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ConsentFramework, ConsentPurpose, PatientConsent } from '@/lib/consent/dynamic-consent'
import { buildConsentState, validateRequiredConsents } from '@/lib/consent/dynamic-consent'
import { buildMedsOnboardingPath, parseMedsOnboardingParams } from '@/lib/medications/home-to-onboarding'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Button } from '@/components/ui/Button'
import { checkboxClass, FormError } from '@/components/ui/Form'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'

interface ConsentPanelProps {
  framework: ConsentFramework
  purposes: ConsentPurpose[]
  initialConsents: PatientConsent[]
}

function consentPurposeMeta(purpose: ConsentPurpose, accepted: boolean): string {
  if (purpose.is_required) {
    return accepted ? 'Required · Accepted' : 'Required · Not accepted'
  }
  return accepted ? 'Accepted' : 'Not accepted'
}

type ConsentPurposeRowProps = {
  purpose: ConsentPurpose
  accepted: boolean
  onToggle: () => void
}

function ConsentPurposeRow({ purpose, accepted, onToggle }: ConsentPurposeRowProps) {
  return (
    <ProfileCollapsibleRow
      id={purpose.code}
      label={purpose.title}
      meta={consentPurposeMeta(purpose, accepted)}
    >
      <label className="flex items-center gap-2.5 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={onToggle}
          className={checkboxClass}
        />
        I agree
      </label>
    </ProfileCollapsibleRow>
  )
}

export default function ConsentPanel({
  framework,
  purposes,
  initialConsents,
}: ConsentPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { med, time } = parseMedsOnboardingParams(searchParams)
  const [grants, setGrants] = useState(() => buildConsentState(purposes, initialConsents))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiredPurposes = purposes.filter((p) => p.is_required)
  const optionalPurposes = purposes.filter((p) => !p.is_required)

  function toggle(code: string, isRequired: boolean) {
    setGrants((prev) => {
      const next = !prev[code]
      if (isRequired && !next) return prev
      return { ...prev, [code]: next }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validation = validateRequiredConsents(purposes, grants)
    if (!validation.valid) {
      setError('Please accept all required consents to continue.')
      return
    }

    setLoading(true)

    const grantPayload = purposes.map((p) => ({
      purpose_code: p.code,
      granted: grants[p.code] ?? false,
    }))

    const auditRes = await fetch('/api/consent/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        framework_id: framework.id,
        action: 'viewed',
        purpose_codes: purposes.map((p) => p.code),
      }),
    })

    if (!auditRes.ok) {
      const auditBody = await auditRes.json().catch(() => ({}))
      setError(auditBody.error ?? 'Failed to record consent view')
      setLoading(false)
      return
    }

    const res = await fetch('/api/consent/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        framework_id: framework.id,
        grants: grantPayload,
      }),
    })

    const body = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(body.error ?? 'Failed to save consents')
      setLoading(false)
      return
    }

    router.push(buildMedsOnboardingPath({ med: med ?? undefined, time: time ?? undefined }))
    router.refresh()
  }

  return (
    <div className="dash-meds dash-meds--onboarding space-y-6">
      <OnboardingHeader
        step={1}
        eyebrow={`Step 1 · ${framework.version}`}
        title="Your consent"
      />

      <form onSubmit={handleSubmit} className="dash-meds__form">
        {requiredPurposes.length > 0 && (
          <section
            className="dash-meds__tile seco-app-card p-5 md:p-6"
            aria-labelledby="consent-required-title"
          >
            <div className="dash-meds__section-head">
              <h2 id="consent-required-title" className="dash-meds__section-title">
                Required
              </h2>
            </div>

            <ul className="dash-meds__list">
              {requiredPurposes.map((purpose) => (
                <ConsentPurposeRow
                  key={purpose.code}
                  purpose={purpose}
                  accepted={grants[purpose.code] ?? false}
                  onToggle={() => toggle(purpose.code, purpose.is_required)}
                />
              ))}
            </ul>
          </section>
        )}

        {optionalPurposes.length > 0 && (
          <section
            className="dash-meds__tile seco-app-card p-5 md:p-6"
            aria-labelledby="consent-optional-title"
          >
            <div className="dash-meds__section-head">
              <h2 id="consent-optional-title" className="dash-meds__section-title">
                Optional
              </h2>
            </div>

            <ul className="dash-meds__list">
              {optionalPurposes.map((purpose) => (
                <ConsentPurposeRow
                  key={purpose.code}
                  purpose={purpose}
                  accepted={grants[purpose.code] ?? false}
                  onToggle={() => toggle(purpose.code, purpose.is_required)}
                />
              ))}
            </ul>
          </section>
        )}

        {error && <FormError>{error}</FormError>}

        <div className="dash-meds__actions">
          <Button type="submit" disabled={loading} className="dash-meds__submit">
            {loading ? 'Saving…' : 'Continue to your meds'}
          </Button>
        </div>
      </form>
    </div>
  )
}
