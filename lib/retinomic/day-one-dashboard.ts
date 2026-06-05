import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import type { BaselineScanSummary } from '@/lib/retinomic/baseline-scan-summary'
import type { PhoticDayPhase, RetinomicTier } from '@/lib/retinomic/types'
import type { IrisPigment } from '@/src/types'
import type { DailyIntervention } from '@/src/lib/engine/types'

export const DAY_ONE_LOCKED_COPY = {
  blood: {
    title: 'Gominak blood panel',
    body: 'Unlocks if DIOS flags elevated metabolic risk — not required on day one.',
    cta: 'When labs unlock',
  },
  sleep: {
    title: 'Overnight sleep check',
    body: 'TipTraQ verification unlocks if DIOS flags circadian risk — your eye baseline is enough to start.',
    cta: 'About TipTraQ',
    href: '/tiptraq',
  },
} as const

export type PhoticDoseSource = 'mlux' | 'phone' | 'baseline'

/** Morning melanopic minutes tuned to iris + skin ITA from onboarding scan */
export function morningMluxMinutesFromBaseline(irisPigment: IrisPigment, skinITA: number): number {
  const base = irisPigment === 'LIGHT' ? 110 : 90
  const itaAdjust = skinITA > 45 ? 15 : skinITA < 32 ? -10 : 0
  return Math.max(60, Math.min(150, base + itaAdjust))
}

/** Day-1 light dose when no phone feed or mLux profile exists yet */
export function estimateBaselineAnchoredMelanopicLux(
  melanopicLuxCeiling: number,
  irisPigment: IrisPigment,
  skinITA: number,
  phase: PhoticDayPhase
): number {
  const irisFactor = irisPigment === 'LIGHT' ? 0.42 : 0.3
  const itaFactor = Math.min(0.1, Math.max(-0.05, (skinITA - 36) / 120))
  const phaseBoost = phase === 'morning' ? 1.12 : phase === 'midday' ? 1.22 : 0.88
  return Math.round(melanopicLuxCeiling * (irisFactor + itaFactor) * phaseBoost)
}

export function resolvePhoticDoseSource(
  mluxScore: number | null,
  smartphoneActive: boolean,
  hasBaseline: boolean
): PhoticDoseSource {
  if (mluxScore != null) return 'mlux'
  if (smartphoneActive) return 'phone'
  if (hasBaseline) return 'baseline'
  return 'baseline'
}

export function photicDoseSourceCaption(source: PhoticDoseSource): string {
  switch (source) {
    case 'mlux':
      return 'Live mLux profile'
    case 'phone':
      return 'Phone sensor feed'
    case 'baseline':
      return 'Anchored from your eye scan'
  }
}

export function dayOneInterventionIntro(
  baseline: BaselineScanSummary,
  photicSource: PhoticDoseSource = 'baseline'
): string {
  const iris = baseline.irisPigment === 'LIGHT' ? 'light iris' : 'dark iris'
  if (photicSource === 'phone' || photicSource === 'mlux') {
    return `Your ${iris} scan set the dose ceiling in ${baseline.locationLabel}. Your phone feed is updating today's light dose live. Blood and sleep panels stay closed unless DIOS flags risk.`
  }
  return `Your ${iris} scan (ITA ${baseline.skinITA}°) anchors today's light dose in ${baseline.locationLabel}. Blood and sleep panels stay closed unless DIOS flags risk.`
}

export function tailorDailyInterventionForBaseline(
  intervention: DailyIntervention,
  baseline: BaselineScanSummary,
  tier: RetinomicTier,
  morningMluxMinutes: number,
  photicSource: PhoticDoseSource = 'baseline',
  options?: { returnVisit?: boolean; feedFreshness?: FeedFreshness }
): DailyIntervention {
  if (tier !== 'FREE_SCREENING') return intervention

  const irisLabel = baseline.irisPigment === 'LIGHT' ? 'light iris' : 'dark iris'
  const returnVisit = options?.returnVisit ?? false
  const feedFreshness = options?.feedFreshness ?? 'none'
  const flags = intervention.clinicalFlags.includes('Eye baseline live')
    ? intervention.clinicalFlags
    : ['Eye baseline live', ...intervention.clinicalFlags]

  const tasks = intervention.tasks.map((task) => {
    if (task.id === 'photic-anchor') {
      const phoneLive = photicSource === 'phone' || photicSource === 'mlux'
      let directive: string

      if (returnVisit && (feedFreshness === 'stale' || feedFreshness === 'none')) {
        directive = `Light check-in due — ${morningMluxMinutes} min melanopic anchor still applies. Run the quick check-in on your light panel to refresh today's ring; your scan (${irisLabel}) holds the ceiling until then.`
      } else if (returnVisit && feedFreshness === 'aging') {
        directive = `Phone feed aging — ${morningMluxMinutes} min morning anchor, then refresh your check-in on the light panel to keep dose current through the day.`
      } else if (phoneLive) {
        directive = `Phone feed live — ${morningMluxMinutes} min of 480nm melanopic light before first bite. Your scan (${irisLabel}, ITA ${baseline.skinITA}°) sets the ceiling; the sensor stream updates dose through the day.`
      } else {
        directive = `From your scan (${irisLabel}, ITA ${baseline.skinITA}°): ${morningMluxMinutes} min of 480nm melanopic light before first bite. This sets your dose window until your phone feed connects.`
      }

      return {
        ...task,
        title: returnVisit ? 'Keep photic dose current' : 'Morning photic anchor',
        directive,
        priority: returnVisit && feedFreshness === 'stale' ? ('required' as const) : task.priority,
      }
    }
    if (task.pillar === 'fuel') {
      return {
        ...task,
        priority: 'verify' as const,
        directive: `${task.directive} Gominak panel unlocks if DIOS flags metabolic risk.`,
      }
    }
    if (task.pillar === 'telemetry') {
      return {
        ...task,
        priority: 'verify' as const,
        directive: `${task.directive} Overnight sleep check unlocks if DIOS flags circadian strain.`,
      }
    }
    return task
  })

  return { ...intervention, tasks, clinicalFlags: flags }
}
