import type { DlmoDominantLayer, DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import {
  CANONICAL_SUPPLEMENTS,
  SUPPLEMENT_OFFSET_MINUTES,
  SUPPLEMENT_SHORT_INSTRUCTIONS,
  type CanonicalSupplement,
} from '@/lib/dashboard/timebot-supplements'
import {
  formatMinutes24h,
  formatMinutesLabel,
  parseDbTimeToMinutes,
  parseTimeToMinutes,
} from '@/lib/dashboard/time-utils'
import { normalizeMinutesFromMidnight } from '@/lib/dlmo'
import {
  approximateEarliestOutdoorLightMinutes,
  dateToLocalClock,
  resolvePatientTimeZone,
} from '@/lib/patient/timezone'

export type ScheduleStatus = 'upcoming' | 'now' | 'done'

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

export function groupTimelineEvents(events: TimebotTimelineEvent[]): TimebotTimelineGroup[] {
  const sorted = [...events].sort((a, b) => a.minutes - b.minutes)
  const groups: TimebotTimelineGroup[] = []

  for (const event of sorted) {
    const last = groups[groups.length - 1]
    if (last && last.minutes === event.minutes) {
      last.events.push(event)
    } else {
      groups.push({
        minutes: event.minutes,
        timeDisplay: event.timeDisplay,
        events: [event],
      })
    }
  }

  return groups
}

export type TimebotPrecisionLabel = 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'

export type TimebotEventCategory =
  | 'Light'
  | 'Meal'
  | 'Movement'
  | 'Medication'
  | 'Supplement'
  | 'Darkness'

export type TimebotTimelineEvent = {
  id: string
  name: string
  minutes: number
  timeDisplay: string
  category: TimebotEventCategory
  instruction: string
  status: ScheduleStatus
}

export type TimebotTimelineGroup = {
  minutes: number
  timeDisplay: string
  events: TimebotTimelineEvent[]
}

type MedicationTimelineDef = {
  id: string
  name: string
  instruction: string
  profileTimeKey?: keyof Pick<
    DlmoProfileRow,
    'simvastatin_optimal_time' | 'ramipril_optimal_time' | 'prednisolone_optimal_time' | 'salmeterol_optimal_time'
  >
  estimatedOffsetMinutes?: number
}

const MEDICATION_TIMELINE: MedicationTimelineDef[] = [
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    instruction: 'Take at night with water',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    instruction: 'Take at night with water',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'ramipril',
    name: 'Ramipril',
    instruction: 'Take with water in the morning',
    profileTimeKey: 'ramipril_optimal_time',
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    instruction: 'Take with water in the morning',
    estimatedOffsetMinutes: 60,
  },
  {
    id: 'sertraline',
    name: 'Sertraline',
    instruction: 'Take with water in the morning',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'metformin',
    name: 'Metformin',
    instruction: 'Take with your first meal',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    instruction: 'Take with water in the morning',
    profileTimeKey: 'prednisolone_optimal_time',
  },
  {
    id: 'salmeterol',
    name: 'Salmeterol',
    instruction: 'Take as prescribed (often evening)',
    profileTimeKey: 'salmeterol_optimal_time',
  },
  {
    id: 'levothyroxine',
    name: 'Levothyroxine',
    instruction: 'Take on waking, empty stomach',
    estimatedOffsetMinutes: 600,
  },
]

const LEGACY_MEDICATION_KEYS: {
  key: keyof Pick<
    DlmoProfileRow,
    'simvastatin_optimal_time' | 'ramipril_optimal_time' | 'prednisolone_optimal_time' | 'salmeterol_optimal_time'
  >
  name: string
  instruction: string
}[] = [
  { key: 'simvastatin_optimal_time', name: 'Simvastatin', instruction: 'Take at night with water' },
  { key: 'ramipril_optimal_time', name: 'Ramipril', instruction: 'Take with water in the morning' },
  { key: 'prednisolone_optimal_time', name: 'Prednisolone', instruction: 'Take with water in the morning' },
  { key: 'salmeterol_optimal_time', name: 'Salmeterol', instruction: 'Take as prescribed (often evening)' },
]

function normalizeMedicationToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

export function resolveTimebotPrecisionLabel(
  dominantLayer: DlmoDominantLayer | null | undefined
): TimebotPrecisionLabel {
  if (dominantLayer === 'tiptraq') return 'PRECISION'
  if (dominantLayer === 'blood') return 'CONFIRMED'
  return 'ESTIMATED'
}

/** All timeline times derive from proxy_dlmo_rolling, with questionnaire fallback. */
export function resolveTimelineDlmoMinutes(
  profile: DlmoProfileRow | null,
  fallbackSleepTime: string
): { minutes: number; fromRolling: boolean } {
  const fromRolling = parseDbTimeToMinutes(profile?.proxy_dlmo_rolling ?? null)
  if (fromRolling !== null) {
    return { minutes: fromRolling, fromRolling: true }
  }

  const sleepMinutes = parseTimeToMinutes(fallbackSleepTime) ?? 23 * 60
  return {
    minutes: normalizeMinutesFromMidnight(sleepMinutes - 120),
    fromRolling: false,
  }
}

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

function buildZeitgeberEvents(
  dlmoMinutes: number,
  nowMinutes: number,
  timeZone: string
): TimebotTimelineEvent[] {
  const earliestLight = approximateEarliestOutdoorLightMinutes(timeZone)

  const lightMinutes = clampMorningMinutes(
    normalizeMinutesFromMidnight(dlmoMinutes - 600),
    earliestLight
  )
  const foodMinutes = clampMorningMinutes(
    normalizeMinutesFromMidnight(dlmoMinutes - 540),
    earliestLight
  )
  const movementMinutes = normalizeMinutesFromMidnight(dlmoMinutes - 420)
  const darknessMinutes = normalizeMinutesFromMidnight(dlmoMinutes - 90)

  const defs: {
    id: string
    name: string
    minutes: number
    category: TimebotEventCategory
    instruction: string
    windowHalfWidth?: number
  }[] = [
    {
      id: 'zeit-light',
      name: 'Morning light',
      minutes: lightMinutes,
      category: 'Light',
      instruction: 'Get outside for 20 minutes',
    },
    {
      id: 'zeit-food',
      name: 'First meal',
      minutes: foodMinutes,
      category: 'Meal',
      instruction: 'Eat your first substantial meal',
      windowHalfWidth: 45,
    },
    {
      id: 'zeit-movement',
      name: 'Movement',
      minutes: movementMinutes,
      category: 'Movement',
      instruction: 'Light-to-moderate activity for 20 minutes',
      windowHalfWidth: 45,
    },
    {
      id: 'zeit-darkness',
      name: 'Light curfew',
      minutes: darknessMinutes,
      category: 'Darkness',
      instruction: 'Dim screens and warm light from here',
      windowHalfWidth: 60,
    },
  ]

  return defs.map((def) => ({
    id: def.id,
    name: def.name,
    minutes: def.minutes,
    timeDisplay: formatMinutes24h(def.minutes),
    category: def.category,
    instruction: def.instruction,
    status: resolvePointStatus(def.minutes, nowMinutes, def.windowHalfWidth ?? 30),
  }))
}

function buildSupplementEvents(
  supplements: string[],
  dlmoMinutes: number,
  nowMinutes: number
): TimebotTimelineEvent[] {
  return supplements
    .filter((name): name is CanonicalSupplement =>
      CANONICAL_SUPPLEMENTS.includes(name as CanonicalSupplement)
    )
    .map((supplement) => {
      const minutes = normalizeMinutesFromMidnight(
        dlmoMinutes + SUPPLEMENT_OFFSET_MINUTES[supplement]
      )
      return {
        id: `supplement-${supplement}`,
        name: supplement,
        minutes,
        timeDisplay: formatMinutes24h(minutes),
        category: 'Supplement' as const,
        instruction: SUPPLEMENT_SHORT_INSTRUCTIONS[supplement],
        status: resolvePointStatus(minutes, nowMinutes),
      }
    })
}

function buildMedicationEvents(
  profile: DlmoProfileRow | null,
  dlmoMinutes: number,
  nowMinutes: number,
  currentMedications: string[] | null | undefined
): TimebotTimelineEvent[] {
  const selectedTokens = (currentMedications ?? [])
    .map(normalizeMedicationToken)
    .filter(Boolean)

  if (selectedTokens.length > 0) {
    const seen = new Set<string>()
    const events: TimebotTimelineEvent[] = []

    for (const definition of MEDICATION_TIMELINE) {
      if (!selectedTokens.includes(definition.id) || seen.has(definition.name)) continue
      seen.add(definition.name)

      let minutes: number | null = null
      if (definition.profileTimeKey && profile) {
        minutes = parseDbTimeToMinutes(profile[definition.profileTimeKey] as string | null)
      }
      if (minutes === null && definition.estimatedOffsetMinutes != null) {
        minutes = normalizeMinutesFromMidnight(dlmoMinutes + definition.estimatedOffsetMinutes)
      }
      if (minutes === null) continue

      events.push({
        id: `med-${definition.id}`,
        name: definition.name,
        minutes,
        timeDisplay: formatMinutes24h(minutes),
        category: 'Medication',
        instruction: definition.instruction,
        status: resolvePointStatus(minutes, nowMinutes),
      })
    }

    return events
  }

  if (!profile) return []

  return LEGACY_MEDICATION_KEYS.flatMap(({ key, name, instruction }) => {
    const minutes = parseDbTimeToMinutes(profile[key] as string | null)
    if (minutes === null) return []
    return [
      {
        id: `med-${key}`,
        name,
        minutes,
        timeDisplay: formatMinutes24h(minutes),
        category: 'Medication' as const,
        instruction,
        status: resolvePointStatus(minutes, nowMinutes),
      },
    ]
  })
}

export function buildTimebotTimeline(input: {
  profile: DlmoProfileRow | null
  fallbackSleepTime: string
  currentSupplements: string[]
  currentMedications?: string[] | null
  locationCity?: string | null
  locationCountry?: string | null
  now?: Date
}): { events: TimebotTimelineEvent[]; groups: TimebotTimelineGroup[]; dlmoMinutes: number } {
  const { minutes: dlmoMinutes } = resolveTimelineDlmoMinutes(input.profile, input.fallbackSleepTime)
  const timeZone = resolvePatientTimeZone(input.locationCity, input.locationCountry)
  const nowMinutes = getNowMinutesInTimeZone(timeZone, input.now)

  const events = [
    ...buildZeitgeberEvents(dlmoMinutes, nowMinutes, timeZone),
    ...buildSupplementEvents(input.currentSupplements, dlmoMinutes, nowMinutes),
    ...buildMedicationEvents(
      input.profile,
      dlmoMinutes,
      nowMinutes,
      input.currentMedications
    ),
  ].sort((a, b) => a.minutes - b.minutes)

  return {
    events,
    groups: groupTimelineEvents(events),
    dlmoMinutes,
  }
}

export function formatTimelineForContext(groups: TimebotTimelineGroup[]): string {
  if (groups.length === 0) return '- No events on today\'s schedule yet.'

  return groups
    .map((group) => {
      const eventLines = group.events
        .map(
          (event) =>
            `  - ${event.name} (${event.category}): ${event.instruction} [${event.status}]`
        )
        .join('\n')
      return `${group.timeDisplay}\n${eventLines}`
    })
    .join('\n')
}

export function formatDlmoHeaderTime(profile: DlmoProfileRow | null, fallbackSleepTime: string): string {
  const fromRolling = parseDbTimeToMinutes(profile?.proxy_dlmo_rolling ?? null)
  if (fromRolling !== null) return formatMinutesLabel(fromRolling)
  const { minutes } = resolveTimelineDlmoMinutes(profile, fallbackSleepTime)
  return formatMinutesLabel(minutes)
}
