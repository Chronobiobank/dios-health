'use client'

import { useCallback, useState } from 'react'

import { AuthToggle } from '@/components/auth/auth-toggle'
import { SETTINGS_TOGGLES } from '@/components/dashboard/dashboard-styles'
import { CHRONOBIOBANK_CONSENT_TOGGLES } from '@/lib/chronobiobank/consent-toggles'
import type { ChronobiobankConsentState } from '@/lib/chronobiobank/types'
import type { ChronobiobankConsentDimension } from '@/lib/chronobiobank/types'

type ChronobiobankConsentPanelProps = {
  initial: ChronobiobankConsentState
  /** Demo mode — toggles update locally only */
  demoMode?: boolean
}

export function ChronobiobankConsentPanel({
  initial,
  demoMode = false,
}: ChronobiobankConsentPanelProps) {
  const [consent, setConsent] = useState(initial)
  const [saving, setSaving] = useState<ChronobiobankConsentDimension | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback(
    async (dimension: ChronobiobankConsentDimension, enabled: boolean) => {
      const toggle = CHRONOBIOBANK_CONSENT_TOGGLES.find((t) => t.dimension === dimension)
      if (!toggle) return

      const previous = consent[toggle.key]
      setConsent((c) => ({ ...c, [toggle.key]: enabled }))
      setSaving(dimension)
      setError(null)
      setSavedMessage(null)

      if (demoMode) {
        setSaving(null)
        setSavedMessage(`${toggle.label} updated (demo)`)
        return
      }

      try {
        const response = await fetch('/api/chronobiobank/consent', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dimension, enabled }),
        })
        const payload = (await response.json()) as { error?: string; consent?: ChronobiobankConsentState }

        if (!response.ok) {
          setConsent((c) => ({ ...c, [toggle.key]: previous }))
          setError(payload.error ?? 'Could not save consent.')
          setSaving(null)
          return
        }

        if (payload.consent) setConsent(payload.consent)
        setSavedMessage(`${toggle.label} saved — logged immutably`)
      } catch {
        setConsent((c) => ({ ...c, [toggle.key]: previous }))
        setError('Could not save consent. Please try again.')
      }

      setSaving(null)
    },
    [consent, demoMode]
  )

  return (
    <div className="space-y-4">
      <div className={SETTINGS_TOGGLES}>
        {CHRONOBIOBANK_CONSENT_TOGGLES.map((toggle) => (
          <AuthToggle
            key={toggle.dimension}
            label={toggle.label}
            description={toggle.description}
            checked={consent[toggle.key]}
            onChange={(checked) => void handleChange(toggle.dimension, checked)}
            disabled={saving === toggle.dimension}
          />
        ))}
      </div>
      <p className="text-sm text-black/55">
        Each dimension is independent. Every change is timestamped in the consent audit log.
      </p>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-black/70">
        {savedMessage}
      </p>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
