import type { ClockWindow } from '@/components/shared/CircadianClock'
import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
} from '@/lib/circadian/medications'

const WINDOW_COLORS = [
  '#5ec8f5',
  '#8b9cf8',
  '#c4a0ff',
  '#67d4f8',
  '#9eb0fa',
  '#d4b8ff',
  '#4eb8e8',
  '#7a8ef0',
]

interface ActiveMedication {
  medication_code: string
}

export function buildClockWindows(
  meds: ActiveMedication[],
  phaseOffsetMinutes: number
): ClockWindow[] {
  return meds
    .filter((m): m is ActiveMedication & { medication_code: MedicationCode } =>
      m.medication_code in MEDICATION_TIMINGS
    )
    .map((m, i) => {
      const timing = MEDICATION_TIMINGS[m.medication_code]
      const window = adjustTimingForPhase(timing, phaseOffsetMinutes)
      return {
        id: m.medication_code,
        label: timing.displayName,
        start: window.start,
        end: window.end,
        color: WINDOW_COLORS[i % WINDOW_COLORS.length],
      }
    })
}
