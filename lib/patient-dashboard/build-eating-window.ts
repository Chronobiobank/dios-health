import type { EatingWindowSummary } from '@/lib/patient-dashboard/types'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/** Eating window anchored to morning scan / first activity today. */
export function buildEatingWindowSummary(now = new Date()): EatingWindowSummary {
  const anchor = new Date(now)
  if (anchor.getHours() >= FIRST_LIGHT_PROTOCOL.windowEndHour) {
    anchor.setHours(7, 15, 0, 0)
  }

  const open = new Date(anchor)
  open.setHours(
    open.getHours() + FIRST_LIGHT_PROTOCOL.eatingWindowOpenHoursAfterFirstLight,
    open.getMinutes(),
    0,
    0
  )

  const close = new Date(open)
  close.setHours(open.getHours() + FIRST_LIGHT_PROTOCOL.eatingWindowDurationHoursMin)

  return { opens: formatClockTime(open), closes: formatClockTime(close) }
}
