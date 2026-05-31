import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import {
  ZEITGEber_DARKNESS_OFFSET,
  ZEITGEber_FOOD_OFFSET,
  ZEITGEber_LIGHT_START_OFFSET,
  ZEITGEber_MOVEMENT_OFFSET,
  normalizeMinutesFromMidnight,
} from '@/lib/dlmo'
import {
  approximateEarliestOutdoorLightMinutes,
  resolvePatientTimeZone,
} from '@/lib/patient/timezone'
import {
  formatMinutesLabel,
  parseDbTimeToMinutes,
  parseTimeToMinutes,
} from '@/lib/dashboard/time-utils'

export type RiskSeverity = 'watch' | 'moderate' | 'act'

export type CircadianRiskFlag = {
  id: string
  headline: string
  summary: string
  severity: RiskSeverity
}

export type ZeitgeberCard = {
  id: 'light' | 'food' | 'movement' | 'darkness'
  title: string
  timeLabel: string
  instruction: string
  bgClass: string
  imageUrl: string
  imageAlt: string
}

export type InsightsData = {
  hasTipTraqData: boolean
  dlmoTimeLabel: string
  riskFlags: CircadianRiskFlag[]
  zeitgebers: ZeitgeberCard[]
  canShareReport: boolean
}

type NightFlagsRow = {
  non_dipper_flag: boolean | null
  high_sympathetic_flag: boolean | null
  rem_delay_flag: boolean | null
  apnea_confound_flag: boolean | null
}

const SEVERITY_LABEL: Record<RiskSeverity, string> = {
  watch: 'Watch',
  moderate: 'Moderate',
  act: 'Act',
}

export function riskSeverityLabel(severity: RiskSeverity): string {
  return SEVERITY_LABEL[severity]
}

function resolveDlmoMinutes(
  profile: DlmoProfileRow | null,
  fallbackSleepTime: string
): number {
  // Prefer rolling wall-clock time — matches dashboard display and patient-local EDF parsing.
  const fromRolling = parseDbTimeToMinutes(profile?.proxy_dlmo_rolling ?? null)
  if (fromRolling !== null) return fromRolling

  if (profile?.proxy_dlmo_minutes_from_midnight != null) {
    return normalizeMinutesFromMidnight(profile.proxy_dlmo_minutes_from_midnight)
  }

  const sleepMinutes = parseTimeToMinutes(fallbackSleepTime) ?? 23 * 60
  return normalizeMinutesFromMidnight(sleepMinutes - 120)
}

function addMinutes(minutes: number, offset: number): number {
  return normalizeMinutesFromMidnight(minutes + offset)
}

function clampMorningMinutes(minutes: number, earliestLightMinutes: number): number {
  const normalized = normalizeMinutesFromMidnight(minutes)
  if (normalized < 10 * 60 && normalized < earliestLightMinutes) {
    return earliestLightMinutes
  }
  return normalized
}

function formatClock(minutes: number): string {
  return formatMinutesLabel(minutes)
}

export function aggregateRiskFlags(nights: NightFlagsRow[]): CircadianRiskFlag[] {
  const raised = {
    apnea_confound: nights.some((n) => n.apnea_confound_flag),
    non_dipper: nights.some((n) => n.non_dipper_flag),
    high_sympathetic: nights.some((n) => n.high_sympathetic_flag),
    rem_delay: nights.some((n) => n.rem_delay_flag),
  }

  const flags: CircadianRiskFlag[] = []

  if (raised.apnea_confound) {
    flags.push({
      id: 'apnea_confound',
      headline: 'Sleep apnea may be skewing your clock signal',
      summary:
        'Repeated breathing interruptions can elevate night-time stress hormones and make DLMO harder to read reliably.',
      severity: 'act',
    })
  }

  if (raised.non_dipper) {
    flags.push({
      id: 'non_dipper',
      headline: 'Your blood pressure may not be dipping overnight',
      summary:
        'A flat night-time blood pressure pattern is linked to higher cardiovascular strain when the body clock is misaligned.',
      severity: 'moderate',
    })
  }

  if (raised.high_sympathetic) {
    flags.push({
      id: 'high_sympathetic',
      headline: 'Elevated sympathetic drive was detected at sleep onset',
      summary:
        'Higher fight-or-flight tone at bedtime can delay melatonin rise and push your clock later than intended.',
      severity: 'watch',
    })
  }

  if (raised.rem_delay) {
    flags.push({
      id: 'rem_delay',
      headline: 'First REM sleep arrived later than expected',
      summary:
        'Delayed REM entry often signals a body clock running behind schedule — worth watching as you add more nights.',
      severity: 'watch',
    })
  }

  return flags
}

function buildZeitgebers(
  dlmoMinutes: number,
  timeZone: string
): ZeitgeberCard[] {
  const earliestLight = approximateEarliestOutdoorLightMinutes(timeZone)

  const lightMinutes = clampMorningMinutes(
    addMinutes(dlmoMinutes, ZEITGEber_LIGHT_START_OFFSET),
    earliestLight
  )
  const foodMinutes = clampMorningMinutes(addMinutes(dlmoMinutes, ZEITGEber_FOOD_OFFSET), earliestLight)
  const movementMinutes = addMinutes(dlmoMinutes, ZEITGEber_MOVEMENT_OFFSET)
  const darknessMinutes = addMinutes(dlmoMinutes, ZEITGEber_DARKNESS_OFFSET)

  return [
    {
      id: 'light',
      title: 'Light',
      timeLabel: formatClock(lightMinutes),
      instruction: 'Get bright outdoor light for 20–30 minutes — the strongest signal to anchor your clock.',
      bgClass: 'bg-[#FDF6E8]',
      imageUrl:
        'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&q=80',
      imageAlt: 'Morning sunlight through a window',
    },
    {
      id: 'food',
      title: 'Food',
      timeLabel: formatClock(foodMinutes),
      instruction: 'Eat your first substantial meal in this window to synchronise metabolic rhythm with your clock.',
      bgClass: 'bg-[#EDE8F7]/60',
      imageUrl:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
      imageAlt: 'Whole food meal in natural light',
    },
    {
      id: 'movement',
      title: 'Movement',
      timeLabel: formatClock(movementMinutes),
      instruction: 'Light-to-moderate activity here supports glucose control and deepens sleep the following night.',
      bgClass: 'bg-[#E8F5F0]',
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80',
      imageAlt: 'Person exercising outdoors at dawn',
    },
    {
      id: 'darkness',
      title: 'Darkness',
      timeLabel: formatClock(darknessMinutes),
      instruction: 'Dim screens and warm, low light from here — protect rising melatonin before sleep.',
      bgClass: 'bg-[#3B1F35]',
      imageUrl: '/insights-darkness-cue.jpg',
      imageAlt: 'Soft evening lamp light in a dark room',
    },
  ]
}

export function buildInsightsData(input: {
  profile: DlmoProfileRow | null
  nights: NightFlagsRow[]
  nightsCount: number
  fallbackSleepTime: string
  locationCity?: string | null
  locationCountry?: string | null
}): InsightsData {
  const hasTipTraqData = input.nightsCount > 0
  const timeZone = resolvePatientTimeZone(input.locationCity, input.locationCountry)
  const dlmoMinutes = resolveDlmoMinutes(input.profile, input.fallbackSleepTime)
  const dlmoTimeLabel = formatClock(dlmoMinutes)

  return {
    hasTipTraqData,
    dlmoTimeLabel,
    riskFlags: hasTipTraqData ? aggregateRiskFlags(input.nights) : [],
    zeitgebers: buildZeitgebers(dlmoMinutes, timeZone),
    canShareReport: hasTipTraqData,
  }
}
