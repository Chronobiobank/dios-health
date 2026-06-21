'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ClinicianInviteCode } from '@/lib/clinical/invites'
import { inviteCodeMeta, isInviteCodeActive } from '@/lib/clinical/invites'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

type ClinicianInvitePanelProps = {
  initialInvites?: ClinicianInviteCode[]
  /** Compact tile on triage — full history lives on Settings */
  variant?: 'compact' | 'full'
}

export function ClinicianInvitePanel({
  initialInvites = [],
  variant = 'full',
}: ClinicianInvitePanelProps) {
  const router = useRouter()
  const [invites, setInvites] = useState(initialInvites)
  const [latestCode, setLatestCode] = useState<string | null>(
    initialInvites.find(isInviteCodeActive)?.code ?? null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createInvite() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/care/invites', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Could not create invite.')
      return
    }

    setLatestCode(data.code)
    const listRes = await fetch('/api/care/invites')
    const listData = await listRes.json()
    if (listRes.ok && listData.invites) {
      setInvites(listData.invites)
    }
    router.refresh()
  }

  const activeInvites = invites.filter(isInviteCodeActive)

  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-invite-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-invite-title" className="dash-meds__section-title">
          Link patients
        </h2>
      </div>

      {variant === 'full' && (
        <p className="dash-meds__tile-lede">
          Generate a code and share it with your patient. They enter it under Profile → Care
          &amp; consent to link their record to your panel.
        </p>
      )}

      <ul className="dash-meds__list">
        <ProfileCollapsibleRow
          id="invite-generate"
          label="Generate invite code"
          meta={latestCode ? `Latest · ${latestCode}` : 'Not generated yet'}
        >
          {latestCode && (
            <p className="dash-meds__invite-code" aria-label="Invite code">
              {latestCode}
            </p>
          )}
          {error && <FormError>{error}</FormError>}
          <div className="dash-meds__tile-foot">
            <Button type="button" onClick={createInvite} disabled={loading}>
              {loading ? 'Generating…' : latestCode ? 'Generate new code' : 'Generate invite code'}
            </Button>
          </div>
        </ProfileCollapsibleRow>

        {variant === 'full' &&
          invites.map((invite) => (
            <ProfileCollapsibleRow
              key={invite.code}
              id={`invite-${invite.code}`}
              label={invite.code}
              meta={inviteCodeMeta(invite)}
            >
              <dl className="clinical-triage__facts">
                <div>
                  <dt>Code</dt>
                  <dd className="dash-meds__invite-code dash-meds__invite-code--inline">
                    {invite.code}
                  </dd>
                </div>
                <div>
                  <dt>Uses</dt>
                  <dd>
                    {invite.use_count}/{invite.max_uses}
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>
                    {new Date(invite.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
                {invite.expires_at && (
                  <div>
                    <dt>Expires</dt>
                    <dd>
                      {new Date(invite.expires_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </ProfileCollapsibleRow>
          ))}
      </ul>

      {variant === 'compact' && (
        <div className="dash-meds__tile-foot">
          <p className="dash-meds__empty-copy">
            {activeInvites.length > 0
              ? `${activeInvites.length} active code${activeInvites.length === 1 ? '' : 's'} on file.`
              : 'No active codes — generate one to link a patient.'}
          </p>
          <Button href="/clinical/settings" variant="secondary">
            Manage in settings
          </Button>
        </div>
      )}
    </section>
  )
}
