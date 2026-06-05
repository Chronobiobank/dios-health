import type { PhoticDayPhase } from '@/lib/retinomic/types'
import {
  estimateBaselineAnchoredMelanopicLux,
  type PhoticDoseSource,
  photicDoseSourceCaption,
  resolvePhoticDoseSource,
} from '@/lib/retinomic/day-one-dashboard'
import { estimateMelanopicLuxToday, resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'
import type { HardwareBaseline, IrisPigment } from '@/src/types'

export type SmartphoneFeedSnapshot = {
  observedAt: string | null
  vdrDoseToday: number | null
  outdoorLightBefore10am: boolean | null
  confidenceScore: number | null
}

export type LiveMluxFeedInput = {
  melanopicLuxCeiling: number
  photicPhase: PhoticDayPhase
  mluxScore: number | null
  smartphoneFeed: SmartphoneFeedSnapshot | null
  smartphoneActive: boolean
  hardwareBaseline: HardwareBaseline | null
  now?: Date
}

export type LiveMluxFeed = {
  melanopicLuxToday: number
  source: PhoticDoseSource
  caption: string
  confidenceLabel: string | null
  lastUpdatedLabel: string | null
  vdrDoseToday: number | null
  isLive: boolean
}

type SensorPayload = {
  vdr_dose_today?: number | null
  outdoor_light_before_10am?: boolean | null
}

export function parseSmartphoneSensorPayload(payload: unknown): {
  vdrDoseToday: number | null
  outdoorLightBefore10am: boolean | null
} {
  if (!payload || typeof payload !== 'object') {
    return { vdrDoseToday: null, outdoorLightBefore10am: null }
  }
  const row = payload as SensorPayload
  const vdr =
    typeof row.vdr_dose_today === 'number' && !Number.isNaN(row.vdr_dose_today)
      ? row.vdr_dose_today
      : null
  const outdoor =
    typeof row.outdoor_light_before_10am === 'boolean' ? row.outdoor_light_before_10am : null
  return { vdrDoseToday: vdr, outdoorLightBefore10am: outdoor }
}

/** Initial VDR estimate when seeding phone feed from onboarding baseline */
export function estimateInitialVdrFromBaseline(
  irisPigment: IrisPigment,
  phase: PhoticDayPhase = resolvePhoticDayPhase(),
  now = new Date()
): number {
  const hour = now.getHours()
  const lightIris = irisPigment === 'LIGHT'
  let dose = lightIris ? 32 : 42

  if (phase === 'morning' && hour < 11) {
    dose += lightIris ? 18 : 12
  } else if (phase === 'midday') {
    dose += 28
  } else if (phase === 'evening') {
    dose = Math.max(14, dose - 18)
  }

  return Math.min(88, Math.max(12, Math.round(dose)))
}

function circadianTimeFactor(phase: PhoticDayPhase, now: Date): number {
  const hour = now.getHours() + now.getMinutes() / 60
  if (phase === 'morning') {
    return 0.82 + Math.min(0.28, Math.max(0, (hour - 5) / 7) * 0.28)
  }
  if (phase === 'midday') {
    return 1.02 + Math.sin(((hour - 11) / 5) * Math.PI) * 0.12
  }
  return Math.max(0.45, 0.72 - Math.max(0, hour - 16) * 0.04)
}

/** Map phone VDR dose (0–100) to live melanopic lux, modulated by time of day */
export function vdrDoseToMelanopicLux(
  vdrDose: number,
  ceiling: number,
  phase: PhoticDayPhase,
  now = new Date()
): number {
  const doseRatio = Math.min(1, Math.max(0.06, vdrDose / 100))
  const timeFactor = circadianTimeFactor(phase, now)
  return Math.round(ceiling * doseRatio * timeFactor * 0.78)
}

function formatLastUpdated(observedAt: string | null, now = new Date()): string | null {
  if (!observedAt) return null
  const observed = new Date(observedAt)
  if (Number.isNaN(observed.getTime())) return null

  const diffMs = now.getTime() - observed.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 2) return 'Updated just now'
  if (diffMin < 60) return `Updated ${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `Updated ${diffHr}h ago`
  return `Updated ${observed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
}

export function resolveLiveMluxFeed(input: LiveMluxFeedInput): LiveMluxFeed {
  const now = input.now ?? new Date()
  const hasBaseline = input.hardwareBaseline != null
  const source = resolvePhoticDoseSource(
    input.mluxScore,
    input.smartphoneActive,
    hasBaseline
  )

  const vdrFromFeed = input.smartphoneFeed?.vdrDoseToday ?? null
  let melanopicLuxToday = estimateMelanopicLuxToday(
    input.smartphoneActive,
    input.mluxScore,
    input.photicPhase
  )
  let isLive = false
  let confidenceLabel: string | null = null

  if (input.mluxScore != null) {
    melanopicLuxToday = estimateMelanopicLuxToday(false, input.mluxScore, input.photicPhase)
    isLive = true
    confidenceLabel = 'mLux profile'
  } else if (vdrFromFeed != null && input.smartphoneActive) {
    melanopicLuxToday = vdrDoseToMelanopicLux(
      vdrFromFeed,
      input.melanopicLuxCeiling,
      input.photicPhase,
      now
    )
    isLive = true
    const conf = input.smartphoneFeed?.confidenceScore
    confidenceLabel =
      conf != null ? `Phone feed · ${conf}% confidence` : 'Phone sensor feed'
  } else if (source === 'baseline' && input.hardwareBaseline) {
    melanopicLuxToday = estimateBaselineAnchoredMelanopicLux(
      input.melanopicLuxCeiling,
      input.hardwareBaseline.irisPigment,
      input.hardwareBaseline.skinITA,
      input.photicPhase
    )
  }

  let caption = photicDoseSourceCaption(source)
  if (isLive && source === 'phone') {
    caption = 'Live phone sensor feed'
  }

  return {
    melanopicLuxToday,
    source: isLive && source === 'baseline' ? 'phone' : source,
    caption,
    confidenceLabel,
    lastUpdatedLabel: isLive ? formatLastUpdated(input.smartphoneFeed?.observedAt ?? null, now) : null,
    vdrDoseToday: vdrFromFeed,
    isLive,
  }
}
