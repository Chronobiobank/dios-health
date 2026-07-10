'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClinicianLinkForm } from '@/components/patient/ClinicianLinkForm'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import {
  consentRowMeta,
  type LinkedClinician,
  type ProfileConsentRow,
} from '@/lib/patient/profile-settings'
import { Button } from '@/components/ui/Button'
import { checkboxClass, FormError } from '@/components/ui/Form'

type ProfilePanelProps = {
  remindersEnabled: boolean
  sharingEnabled: boolean
  frameworkId: string
  consents: ProfileConsentRow[]
  clinicians: LinkedClinician[]
}

function RemindersRow({ initialEnabled }: { initialEnabled: boolean }) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(initialEnabled)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function toggle(next: boolean) {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/patient/profile/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })

    const body = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(body.error ?? 'Could not update reminders')
      return
    }

    setEnabled(next)
    router.refresh()
  }

  return (
    <ProfileCollapsibleRow
      id="reminders"
      label="Dose reminders"
      meta={enabled ? 'On' : 'Off'}
    >
      <label className="flex items-center gap-2.5 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={enabled}
          disabled={loading}
          onChange={(e) => void toggle(e.target.checked)}
          className={checkboxClass}
        />
        Notify when a dosing window opens
      </label>
      {error && (
        <div className="mt-3">
          <FormError>{error}</FormError>
        </div>
      )}
    </ProfileCollapsibleRow>
  )
}

function ConsentRow({
  row,
  frameworkId,
}: {
  row: ProfileConsentRow
  frameworkId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(row.active)

  async function withdraw() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/consent/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        framework_id: frameworkId,
        purpose_code: row.code,
      }),
    })

    const body = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(body.error ?? 'Could not withdraw consent')
      return
    }

    setActive(false)
    router.refresh()
  }

  async function grant() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/consent/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        framework_id: frameworkId,
        grants: [{ purpose_code: row.code, granted: true }],
      }),
    })

    const body = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(body.error ?? 'Could not update consent')
      return
    }

    setActive(true)
    router.refresh()
  }

  const currentRow = { ...row, active }

  return (
    <ProfileCollapsibleRow
      id={`consent-${row.code}`}
      label={row.title}
      meta={consentRowMeta(currentRow)}
    >
      {row.isRequired ? (
        <p className="text-sm text-ink-muted">Required to use Deepdose.</p>
      ) : active ? (
        <Button type="button" variant="secondary" disabled={loading} onClick={() => void withdraw()}>
          {loading ? 'Updating…' : 'Withdraw consent'}
        </Button>
      ) : (
        <Button type="button" disabled={loading} onClick={() => void grant()}>
          {loading ? 'Updating…' : 'Grant consent'}
        </Button>
      )}
      {error && (
        <div className="mt-3">
          <FormError>{error}</FormError>
        </div>
      )}
    </ProfileCollapsibleRow>
  )
}

export function ProfilePanel({
  remindersEnabled,
  sharingEnabled,
  frameworkId,
  consents,
  clinicians,
}: ProfilePanelProps) {
  const optionalConsents = consents.filter((c) => !c.isRequired)
  const requiredConsents = consents.filter((c) => c.isRequired)
  const clinicianMeta = !sharingEnabled
    ? 'Unavailable'
    : clinicians.length > 0
      ? `${clinicians.length} linked`
      : 'None linked'

  return (
    <div className="dash-meds__form">
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="profile-reminders-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="profile-reminders-title" className="dash-meds__section-title">
            Reminders
          </h2>
        </div>

        <ul className="dash-meds__list">
          <RemindersRow initialEnabled={remindersEnabled} />
        </ul>
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="profile-care-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="profile-care-title" className="dash-meds__section-title">
            Care &amp; consent
          </h2>
        </div>

        <ul className="dash-meds__list">
          <ProfileCollapsibleRow id="clinician" label="Clinician link" meta={clinicianMeta}>
            {!sharingEnabled ? (
              <p className="text-sm text-ink-muted">
                Clinical care consent is required.{' '}
                <Link href="/patient/onboarding/consent" className="dash-meds__inline-link">
                  Review consent
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                <ClinicianLinkForm />
                {clinicians.length > 0 && (
                  <ul className="space-y-2 border-t border-border pt-4 text-sm text-ink">
                    {clinicians.map((c) => (
                      <li key={c.id}>{c.displayName ?? 'Clinician'}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </ProfileCollapsibleRow>

          {requiredConsents.map((row) => (
            <ConsentRow key={row.code} row={row} frameworkId={frameworkId} />
          ))}

          {optionalConsents.map((row) => (
            <ConsentRow key={row.code} row={row} frameworkId={frameworkId} />
          ))}
        </ul>
      </section>

      <div className="dash-meds__actions">
        <Button href="/profile" variant="secondary" className="dash-meds__cancel">
          Back to dash
        </Button>
      </div>
    </div>
  )
}
