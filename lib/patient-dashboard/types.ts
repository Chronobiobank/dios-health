export type MedicationStatus = 'taken' | 'tonight' | 'upcoming'

export type Medication = {
  name: string
  dose: string
  time: string
  reason: string
  status: MedicationStatus
  colour: string
}

export type BloodPanel = {
  vitaminDLabel: string
  vitaminDValue: string | null
  vdrFlagUnresolved: boolean
  collectedAt: string | null
}

export type TiptraqSummary = {
  sleepOnsetDelayMinutes: number
  qualityLabel: string
  darkYearsHours: number
  lastStudyDate: string | null
}

export type SpectrumSeverity = 'normal' | 'watch' | 'elevated' | 'high' | 'critical'

export type SpectrumNodeId =
  | 'sleep-rhythm'
  | 'sleep-apnoea'
  | 'blood-sugar'
  | 'blood-pressure'
  | 'immune-system'
  | 'brain-health'
  | 'cancer-risk'

export type SpectrumNode = {
  id: SpectrumNodeId
  label: string
  score: number
  severity: SpectrumSeverity
  reason: string
  action: string
}

export type DashboardPanelId =
  | 'snapshot'
  | 'calibration'
  | 'coach'
  | 'meds'
  | 'sleep'
  | 'vitd'
  | 'tiptraq'
  | 'completeness'
  | SpectrumNodeId

export type MeasureTileData = {
  id: 'sleep' | 'vitd' | 'tiptraq' | 'completeness'
  value: string
  label: string
  subtitle: string
  badge: string
  badgeTone: 'watch' | 'act' | 'study' | 'action'
  source: string
  panelRows: { key: string; value: string }[]
  panelActions: { label: string; prompt?: string; opensCoach?: boolean }[]
}

export type PatientSnapshot = {
  chronologicalAge: number
  chronosomaticAge: number
  darkYears: number
  recoveryYears: number
  darkYearsHours: number
  lightAlignment: number
  clockDrift: number
  dlmoEstimate: string
  medications: Medication[]
  medicationsDueTonight: number
  bloodPanel: BloodPanel
  tiptraqSummary: TiptraqSummary
  measureTiles: MeasureTileData[]
  completenessGaps: number
  coachOnline: boolean
  spectrumNodes: SpectrumNode[]
  fitzpatrickType: string
  fitzpatrickLabel: string
  latitude: number
  locationName: string
  season: string
  solarZenith: number
  chronotype: string
  chronotypeSource: string
}

export type PatientDashboardProps = {
  greeting: string
  firstName: string
  fullName: string
  avatarUrl: string | null
  snapshot: PatientSnapshot
}
