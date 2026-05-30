export function parseDbTimeToMinutes(value: string | null | undefined): number | null {
  if (!value) return null
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return null
  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10)
}

export function parseTimeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(am|pm)$/i)
  if (!match) return null

  let hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  const period = match[3].toLowerCase()

  if (period === 'pm' && hours !== 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0

  return hours * 60 + minutes
}

export function formatMinutesLabel(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const hours24 = Math.floor(normalized / 60)
  const mins = normalized % 60
  const period = hours24 >= 12 ? 'pm' : 'am'
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  return `${hours12}:${mins.toString().padStart(2, '0')}${period}`
}

export function minutesToAngle(minutes: number): number {
  const normalized = ((minutes % 1440) + 1440) % 1440
  return (normalized / 1440) * 360 - 90
}

export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startMinutes: number,
  endMinutes: number
): string {
  let start = ((startMinutes % 1440) + 1440) % 1440
  let end = ((endMinutes % 1440) + 1440) % 1440
  if (end <= start) end += 1440

  const startAngle = minutesToAngle(start)
  const endAngle = minutesToAngle(end)
  const largeArc = end - start > 720 ? 1 : 0
  const startPoint = polarToCartesian(cx, cy, radius, startAngle)
  const endPoint = polarToCartesian(cx, cy, radius, endAngle)

  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`
}
