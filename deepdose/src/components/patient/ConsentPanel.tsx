'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import type { ConsentFramework, ConsentPurpose, PatientConsent } from '@/lib/consent/dynamic-consent'
import { buildConsentState, validateRequiredConsents } from '@/lib/consent/dynamic-consent'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Layout'
import { checkboxClass, FieldHint, FormError } from '@/components/ui/Form'
import { OnboardingHeader } from '@/components/patient/OnboardingShell'

interface ConsentPanelProps {
  framework: ConsentFramework
  purposes: ConsentPurpose[]
  initialConsents: PatientConsent[]
}

export default function ConsentPanel({
  framework,
  purposes,
  initialConsents,
}: ConsentPanelProps) {
  const router = useRouter()
  const [grants, setGrants] = useState(() => buildConsentState(purposes, initialConsents))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    router.push('/patient/onboarding/chronotype')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OnboardingHeader
        step={1}
        eyebrow={framework.version}
        title={framework.title}
        description={framework.description ?? undefined}
      />

      <ul className="dios-inset-panel divide-y divide-border">
        {purposes.map((purpose) => {
          const checked = grants[purpose.code] ?? false
          return (
            <li key={purpose.code} className="p-4 md:p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(purpose.code, purpose.is_required)}
                  className={`mt-0.5 ${checkboxClass}`}
                />
                <span className="flex-1 space-y-1.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-ink">{purpose.title}</span>
                    {purpose.is_required && <Badge tone="neutral">Required</Badge>}
                  </span>
                  {purpose.description && (
                    <span className="block text-sm leading-relaxed text-ink-muted">
                      {purpose.description}
                    </span>
                  )}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <FieldHint>
        You control optional consents and can withdraw them later in your profile.
        Required clinical care consent is needed to use {DEEPDOSE_NAME} with your GP.
      </FieldHint>

      {error && <FormError>{error}</FormError>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving…' : 'Save and continue'}
      </Button>
    </form>
  )
}
