import type { PolyPlanMed } from '@/lib/medications/poly-plan-meds'

export type DosePreviewTone = 'peach' | 'lilac' | 'blue'
export type DosePreviewStatus = 'now' | 'upcoming' | 'done'

export const DOSE_PREVIEW_STATUS_LABEL: Record<DosePreviewStatus, string> = {
  done: 'Done',
  now: 'Now',
  upcoming: 'Soon',
}

const PLAN_TICKS = [
  { label: '6a', pos: 0 },
  { label: '12p', pos: 33.3 },
  { label: '6p', pos: 66.7 },
  { label: '12a', pos: 100 },
] as const

export { PLAN_TICKS }

export function dosePreviewTone(timing: string): DosePreviewTone {
  const key = timing.toLowerCase()
  if (key === 'evening') return 'lilac'
  if (key === 'bedtime') return 'blue'
  return 'peach'
}

export function dosePreviewStatus(timing: string): DosePreviewStatus {
  const key = timing.toLowerCase()
  if (key === 'early morning' || key === 'morning') return 'now'
  return 'upcoming'
}

/** Parse HH:MM from window text, or derive from wake for relative windows. */
export function doseDisplayTime(window: string, wake: string | null): string {
  const range = window.match(/(\d{1,2}):(\d{2})/)
  if (range) {
    const h = range[1].padStart(2, '0')
    return `${h}:${range[2]}`
  }
  if (/wake/i.test(window) && wake) return wake
  return window.split('–')[0]?.trim() ?? window
}

function parseClockToMinutes(clock: string): number | null {
  const match = clock.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

/** Map clock time to 0–100 on the 6am→midnight preview rail. */
export function clockToTimelinePos(clock: string): number {
  const minutes = parseClockToMinutes(clock)
  if (minutes == null) return 50
  const start = 6 * 60
  const span = 18 * 60
  let from6 = minutes - start
  if (from6 < 0) from6 += 24 * 60
  return Math.min(100, Math.max(4, (from6 / span) * 100))
}

export function doseTimelinePos(window: string, wake: string | null, timing?: string): number {
  const range = window.match(/(\d{1,2}):(\d{2})/)
  if (range) return clockToTimelinePos(`${range[1].padStart(2, '0')}:${range[2]}`)
  if (/wake/i.test(window) && wake) return clockToTimelinePos(wake)
  const timingFallback: Record<string, number> = {
    'early morning': 12,
    morning: 16,
    variable: 40,
    evening: 72,
    bedtime: 88,
  }
  const key = timing?.toLowerCase() ?? 'morning'
  return timingFallback[key] ?? 40
}

export type DoseTimelineMarker = {
  id: string
  label: string
  pos: number
  tone: DosePreviewTone
  now?: boolean
}

export function primaryNowMarkerPos(markers: DoseTimelineMarker[]): number {
  const now = markers.find((m) => m.now)
  return now?.pos ?? markers[0]?.pos ?? 16
}

export function buildDoseTimelineMarkers(meds: PolyPlanMed[], wake: string | null): DoseTimelineMarker[] {
  return meds.map(({ code, name, meta }) => {
    const status = dosePreviewStatus(meta.timing)
    return {
      id: code,
      label: name.split(' ')[0] ?? name,
      pos: doseTimelinePos(meta.window, wake, meta.timing),
      tone: dosePreviewTone(meta.timing),
      now: status === 'now',
    }
  })
}

export function openWindowLabel(meds: PolyPlanMed[], wake: string | null): string | null {
  const open = meds.find((m) => dosePreviewStatus(m.meta.timing) === 'now')
  if (!open) return null
  return `Window open · ${doseDisplayTime(open.meta.window, wake)}`
}
