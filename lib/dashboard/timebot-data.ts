import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { resolveTimebotDlmoMinutes } from '@/lib/dashboard/timebot-supplements'
import { formatMinutesLabel, parseDbTimeToMinutes } from '@/lib/dashboard/time-utils'
import {
  ZEITGEber_DARKNESS_OFFSET,
  ZEITGEber_FOOD_OFFSET,
  ZEITGEber_LIGHT_END_OFFSET,
  ZEITGEber_LIGHT_START_OFFSET,
  ZEITGEber_MOVEMENT_OFFSET,
  normalizeMinutesFromMidnight,
} from '@/lib/dlmo'
import {
  approximateEarliestOutdoorLightMinutes,
  dateToLocalClock,
  resolvePatientTimeZone,
} from '@/lib/patient/timezone'

export type ScheduleStatus = 'upcoming' | 'now' | 'done'

export type TimebotScheduleItem = {
  id: string
  kind: 'medication' | 'cue'
  label: string
  timeLabel: string
  minutes: number
  endMinutes?: number
  status: ScheduleStatus
  detail?: string
}

export type TimebotData = {
  hasDlmoData: boolean
  dlmoEstimated: boolean
  firstName: string
  dlmoTimeLabel: string
  chronotype: string | null
  confidenceLabel: string | null
  currentSupplements: string[]
  items: TimebotScheduleItem[]
}

const MEDICATIONS = [
  { key: 'simvastatin_optimal_time', label: 'Simvastatin' },
  { key: 'ramipril_optimal_time', label: 'Ramipril' },
  { key: 'prednisolone_optimal_time', label: 'Prednisolone' },
  { key: 'salmeterol_optimal_time', label: 'Salmeterol' },
] as const

function getNowMinutesInTimeZone(timeZone: string, now = new Date()): number {
  const clock = dateToLocalClock(now, timeZone)
  const [hours, minutes] = clock.split(':').map(Number)
  return hours * 60 + minutes
}

function clampMorningMinutes(minutes: number, earliestLightMinutes: number): number {
  const normalized = normalizeMinutesFromMidnight(minutes)
  if (normalized < 10 * 60 && normalized < earliestLightMinutes) {
    return earliestLightMinutes
  }
  return normalized
}

function addMinutes(minutes: number, offset: number): number {
  return normalizeMinutesFromMidnight(minutes + offset)
}

function formatRange(startMinutes: number, endMinutes: number): string {
  return `${formatMinutesLabel(startMinutes)} – ${formatMinutesLabel(endMinutes)}`
}

/** Point event: Now = ±30 min around target; Done = past window. */
export function resolvePointStatus(
  targetMinutes: number,
  nowMinutes: number,
  windowHalfWidth = 30
): ScheduleStatus {
  const target = normalizeMinutesFromMidnight(targetMinutes)
  const now = normalizeMinutesFromMidnight(nowMinutes)

  let diff = target - now
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440

  if (diff > windowHalfWidth) return 'upcoming'
  if (diff >= -windowHalfWidth) return 'now'
  return 'done'
}

/** Range event: Now if inside range; Done if past end; else Upcoming. */
function resolveRangeStatus(
  startMinutes: number,
  endMinutes: number,
  nowMinutes: number
): ScheduleStatus {
  const start = normalizeMinutesFromMidnight(startMinutes)
  const end = normalizeMinutesFromMidnight(endMinutes)
  const now = normalizeMinutesFromMidnight(nowMinutes)

  if (start <= end) {
    if (now < start) return 'upcoming'
    if (now <= end) return 'now'
    return 'done'
  }

  // Range crosses midnight
  if (now >= start || now <= end) return 'now'
  if (now > end && now < start) return 'upcoming'
  return 'done'
}

export function buildTimebotData(input: {
  profile: DlmoProfileRow | null
  hasTipTraqData: boolean
  firstName: string
  locationCity?: string | null
  locationCountry?: string | null
  fallbackSleepTime?: string
  currentSupplements?: string[]
  now?: Date
}): TimebotData {
  const { minutes: dlmoMinutes, estimated: dlmoEstimated } = resolveTimebotDlmoMinutes(
    input.profile,
    input.fallbackSleepTime ?? '11:00pm'
  )

  const dlmoTimeLabel = dlmoEstimated
    ? `${formatMinutesLabel(dlmoMinutes)} (ESTIMATED)`
    : formatMinutesLabel(dlmoMinutes)

  const emptyBase: TimebotData = {
    hasDlmoData: true,
    dlmoEstimated,
    firstName: input.firstName,
    dlmoTimeLabel,
    chronotype: input.profile?.chronotype ?? null,
    confidenceLabel: input.profile?.confidence_label ?? null,
    currentSupplements: input.currentSupplements ?? [],
    items: [],
  }

  if (!input.profile) {
    return emptyBase
  }

  const timeZone = resolvePatientTimeZone(input.locationCity, input.locationCountry)
  const nowMinutes = getNowMinutesInTimeZone(timeZone, input.now)
  const earliestLight = approximateEarliestOutdoorLightMinutes(timeZone)

  const lightStart =
    parseDbTimeToMinutes(input.profile.light_dose_window_start) ??
    clampMorningMinutes(addMinutes(dlmoMinutes, ZEITGEber_LIGHT_START_OFFSET), earliestLight)
  const lightEnd =
    parseDbTimeToMinutes(input.profile.light_dose_window_end) ??
    addMinutes(dlmoMinutes, ZEITGEber_LIGHT_END_OFFSET)
  const foodMinutes = clampMorningMinutes(addMinutes(dlmoMinutes, ZEITGEber_FOOD_OFFSET), earliestLight)
  const movementMinutes = addMinutes(dlmoMinutes, ZEITGEber_MOVEMENT_OFFSET)
  const darknessMinutes = addMinutes(dlmoMinutes, ZEITGEber_DARKNESS_OFFSET)

  const medications: TimebotScheduleItem[] = MEDICATIONS.flatMap(({ key, label }) => {
    const minutes = parseDbTimeToMinutes(input.profile![key as keyof DlmoProfileRow] as string | null)
    if (minutes === null) return []
    return [
      {
        id: `med-${key}`,
        kind: 'medication' as const,
        label,
        timeLabel: formatMinutesLabel(minutes),
        minutes,
        status: resolvePointStatus(minutes, nowMinutes),
      },
    ]
  })

  const cues: TimebotScheduleItem[] = [
    {
      id: 'cue-light',
      kind: 'cue',
      label: 'Light exposure',
      timeLabel: formatRange(lightStart, lightEnd),
      minutes: lightStart,
      endMinutes: lightEnd,
      status: resolveRangeStatus(lightStart, lightEnd, nowMinutes),
      detail: 'Bright outdoor light anchors your clock.',
    },
    {
      id: 'cue-food',
      kind: 'cue',
      label: 'Meal timing',
      timeLabel: formatMinutesLabel(foodMinutes),
      minutes: foodMinutes,
      status: resolvePointStatus(foodMinutes, nowMinutes, 45),
      detail: 'First substantial meal in this window.',
    },
    {
      id: 'cue-movement',
      kind: 'cue',
      label: 'Movement',
      timeLabel: formatMinutesLabel(movementMinutes),
      minutes: movementMinutes,
      status: resolvePointStatus(movementMinutes, nowMinutes, 45),
      detail: 'Light-to-moderate activity supports sleep tonight.',
    },
    {
      id: 'cue-darkness',
      kind: 'cue',
      label: 'Light curfew',
      timeLabel: formatMinutesLabel(darknessMinutes),
      minutes: darknessMinutes,
      status: resolvePointStatus(darknessMinutes, nowMinutes, 60),
      detail: 'Dim screens and warm light from here.',
    },
  ]

  const items = [...medications, ...cues].sort((a, b) => {
    const aMin = normalizeMinutesFromMidnight(a.minutes)
    const bMin = normalizeMinutesFromMidnight(b.minutes)
    return aMin - bMin
  })

  return {
    hasDlmoData: true,
    dlmoEstimated,
    firstName: input.firstName,
    dlmoTimeLabel,
    chronotype: input.profile.chronotype,
    confidenceLabel: input.profile.confidence_label,
    currentSupplements: input.currentSupplements ?? [],
    items,
  }
}

export function buildTimebotContext(
  profile: DlmoProfileRow | null,
  data: TimebotData,
  supplementContext?: string
): string {
  const medLines = data.items
    .filter((item) => item.kind === 'medication')
    .map((item) => `- ${item.label}: ${item.timeLabel} (${item.status})`)
    .join('\n')

  const cueLines = data.items
    .filter((item) => item.kind === 'cue')
    .map((item) => `- ${item.label}: ${item.timeLabel} (${item.status})`)
    .join('\n')

  const profileBlock = profile
    ? `- Confidence: ${data.confidenceLabel ?? 'unknown'} (${profile.confidence_score ?? 'n/a'}%)
- Nights uploaded: ${profile.nights_count ?? 0}`
    : '- No dlmo_profiles row yet (using questionnaire estimate)'

  const supplementBlock = supplementContext
    ? `\n\n${supplementContext}`
    : data.currentSupplements.length > 0
      ? `\n\nCurrent supplements on profile: ${data.currentSupplements.join(', ')}`
      : ''

  return `Patient DLMO profile:
- Proxy DLMO: ${data.dlmoTimeLabel}${data.dlmoEstimated ? ' — ESTIMATED from chronotype questionnaire' : ''}
- Chronotype: ${data.chronotype ?? 'unknown'}
${profileBlock}

Today's medication windows:
${medLines || '- none calculated (TipTraQ refines these)'}

Today's cue schedule:
${cueLines || '- none calculated yet'}${supplementBlock}`
}
