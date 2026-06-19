/** Clinical traffic-light bands for TipTraQ readouts. */

export type ClinicalMetricStatus = 'green' | 'amber' | 'red'

export function ahiSeverity(ahi: number): string {
  if (ahi < 5) return 'Normal'
  if (ahi < 15) return 'Mild OSA'
  if (ahi < 30) return 'Moderate OSA'
  return 'Severe OSA'
}

export function ahiStatus(ahi: number): ClinicalMetricStatus {
  if (ahi < 5) return 'green'
  if (ahi < 15) return 'amber'
  return 'red'
}

export function sleepEfficiencyStatus(pct: number): ClinicalMetricStatus {
  if (pct >= 85) return 'green'
  if (pct >= 75) return 'amber'
  return 'red'
}

export function remLatencyStatus(mins: number): ClinicalMetricStatus {
  if (mins <= 90) return 'green'
  if (mins <= 120) return 'amber'
  return 'red'
}

export function spo2Status(minSpo2: number | null | undefined): ClinicalMetricStatus {
  if (minSpo2 == null) return 'amber'
  if (minSpo2 >= 90) return 'green'
  if (minSpo2 >= 85) return 'amber'
  return 'red'
}

export function confidenceFromNights(nights: number, required = 3): {
  score: number
  label: string
} {
  if (nights >= required) return { score: 88, label: 'Clinical baseline' }
  if (nights === 2) return { score: 62, label: 'Partial block' }
  if (nights === 1) return { score: 38, label: 'Single night' }
  return { score: 0, label: 'No nights' }
}
