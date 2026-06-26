import { buildZeitgeberSchedule } from '@/lib/chronobiology/build-zeitgeber-schedule'
import type { ZeitgeberScheduleItem } from '@/lib/chronobiology/build-zeitgeber-schedule'
import type { DosePreviewStatus, DosePreviewTone } from '@/lib/patient/plan-dose-preview'
import { timeToMinutes } from '@/lib/utils/time'

export type SixDoseStripId =
  | 'light'
  | 'meals'
  | 'exercise'
  | 'cognition'
  | 'sociophilic'
  | 'sleep'

export type SixDoseStripItem = {
  id: SixDoseStripId
  label: string
  shortLabel: string
  timeLabel: string
  note: string
  status: DosePreviewStatus
  tone: DosePreviewTone
  slug: string
}

const STRIP_LABELS: Record<SixDoseStripId, { label: string; shortLabel: string; slug: string }> = {
  light: { label: 'Sunlight dose', shortLabel: 'Sunlight', slug: 'sunlight' },
  meals: { label: 'Nutritional dose', shortLabel: 'Nutritional', slug: 'nutritional' },
  exercise: { label: 'Physiological dose', shortLabel: 'Physiological', slug: 'physiological' },
  cognition: { label: 'Neuroplastic dose', shortLabel: 'Neuroplastic', slug: 'neuroplastic' },
  sociophilic: { label: 'Sociophilic dose', shortLabel: 'Sociophilic', slug: 'sociophilic' },
  sleep: { label: 'Blackout dose', shortLabel: 'Blackout', slug: 'blackout' },
}

const STRIP_ORDER: SixDoseStripId[] = [
  'light',
  'meals',
  'exercise',
  'cognition',
  'sociophilic',
  'sleep',
]

const TONE_BY_ID: Record<SixDoseStripId, DosePreviewTone> = {
  light: 'peach',
  meals: 'peach',
  exercise: 'peach',
  cognition: 'lilac',
  sociophilic: 'lilac',
  sleep: 'blue',
}

function minutesToClock(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function dlmoMinutes(dlmoEstimateHours: number): number {
  const h = Math.floor(dlmoEstimateHours)
  const m = Math.round((dlmoEstimateHours % 1) * 60)
  return h * 60 + m
}

function primaryClockFromLabel(timeLabel: string): number | null {
  const match = timeLabel.match(/(\d{1,2}):(\d{2})/g)
  if (!match?.length) return null
  const last = match[match.length - 1]
  return timeToMinutes(last)
}

function stripStatus(clockMinutes: number | null, now: Date): DosePreviewStatus {
  if (clockMinutes == null) return 'upcoming'
  const nowMin = now.getHours() * 60 + now.getMinutes()
  let delta = clockMinutes - nowMin
  if (delta < -720) delta += 1440
  if (delta > 720) delta -= 1440
  if (delta < -45) return 'done'
  if (delta >= -30 && delta <= 45) return 'now'
  return 'upcoming'
}

function scheduleNote(id: SixDoseStripId, timeLabel: string, instruction: string): string {
  if (id === 'sociophilic') {
    return `Connect with someone around ${timeLabel.split(' ')[0]}. Shared rhythm is a daily time cue.`
  }
  const firstSentence = instruction.split('.')[0]
  return firstSentence ? `${firstSentence}.` : instruction
}

/** Six lifestyle doses timed to DLMO — wireframe protocol without biomedical row. */
export function buildSixDoseStrip(
  dlmoEstimateHours: number,
  now: Date = new Date()
): SixDoseStripItem[] {
  const base = buildZeitgeberSchedule({ dlmoEstimateHours, now })
  const byId = Object.fromEntries(base.map((item) => [item.id, item])) as Record<
    ZeitgeberScheduleItem['id'],
    ZeitgeberScheduleItem
  >

  const phase = dlmoMinutes(dlmoEstimateHours)
  const sociophilicTime = minutesToClock(phase - 240)

  return STRIP_ORDER.map((id) => {
    const meta = STRIP_LABELS[id]
    if (id === 'sociophilic') {
      const timeLabel = sociophilicTime
      return {
        id,
        label: meta.label,
        shortLabel: meta.shortLabel,
        timeLabel,
        note: scheduleNote(id, timeLabel, ''),
        status: stripStatus(timeToMinutes(timeLabel), now),
        tone: TONE_BY_ID[id],
        slug: meta.slug,
      }
    }

    const item = byId[id]
    const timeLabel = item.timeLabel
    return {
      id,
      label: meta.label,
      shortLabel: meta.shortLabel,
      timeLabel,
      note: scheduleNote(id, timeLabel, item.instruction),
      status: stripStatus(primaryClockFromLabel(timeLabel), now),
      tone: TONE_BY_ID[id],
      slug: meta.slug,
    }
  })
}
