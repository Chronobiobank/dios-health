import type { SriTone } from '@/lib/unmed/product-philosophy'

export type SriDial = {
  label: string
  value: number | null
  tone: SriTone
}

export type TipTraqMetric = {
  label: string
  value: string
  status: string
  tone: SriTone
}

export type LabBiomarkerRow = {
  name: string
  value: string
  state: string
  tone: SriTone
}

export type TriFocalStatusModel = {
  federatedId: string
  syncLocked: boolean
  sriDials: SriDial[]
  sriNote: string
  tiptraqMetrics: TipTraqMetric[]
  tiptraqPending: boolean
  labRows: LabBiomarkerRow[]
  labPending: boolean
}
