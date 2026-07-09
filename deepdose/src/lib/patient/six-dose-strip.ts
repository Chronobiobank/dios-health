import { buildZeitgeberSchedule } from '@/lib/chronobiology/build-zeitgeber-schedule'
import type { ZeitgeberScheduleItem } from '@/lib/chronobiology/build-zeitgeber-schedule'
import { ZEITGEBER_DOMAINS, type ZeitgeberId } from '@/lib/chronobiology/zeitgebers'
import type { DosePreviewStatus, DosePreviewTone } from '@/lib/patient/plan-dose-preview'
import { timeToMinutes } from '@/lib/utils/time'

/** Six medical zeitgeber doses (includes Biomedical for medicines). */
export type SixDoseStripId = Exclude<ZeitgeberId, never>

export type SixDoseStripItem = {
  id: SixDoseStripId
  label: string
  shortLabel: string
  cue: string
  timeLabel: string
  note: string
  status: DosePreviewStatus
  tone: DosePreviewTone
  slug: string
}

const STRIP_ORDER: SixDoseStripId[] = [
  'light',
  'meals',
  'meds',
  'exercise',
  'cognition',
  'sleep',
]

const TONE_BY_ID: Record<SixDoseStripId, DosePreviewTone> = {
  light: 'peach',
  meals: 'peach',
  meds: 'peach',
  exercise: 'lilac',
  cognition: 'lilac',
  sleep: 'blue',
}

const SLUG_BY_ID: Record<SixDoseStripId, string> = {
  light: 'sunlight',
  meals: 'nutrient',
  meds: 'biomedical',
  exercise: 'physiological',
  cognition: 'neurological',
  sleep: 'blackout',
}

function domainMeta(id: SixDoseStripId) {
  const domain = ZEITGEBER_DOMAINS.find((d) => d.id === id)
  return {
    label: domain?.label ?? id,
    shortLabel: domain?.shortLabel ?? id,
    cue: domain?.cue ?? id,
    description: domain?.description ?? '',
  }
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

function scheduleNote(id: SixDoseStripId, instruction: string, description: string): string {
  if (id === 'meds') {
    return 'Medicines and supplements timed to your body clock. Your list sits under this dose.'
  }
  const firstSentence = instruction.split('.')[0]
  if (firstSentence) return `${firstSentence}.`
  const descSentence = description.split('.')[0]
  return descSentence ? `${descSentence}.` : description
}

/** Six medical doses timed to phase anchor — Biomedical holds medicine timing. */
export function buildSixDoseStrip(
  dlmoEstimateHours: number,
  now: Date = new Date()
): SixDoseStripItem[] {
  const base = buildZeitgeberSchedule({ dlmoEstimateHours, now })
  const byId = Object.fromEntries(base.map((item) => [item.id, item])) as Record<
    ZeitgeberScheduleItem['id'],
    ZeitgeberScheduleItem
  >

  return STRIP_ORDER.map((id) => {
    const meta = domainMeta(id)
    const item = byId[id]
    const timeLabel = item?.timeLabel ?? '—'
    return {
      id,
      label: meta.label,
      shortLabel: meta.shortLabel,
      cue: meta.cue,
      timeLabel,
      note: scheduleNote(id, item?.instruction ?? '', meta.description),
      status: stripStatus(primaryClockFromLabel(timeLabel), now),
      tone: TONE_BY_ID[id],
      slug: SLUG_BY_ID[id],
    }
  })
}
