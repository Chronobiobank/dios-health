import { getCatalogEntry } from '@/lib/medications/catalog'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'

import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

/** Default demo patient when /patient-landing has no URL params (Sean James, SEAN-001). */
export const PATIENT_LANDING_DEMO = {
  patientId: 'SEAN-001',
  firstName: 'Sean',
  familyName: 'James',
  medCodes: ['metformin', 'ramipril', 'atorvastatin', 'sertraline'] as const,
  medTimes: ['07:30', '08:00', '20:00', '12:00'] as const,
  wake: '07:30',
} as const

export function buildDemoPlanContext(): PlanContextFromDraft {
  const medCodes = [...PATIENT_LANDING_DEMO.medCodes]
  return {
    medCodes,
    medNames: medCodes.map(
      (code) =>
        getCatalogEntry(code)?.displayName ?? code.charAt(0).toUpperCase() + code.slice(1)
    ),
    medTimes: [...PATIENT_LANDING_DEMO.medTimes],
    wake: PATIENT_LANDING_DEMO.wake,
    verdict: verdictForMedCodes(medCodes),
  }
}
