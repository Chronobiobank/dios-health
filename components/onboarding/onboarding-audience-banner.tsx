import Link from 'next/link'

import {
  CLINICIAN_ENTRY,
  ONBOARDING_PREVIEW_NOTE,
  PATIENT_ACCOUNT_ENTRY,
  PATIENT_PREVIEW_ENTRY,
} from '@/lib/pitch/audience-entry-content'

export function OnboardingAudienceBanner() {
  return (
    <aside className="dina-onboarding__audience" role="note">
      <p className="dina-onboarding__audience-label">{PATIENT_PREVIEW_ENTRY.label}</p>
      <p className="dina-onboarding__audience-body">{ONBOARDING_PREVIEW_NOTE}</p>
      <p className="dina-onboarding__audience-links">
        <Link href={PATIENT_ACCOUNT_ENTRY.href}>Create a patient account</Link>
        <span aria-hidden> · </span>
        <Link href={CLINICIAN_ENTRY.href}>{CLINICIAN_ENTRY.cohortLabel}</Link>
      </p>
    </aside>
  )
}
