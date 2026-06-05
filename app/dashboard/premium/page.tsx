import Link from 'next/link'

import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export const dynamic = 'force-dynamic'

/** Premium verification routes — tier-gated in src/middleware.ts */
export default async function PremiumDashboardPage() {
  const { profile } = await requirePatientSession()
  const name = profile.full_name ?? 'Patient'

  return (
    <div className="retinomic-protocol py-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6366f1]">
        Premium verification
      </p>
      <h1 className="mt-2 text-xl font-medium text-[#fafaf7]">Clinical output unlocked</h1>
      <p className="mt-2 text-sm text-[rgb(250_250_247/0.6)]">
        {name}, quarterly labs and TipTraQ webhook streams are active on your profile.
      </p>
      <Link
        href={PATIENT_ROUTES.dashboard}
        className="mt-6 inline-flex text-sm font-medium text-[#a5b4fc] underline-offset-2 hover:underline"
      >
        Back to protocol dashboard
      </Link>
    </div>
  )
}
