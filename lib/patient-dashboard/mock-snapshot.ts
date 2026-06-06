import type { PatientDashboardProps, PatientSnapshot } from '@/lib/patient-dashboard/types'
import { buildHowItWorksDemoProps, buildHowItWorksDemoSnapshot } from '@/lib/patient-dashboard/how-it-works-demo-snapshot'

/** Static demo — med-timing lead, First Light complete (see how-it-works-demo-snapshot.ts). */
export const MOCK_PATIENT_SNAPSHOT: PatientSnapshot = buildHowItWorksDemoSnapshot()

export const MOCK_DASHBOARD_PROPS: PatientDashboardProps = buildHowItWorksDemoProps()
