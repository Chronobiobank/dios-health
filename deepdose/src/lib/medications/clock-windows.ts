import type { ClockWindow } from '@/components/shared/CircadianClock'
import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
} from '@/lib/circadian/medications'

const WINDOW_COLORS = [
  '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6',
  '#67e8f9', '#22d3ee', '#a5b4fc', '#c4b5fd',
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
