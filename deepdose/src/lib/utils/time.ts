/** Whether current time falls within [start, end] (handles midnight crossing) */
export function isTimeInWindow(current: string, start: string, end: string): boolean {
  const c = timeToMinutes(current)
  const s = timeToMinutes(start)
  const e = timeToMinutes(end)
  if (e <= s) {
    return c >= s || c <= e
  }
  return c >= s && c <= e
}

export function isNowInAnyWindow(now: string, windows: { start: string; end: string }[]): boolean {
  return windows.some((w) => isTimeInWindow(now, w.start, w.end))
}

/** Convert decimal hours (0–24) to HH:MM */
export function decimalHoursToHHMM(hours: number): string {
  const h = Math.floor(hours) % 24
  const m = Math.round((hours % 1) * 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/** Normalise stored time to HH:MM for display (24-hour clock). */
export function formatTime24(value: string | null | undefined): string {
  if (!value) return '—'
  const [h, m] = value.split(':')
  if (h === undefined || m === undefined) return value.slice(0, 5)
  return `${h.padStart(2, '0')}:${m.padStart(2, '0').slice(0, 2)}`
}

/** Locale datetime in 24-hour clock (en-GB). */
export function formatDateTime24(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** Minutes since midnight from HH:MM or HH:MM:SS */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Clock angle in degrees (0:00 at top, clockwise) */
export function timeToAngle(time: string): number {
  const mins = timeToMinutes(time)
  return (mins / 1440) * 360 - 90
}

export interface ArcSegment {
  startAngle: number
  endAngle: number
  crossesMidnight: boolean
}

/** Arc from start to end time; handles windows crossing midnight */
export function timeWindowToArc(start: string, end: string): ArcSegment {
  const startMins = timeToMinutes(start)
  let endMins = timeToMinutes(end)
  const crossesMidnight = endMins <= startMins
  if (crossesMidnight) endMins += 1440

  const startAngle = (startMins / 1440) * 360 - 90
  const endAngle = (endMins / 1440) * 360 - 90

  return { startAngle, endAngle, crossesMidnight }
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  // Round so SSR and client hydration produce identical SVG attributes
  const round = (n: number) => Math.round(n * 1000) / 1000
  return {
    x: round(cx + r * Math.cos(rad)),
    y: round(cy + r * Math.sin(rad)),
  }
}

/** SVG donut-segment path between two angles */
export function describeDonutArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  let sweep = endAngle - startAngle
  if (sweep <= 0) sweep += 360
  const largeArc = sweep > 180 ? 1 : 0

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle)
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle)
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle)

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}
