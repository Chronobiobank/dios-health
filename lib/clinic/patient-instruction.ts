import type { DemoPatientInsight, DemoPatientTwin } from '@/lib/clinic/demo-patient-twin'
import { getSortedInsights } from '@/lib/clinic/demo-patient-twin'

export function getPrimaryInsight(patient: DemoPatientTwin): DemoPatientInsight {
  return getSortedInsights(patient)[0]
}

function extractRecommendedTime(recommendation: string): string {
  const match = recommendation.match(/\(([^)]+)\)/)
  return match?.[1] ?? recommendation
}

export function buildPatientInstruction(params: {
  patientName: string
  insight: DemoPatientInsight
  clinicianName: string
  date?: Date
}): string {
  const { patientName, insight, clinicianName } = params
  const date = params.date ?? new Date()
  const time = extractRecommendedTime(insight.diosRecommendation)
  const reason = insight.body.split('.')[0]?.trim() ?? insight.body

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `${patientName}, based on your body clock data, ${insight.drugName} works best when taken at ${time}. This is because ${reason}. Your GP has reviewed and confirmed this timing recommendation.\n— Dr ${clinicianName}, ${formattedDate}`
}

export function formatConsultFinding(insight: DemoPatientInsight): string {
  return insight.headline.endsWith('.') ? insight.headline : `${insight.headline}.`
}

export function formatConsultRecommendation(insight: DemoPatientInsight): string {
  const time = extractRecommendedTime(insight.diosRecommendation)
  return `Take ${insight.drugName} at ${time}.`
}
