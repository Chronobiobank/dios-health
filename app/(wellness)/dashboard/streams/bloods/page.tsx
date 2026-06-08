import Link from 'next/link'

import { BloodPanelForm } from '@/components/dashboard/blood-panel-form'
import {
  SETTINGS_BACK_LINK,
  SETTINGS_HEADER,
  SETTINGS_LEDE,
} from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { requirePatientSession } from '@/lib/auth/require-patient'

export const dynamic = 'force-dynamic'

export default async function DashboardStreamsBloodsPage() {
  await requirePatientSession()

  return (
    <>
      <header className={SETTINGS_HEADER}>
        <Link href={PATIENT_ROUTES.streams} className={SETTINGS_BACK_LINK}>
          ← Data streams
        </Link>
        <h1>Gominak blood panel</h1>
        <p className={SETTINGS_LEDE}>
          Enter your City Labs or GP results to refine your body clock estimate (Layer 2).
        </p>
      </header>

      <BloodPanelForm />
    </>
  )
}
