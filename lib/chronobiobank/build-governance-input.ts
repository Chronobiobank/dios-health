import type { GovernanceContributions } from '@/lib/chronobiobank/types'

export type GovernanceInputSources = {
  smartphoneObservationDays: number
  bloodPanelsCount: number
  tiptraqNightsCount: number
}

export function governanceContributionsFromSources(
  sources: GovernanceInputSources
): GovernanceContributions {
  return {
    firstLightScanDays: sources.smartphoneObservationDays,
    hasVerifiedCityLabsPanel: sources.bloodPanelsCount > 0,
    tiptraqNightsContributed: sources.tiptraqNightsCount,
  }
}

/** Sean James demo — high-fidelity Coimbra cohort contributor */
export const SEAN_JAMES_GOVERNANCE_CONTRIBUTIONS: GovernanceContributions = {
  firstLightScanDays: 42,
  hasVerifiedCityLabsPanel: true,
  tiptraqNightsContributed: 12,
}
