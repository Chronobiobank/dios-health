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

export type SpectrumSeverity = 'weak' | 'mild' | 'moderate' | 'severe'

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

export type SnapshotStatNotes = {
  darkYearsHours: string
  lightAlignment: string
  clockDrift: string
}

export type NextStepPriority = 'tonight' | 'this-week'

export type PatientNextStep = {
  id: string
  priority: NextStepPriority
  title: string
  detail: string
  href?: string
  prompt?: string
}

export type PatientNextSteps = {
  summary: string
  steps: PatientNextStep[]
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
  /** Explanations under Dark Years / Light alignment / Clock drift stat pills. */
  statNotes: SnapshotStatNotes
  medications: Medication[]
  medicationsDueTonight: number
  bloodPanel: BloodPanel
  tiptraqSummary: TiptraqSummary
  measureTiles: MeasureTileData[]
  completenessGaps: number
  coachOnline: boolean
  spectrumNodes: SpectrumNode[]
  nextSteps: PatientNextSteps
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
