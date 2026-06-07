import Link from 'next/link'

import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export const dynamic = 'force-dynamic'

/** Premium verification routes — tier-gated in src/middleware.ts */
export default async function PremiumDashboardPage() {
  const { profile } = await requirePatientSession()
  const name = profile.full_name ?? 'Patient'

  return (
    <div className="dios-glass-outer py-8">
      <p className="dashboard-section-label text-[var(--telemetry-muted)]">Premium verification</p>
      <h1 className="mt-2 text-xl font-medium text-[var(--text-primary)]">Clinical output unlocked</h1>
      <p className="dash-sub mt-2 text-sm">
        {name}, 90-day blood panels and six-month TipTraQ calibration blocks are active on your profile.
      </p>
      <Link href={PATIENT_ROUTES.dashboard} className="calm-auth-link mt-6 inline-flex text-sm font-medium">
        Back to dose intelligence dashboard
      </Link>
    </div>
  )
}
