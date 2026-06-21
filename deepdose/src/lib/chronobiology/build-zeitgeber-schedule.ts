import type { BtiPayload } from '@/lib/bti/types'
import type { ZeitgeberId } from '@/lib/chronobiology/zeitgebers'
import { ZEITGEBER_DOMAINS } from '@/lib/chronobiology/zeitgebers'
import { getMedicationDisplayName } from '@/lib/medications/catalog'
import { decimalHoursToHHMM, isTimeInWindow, timeToMinutes } from '@/lib/utils/time'

export type ZeitgeberScheduleItem = {
  id: ZeitgeberId
  label: string
  timeLabel: string
  instruction: string
  activeNow?: boolean
}

function minutesFromMidnight(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440
}

function minutesToClock(minutes: number): string {
  const normalized = minutesFromMidnight(minutes)
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function dlmoMinutes(dlmoEstimateHours: number): number {
  return timeToMinutes(decimalHoursToHHMM(dlmoEstimateHours))
}

function buildMedsZeitgeber(
  btiPayloads: BtiPayload[],
  nowClock: string
): Pick<ZeitgeberScheduleItem, 'timeLabel' | 'instruction' | 'activeNow'> {
  if (btiPayloads.length === 0) {
    return {
      timeLabel: '—',
      instruction: 'Add your medicines below to see when each one works best.',
    }
  }

  const open = btiPayloads.filter((p) => p.bti_status === 'WINDOW_OPEN')
  if (open.length > 0) {
    const names = open.map((p) => getMedicationDisplayName(p.medication_id)).join(', ')
    return {
      timeLabel: 'Now',
      instruction: `Good time to take: ${names}.`,
      activeNow: true,
    }
  }

  const withWindows = btiPayloads
    .map((p) => {
      const start = p.dosing_window_start.slice(11, 16)
      const end = p.dosing_window_end.slice(11, 16)
      const name = getMedicationDisplayName(p.medication_id)
      return { name, start, end, inWindow: isTimeInWindow(nowClock, start, end) }
    })
    .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))

  const next = withWindows.find((w) => timeToMinutes(w.start) > timeToMinutes(nowClock)) ?? withWindows[0]
  if (next) {
    return {
      timeLabel: `${next.start} – ${next.end}`,
      instruction: `Next window (${next.name}): take between these times.`,
    }
  }

  return {
    timeLabel: '—',
    instruction: 'Check your medicine cards below for timing.',
  }
}

/** Phase-anchored daily cues from DLMO estimate (and optional MCTQ mid-sleep). */
export function buildZeitgeberSchedule(input: {
  dlmoEstimateHours: number
  msfScHours?: number | null
  btiPayloads?: BtiPayload[]
  now?: Date
}): ZeitgeberScheduleItem[] {
  const now = input.now ?? new Date()
  const nowClock = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const phase = dlmoMinutes(input.dlmoEstimateHours)

  const morningLight = minutesToClock(phase - 600)
  const firstMeal = minutesToClock(phase - 540)
  const focusBlock = minutesToClock(phase - 480)
  const exercise = minutesToClock(phase - 420)
  const lightCurfew = minutesToClock(phase - 90)
  const sleepTarget = minutesToClock(phase + 45)

  const wakeMinutes =
    input.msfScHours != null
      ? minutesFromMidnight(Math.round(input.msfScHours * 60) + 240)
      : minutesFromMidnight(phase - 480)
  const wakeTime = minutesToClock(wakeMinutes)

  const lightActive = isTimeInWindow(nowClock, morningLight, minutesToClock(phase - 360))
  const mealActive = isTimeInWindow(nowClock, firstMeal, minutesToClock(phase - 480))
  const focusActive = isTimeInWindow(nowClock, focusBlock, minutesToClock(phase - 300))
  const exerciseActive = isTimeInWindow(nowClock, exercise, minutesToClock(phase - 240))
  const sleepActive =
    isTimeInWindow(nowClock, lightCurfew, '23:59') ||
    isTimeInWindow(nowClock, '00:00', sleepTarget)

  const meds = buildMedsZeitgeber(input.btiPayloads ?? [], nowClock)

  const domainById = Object.fromEntries(ZEITGEBER_DOMAINS.map((d) => [d.id, d.label])) as Record<
    ZeitgeberId,
    string
  >

  return [
    {
      id: 'light',
      label: domainById.light,
      timeLabel: morningLight,
      instruction: `Get outside before ${morningLight}. Morning light sets your body clock for the day.`,
      activeNow: lightActive,
    },
    {
      id: 'meals',
      label: domainById.meals,
      timeLabel: firstMeal,
      instruction: `Eat your first meal around ${firstMeal}. Meal timing anchors your metabolic rhythm.`,
      activeNow: mealActive,
    },
    {
      id: 'exercise',
      label: domainById.exercise,
      timeLabel: exercise,
      instruction: `Move your body around ${exercise}. Exercise is a strong daily time cue.`,
      activeNow: exerciseActive,
    },
    {
      id: 'cognition',
      label: domainById.cognition,
      timeLabel: focusBlock,
      instruction: `Save demanding focus for around ${focusBlock}, and ease into mindful rest as the evening winds down.`,
      activeNow: focusActive,
    },
    {
      id: 'meds',
      label: domainById.meds,
      timeLabel: meds.timeLabel,
      instruction: meds.instruction,
      activeNow: meds.activeNow,
    },
    {
      id: 'sleep',
      label: domainById.sleep,
      timeLabel: `${wakeTime} wake · ${sleepTarget} sleep`,
      instruction: `Dim lights by ${lightCurfew}. Aim to sleep around ${sleepTarget}. Wake around ${wakeTime}.`,
      activeNow: sleepActive,
    },
  ]
}
