import type { CalibrationGateStatus } from '@/lib/bodycloq/calibration-gate'
import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import type { FirstLightWindowStatus } from '@/lib/product/first-light-window'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import type { LightCheckInConfig } from '@/lib/retinomic/light-check-in'

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

export type EatingWindowSummary = {
  opens: string
  closes: string
}

export type DashboardPanelId =
  | 'body-clock'
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

/** Onboarding camera scan — feeds calibration, not a separate dashboard. */
export type RetinomicBaselineSummary = {
  irisLabel: string
  skinIta: number
}

export type BurdenTrendDirection = 'improving' | 'stable' | 'worsening'

export type CohortTriageStatus = 'red' | 'amber' | 'green'

export type ChronoimmuneLabPoint = {
  testDate: string
  serum25ohdNgMl: number | null
  pth: number
  serumCalcium: number
  urineCalcium24hrMg: number | null
  egfr: number | null
  doseIuAtTest: number
}

export type ChronoimmuneMicronutrientLog = {
  id: import('@/lib/chronoimmune/indication-zones').MicronutrientItemId
  logged: boolean
}

export type CalciumGateStatus = 'clear' | 'watch' | 'hold' | 'alert'

export type ChronoimmuneProfile = {
  recordId: string
  zoneId: import('@/lib/chronoimmune/indication-zones').ChronoimmuneZoneId
  indicationLabel: string
  /** Additional branch indications — same patient, multiple branches. */
  secondaryIndicationLabels?: string[]
  /** Active nodes on the Circadian Desynchrony tree (diagnostic model). */
  activeDesynchronyNodeIds?: string[]
  /** Chronobiobank granular consent — visible to practitioner on patient record. */
  chronobiobankConsent?: import('@/lib/chronobiobank/types').ChronobiobankConsentState
  /** Governance voting weight from data fidelity contributions. */
  governanceWeight?: number
  bodyWeightKg: number
  currentDoseIu: number
  doseRangeMinIu: number
  doseRangeMaxIu: number
  iuPerKg: number
  pthReferenceLower: number
  pthReferenceUpper: number
  pthTargetCeiling: number
  pthFloorThreshold: number
  labHistory: ChronoimmuneLabPoint[]
  micronutrientLog: ChronoimmuneMicronutrientLog[]
  safetyGateLevel: 'passive' | 'active' | 'maximum'
  labReviewFrequency: string
  calciumCascade: {
    serumCalcium: CalciumGateStatus
    urineCalcium: CalciumGateStatus
    egfr: CalciumGateStatus
  }
  consentOnFile: boolean
  /** Separate from indication zone — triage is today's attention state. */
  cohortTriageStatus: CohortTriageStatus
  nextReviewDate: string
  titrationLocked: boolean
  lockReason: string | null
}

export type PatientSnapshot = {
  /** Memo: Calendar Age — years since birth */
  calendarAge: number
  /** Memo: Chronopathic Age — biological clock score from light, biochemistry, sleep */
  photonicAge: number
  /** Years between Chronopathic and Calendar Age */
  chronopenicBurdenYears: number
  /** 0–100 composite; Layer 1 uses gap estimate until L2/L3 refine */
  chronopenicBurdenScore: number
  /** BodycloQ circadian score — null until first TipTraQ night. */
  bodycloqScore: number | null
  bodycloqGate: CalibrationGateStatus
  bodycloqScoreLabel: string
  bodycloqProvisional: boolean
  bodycloqNightsRemaining: number
  burdenTrendDirection: BurdenTrendDirection | null
  recoveryYears: number
  darkYearsHours: number
  lightAlignment: number
  clockDrift: number
  dlmoEstimate: string
  /** Smartphone camera baseline when present */
  retinomicBaseline: RetinomicBaselineSummary | null
  /** Explanations under Dark Years / Light alignment / Clock drift stat pills. */
  statNotes: SnapshotStatNotes
  medications: Medication[]
  medicationsDueTonight: number
  /** Anchored to first light / morning scan */
  eatingWindow?: EatingWindowSummary | null
  bloodPanel: BloodPanel
  tiptraqSummary: TiptraqSummary
  measureTiles: MeasureTileData[]
  completenessGaps: number
  coachOnline: boolean
  spectrumNodes: SpectrumNode[]
  nextSteps: PatientNextSteps
  fitzpatrickType: string
  fitzpatrickLabel: string
  eyeColorLabel: string
  latitude: number
  locationName: string
  season: string
  solarZenith: number
  chronotype: string
  chronotypeSource: string
  /** Chronoimmune module — when present, indication spectrum replaces metabolic risk spectrum. */
  chronoimmuneProfile?: ChronoimmuneProfile | null
  /** Today's cohort triage — mirrors clinician view on the script hero. */
  patientTriageStatus?: CohortTriageStatus
}

export type PatientDashboardProps = {
  greeting: string
  firstName: string
  fullName: string
  avatarUrl: string | null
  snapshot: PatientSnapshot
  /** Inline light check-in when phone feed is stale */
  feedFreshness?: FeedFreshness
  lightCheckIn?: LightCheckInConfig | null
  /** Layer 1 First Light window status for morning scan CTA */
  firstLightWindow?: FirstLightWindowStatus | null
  /** Today's First Light session — hides CTA when complete */
  firstLightDailyStatus?: FirstLightDailyStatus | null
  /** Medication names confirmed via dose_events today */
  confirmedDosesToday?: string[]
}
