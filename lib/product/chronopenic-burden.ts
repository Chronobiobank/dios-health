import { CHRONOPENIC_BURDEN } from '@/lib/product/dose-intelligence-model'

export type BurdenTrendDirection = 'improving' | 'stable' | 'worsening'

/** Layer-1 estimate: gap in years → 0–100 score (refined when L2/L3 data exists). */
export function chronopenicBurdenScoreFromGapYears(gapYears: number): number {
  const gap = Math.max(0, gapYears)
  const raw = (gap / CHRONOPENIC_BURDEN.maxGapYearsLayer1) * CHRONOPENIC_BURDEN.max
  return Math.min(CHRONOPENIC_BURDEN.max, Math.max(CHRONOPENIC_BURDEN.min, Math.round(raw)))
}

export function photonicAgeFromCalendarAndGap(calendarAge: number, gapYears: number): number {
  return Math.round((calendarAge + Math.max(0, gapYears)) * 10) / 10
}

export function chronopenicBurdenYears(calendarAge: number, photonicAge: number): number {
  return Math.max(0, Math.round((photonicAge - calendarAge) * 10) / 10)
}

export function chronopenicBurdenLabel(years: number): string {
  const n = Math.round(years * 10) / 10
  const unit = n === 1 ? 'year' : 'years'
  return `${n} ${unit} chronopenic burden`
}

export function burdenTrendLabel(direction: BurdenTrendDirection | null): string {
  switch (direction) {
    case 'improving':
      return 'Burden trending down'
    case 'worsening':
      return 'Burden trending up'
    default:
      return 'Burden stable'
  }
}
