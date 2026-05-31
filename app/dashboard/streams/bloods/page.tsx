import Link from 'next/link'

import { BloodPanelForm } from '@/components/dashboard/blood-panel-form'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { requirePatientSession } from '@/lib/auth/require-patient'

export const dynamic = 'force-dynamic'

export default async function DashboardStreamsBloodsPage() {
  const { profile } = await requirePatientSession()

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <section>
        <Link
          href={PATIENT_ROUTES.streams}
          className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
        >
          ← Data streams
        </Link>
        <h1 className="mt-3 text-2xl font-medium text-black">Gominak blood panel</h1>
        <p className="mt-2 text-sm text-black/55">
          Enter your City Labs or GP results to refine your body clock estimate (Layer 2).
        </p>
      </section>

      <BloodPanelForm />
    </>
  )
}
