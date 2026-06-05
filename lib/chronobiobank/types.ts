export type ChronobiobankConsentDimension =
  | 'academic_research'
  | 'pharma_discovery'
  | 'ai_training'
  | 'open_source_challenges'

export type ChronobiobankConsentState = {
  academicResearch: boolean
  pharmaDiscovery: boolean
  aiTraining: boolean
  openSourceChallenges: boolean
  consentVersion: string
  updatedAt: string
}

export type GovernanceContributions = {
  /** Days with at least one First Light / smartphone observation */
  firstLightScanDays: number
  hasVerifiedCityLabsPanel: boolean
  tiptraqNightsContributed: number
}

export type GovernanceWeightBreakdown = {
  basePoints: number
  cityLabsMultiplier: number
  tiptraqMultiplier: number
  totalWeight: number
  votingLabel: string
}
