'use client'

import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'

export function ClinicalAccountPanel({
  displayName,
  tier,
}: {
  displayName: string
  tier: string
}) {
  const tierLabel = tier === 'enterprise' ? 'Enterprise' : 'Clinician'

  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-account-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-account-title" className="dash-meds__section-title">
          Your account
        </h2>
      </div>

      <ul className="dash-meds__list">
        <ProfileCollapsibleRow
          id="clinical-account-profile"
          label={displayName}
          meta={tierLabel}
        >
          <dl className="clinical-triage__facts">
            <div>
              <dt>Display name</dt>
              <dd>{displayName}</dd>
            </div>
            <div>
              <dt>Access tier</dt>
              <dd>{tierLabel}</dd>
            </div>
          </dl>
        </ProfileCollapsibleRow>
      </ul>
    </section>
  )
}
