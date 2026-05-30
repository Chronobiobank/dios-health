import { parseTimeToMinutes } from '@/lib/dashboard/time-utils'

export type SeededInsight = {
  headline: string
  body: string
  chronotypeLabel: string
  standardGuidance: string
  diosRecommendation: string
}

function wakeOffsetHours(wakeTime: string): number {
  const minutes = parseTimeToMinutes(wakeTime)
  if (minutes === null) return 0

  const baseline = 7 * 60
  return Math.round(((minutes - baseline) / 60) * 10) / 10
}

export function buildSeededInsight(
  chronotypeQ1: string,
  chronotypeQ2: string,
  chronotypeQ3: string
): SeededInsight {
  const wakeOffset = wakeOffsetHours(chronotypeQ1)
  const isEvening =
    chronotypeQ2.includes('Evening') || wakeOffset >= 1.5 || chronotypeQ3.startsWith('12:') || chronotypeQ3.startsWith('1:')
  const isMorning = chronotypeQ2.includes('Morning') || wakeOffset <= -1

  if (isEvening) {
    const hours = Math.max(1, Math.round(Math.abs(wakeOffset) || 2))
    return {
      chronotypeLabel: 'evening type',
      headline: 'You look like an evening type.',
      body: `Based on your answers, your body clock runs about ${hours} hour${hours === 1 ? '' : 's'} later than average. If you take any of the four DIOS medications, your timing window is different from standard guidance.`,
      standardGuidance: 'Morning dose',
      diosRecommendation: 'Evening dose (22:00)',
    }
  }

  if (isMorning) {
    const hours = Math.max(1, Math.round(Math.abs(wakeOffset) || 1))
    return {
      chronotypeLabel: 'morning type',
      headline: 'You look like a morning type.',
      body: `Based on your answers, your body clock runs about ${hours} hour${hours === 1 ? '' : 's'} earlier than average. If you take any of the four DIOS medications, your timing window is different from standard guidance.`,
      standardGuidance: 'Evening dose',
      diosRecommendation: 'Morning dose (07:00)',
    }
  }

  return {
    chronotypeLabel: 'standard chronotype',
    headline: 'Your body clock looks close to average.',
    body: 'Based on your answers, your timing window is near population norms. Connect TipTraQ to confirm whether any of the four DIOS medications need a personalised schedule.',
    standardGuidance: 'Standard timing',
    diosRecommendation: 'Personalised window',
  }
}
