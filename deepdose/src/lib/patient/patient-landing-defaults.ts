import { getCatalogEntry } from '@/lib/medications/catalog'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'

import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

/** Default demo member when /profile has no saved plan profile. */
export const PATIENT_LANDING_DEMO = {
  patientId: 'DEMO-001',
  firstName: 'Leo',
  familyName: 'Costa',
  /** Location drives solar exposure / light timing context */
  location: 'Manchester, UK',
  journey: 'Working on steadier nights and better timing.',
  /** Male default face for ManJam invites until the member uploads their own. */
  avatarUrl: communityFaceUrl('leo', 128),
  medCodes: ['metformin', 'ramipril', 'atorvastatin', 'sertraline'] as const,
  medTimes: ['07:30', '08:00', '20:00', '12:00'] as const,
  wake: '07:30',
} as const

/** Stored upload wins; otherwise demo face so chrome never shows an empty circle. */
export function resolvePlanAvatarUrl(avatarUrl?: string | null): string {
  const trimmed = avatarUrl?.trim()
  return trimmed || PATIENT_LANDING_DEMO.avatarUrl
}

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
