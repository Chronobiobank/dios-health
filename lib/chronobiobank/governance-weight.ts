import type { GovernanceContributions, GovernanceWeightBreakdown } from '@/lib/chronobiobank/types'

const BASE_PER_SCAN_DAY = 2
const BASE_CAP = 60
const CITY_LABS_MULTIPLIER = 1.5
const TIPTRAQ_90_MULTIPLIER = 1.4
const TIPTRAQ_7_MULTIPLIER = 1.15

export function calculateGovernanceWeight(
  contributions: GovernanceContributions
): GovernanceWeightBreakdown {
  const scanDays = Math.max(contributions.firstLightScanDays, contributions.firstLightScanDays > 0 ? 1 : 0)
  const basePoints = Math.min(BASE_CAP, scanDays * BASE_PER_SCAN_DAY)

  const cityLabsMultiplier = contributions.hasVerifiedCityLabsPanel ? CITY_LABS_MULTIPLIER : 1

  let tiptraqMultiplier = 1
  if (contributions.tiptraqNightsContributed >= 90) {
    tiptraqMultiplier = TIPTRAQ_90_MULTIPLIER
  } else if (contributions.tiptraqNightsContributed >= 7) {
    tiptraqMultiplier = TIPTRAQ_7_MULTIPLIER
  }

  const totalWeight = Math.round(basePoints * cityLabsMultiplier * tiptraqMultiplier)

  let votingLabel = 'Participant'
  if (totalWeight >= 120) votingLabel = 'Core contributor'
  else if (totalWeight >= 80) votingLabel = 'High-fidelity contributor'
  else if (totalWeight >= 40) votingLabel = 'Active contributor'

  return {
    basePoints,
    cityLabsMultiplier,
    tiptraqMultiplier,
    totalWeight,
    votingLabel,
  }
}
