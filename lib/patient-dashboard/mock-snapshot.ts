import type { PatientDashboardProps } from '@/lib/patient-dashboard/types'
import { buildSeanJamesSnapshot } from '@/lib/patient-dashboard/sean-james-tiptraq'
import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'

/** Static demo data — Sean James TipTraQ (see sean-james-tiptraq.ts). */
export const MOCK_PATIENT_SNAPSHOT = buildSeanJamesSnapshot()

export const MOCK_DASHBOARD_PROPS: PatientDashboardProps = {
  greeting: 'Kia ora, Sean.',
  firstName: 'Sean',
  fullName: 'Sean James',
  avatarUrl: DEFAULT_DASHBOARD_AVATAR,
  snapshot: MOCK_PATIENT_SNAPSHOT,
}
