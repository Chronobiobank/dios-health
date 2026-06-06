import type { PthTrend, TriageLabPoint, TriageSafetyGate, TriageStatus } from '@/lib/clinicians/triage-types'

const PTH_LOWER_THIRD = 30
const PTH_URGENT_THRESHOLD = 65
const LAB_OVERDUE_DAYS = 14
const LAB_DUE_SOON_DAYS = 7

function daysUntil(dateIso: string, now = new Date()): number {
  const due = new Date(dateIso)
  due.setHours(0, 0, 0, 0)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / 86_400_000)
}

function pthTrendDirection(history: TriageLabPoint[]): PthTrend {
  if (history.length < 2) return 'flat'
  const latest = history[history.length - 1].pthPgMl
  const previous = history[history.length - 2].pthPgMl
  const delta = latest - previous
  if (Math.abs(delta) < 2) return 'flat'
  return delta < 0 ? 'down' : 'up'
}

/** Clinical safety rules — hardcoded, never overridden by AI. */
export function computeTriageStatus(input: {
  pthPgMl: number
  pthHistory: TriageLabPoint[]
  safetyGates: TriageSafetyGate[]
  nextLabDue: string
  now?: Date
}): { status: TriageStatus; pthTrend: PthTrend } {
  const pthTrend = pthTrendDirection(input.pthHistory)
  const daysToLab = daysUntil(input.nextLabDue, input.now)

  const gateUrgent = input.safetyGates.some((g) => g.status === 'WARNING' || g.status === 'HOLD')
  if (gateUrgent || input.pthPgMl > PTH_URGENT_THRESHOLD || daysToLab < -LAB_OVERDUE_DAYS) {
    return { status: 'URGENT', pthTrend }
  }

  const pthWrongDirection =
    input.pthHistory.length >= 2 && pthTrend === 'up' && input.pthPgMl > PTH_LOWER_THIRD

  if (pthWrongDirection || (daysToLab >= 0 && daysToLab <= LAB_DUE_SOON_DAYS)) {
    return { status: 'REVIEW', pthTrend }
  }

  if (
    input.pthPgMl <= PTH_LOWER_THIRD + 10 &&
    input.safetyGates.every((g) => g.status === 'CLEAR') &&
    daysToLab > LAB_DUE_SOON_DAYS
  ) {
    return { status: 'ON_TRACK', pthTrend }
  }

  return { status: 'REVIEW', pthTrend }
}

export function triageStatusSortWeight(status: TriageStatus): number {
  switch (status) {
    case 'URGENT':
      return 0
    case 'REVIEW':
      return 1
    case 'ON_TRACK':
      return 2
  }
}
