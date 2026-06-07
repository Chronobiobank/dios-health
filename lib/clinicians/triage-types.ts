export type TriageStatus = 'URGENT' | 'REVIEW' | 'ON_TRACK'

export type PatientProtocol = 'coimbra' | 'gominak' | 'circadian'

export type BtiConfidence = 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'

export type SpectrumCluster =
  | 'architect'
  | 'sensitiser'
  | 'modulator'
  | 'opportunist'
  | 'restorer'

export type SafetyGateStatus = 'CLEAR' | 'WARNING' | 'HOLD'

export type SafetyGateType = 'CALCIUM_CASCADE' | 'EGFR' | 'URINARY_CA' | 'HYDRATION'

export type CoachSessionType = 'ONBOARDING' | 'DAILY_CHECK' | 'LAB_REVIEW'

export type PthTrend = 'down' | 'up' | 'flat'

export type TriageBti = {
  clockTime: string
  biologicalTime: string
  delayMinutes: number
  confidence: BtiConfidence
  layer: string
  mluxPercent: number
}

export type TriageLabSnapshot = {
  pthPgMl: number
  vitaminDNmol: number
  sleepEfficiencyPct: number
  remLatencyMin: number
  ahi: number
  snsDominancePct: number
  wasoMin: number
}

export type TriageLabPoint = {
  drawnAt: string
  pthPgMl: number
}

export type TriageSafetyGate = {
  type: SafetyGateType
  status: SafetyGateStatus
}

export type TriageProtocolDrug = {
  name: string
  dose: string
  cluster: SpectrumCluster | null
  note?: string
}

export type TriageCoachSession = {
  type: CoachSessionType
  summary: string
  at: string
  durationSec: number
}

export type TriagePatient = {
  id: string
  ref: string
  name: string
  protocol: PatientProtocol
  enrolledAt: string
  consentChronobiobank: boolean
  is_premium_tier: boolean
  device_alert_triggered: boolean
  triageStatus: TriageStatus
  bti: TriageBti
  labs: TriageLabSnapshot
  pthHistory: TriageLabPoint[]
  pthTrend: PthTrend
  safetyGates: TriageSafetyGate[]
  nextLabDue: string
  protocolDrugs: TriageProtocolDrug[]
  nextAction: string
  coachSessions: TriageCoachSession[]
}
