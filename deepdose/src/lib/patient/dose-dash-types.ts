import type { ZeitgeberId } from '@/lib/chronobiology/zeitgebers'

export type RiskSeverity = 'low' | 'watch' | 'action'

export type MetabolicRiskSignal = {
  id: 'sleep-apnoea' | 'clock-drift' | 'metabolic-rhythm'
  label: string
  severity: RiskSeverity
  headline: string
  detail: string
}

export type PatientNextStep = {
  id: string
  title: string
  detail: string
}

export type DoseCluster = {
  id: ZeitgeberId
  label: string
  timeLabel: string
  activeNow: boolean
  summary: string
  detail: string
}

export type DoseDashModel = {
  dlmoLabel: string
  clockDriftMinutes: number | null
  tiptraqNights: number
  tiptraqComplete: boolean
  triageLabel: 'On track' | 'Needs attention' | 'Review soon'
  risks: MetabolicRiskSignal[]
  nextSteps: PatientNextStep[]
  clusters: DoseCluster[]
}
