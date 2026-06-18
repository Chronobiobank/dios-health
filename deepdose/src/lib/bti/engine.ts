import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { decimalHoursToHHMM, isTimeInWindow, timeToMinutes } from '@/lib/utils/time'
import type { PatientCircadianContext } from '@/lib/medications/patient-phase'
import type { BtiPayload, BtiStatus } from './types'

interface ActiveMedication {
  medication_code: string
  current_timing: string | null
}

function localTimeHHMM(now: Date): string {
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function minutesToHHMM(totalMins: number): string {
  const normalized = ((totalMins % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60).toString().padStart(2, '0')
  const m = (normalized % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/** Hours since DLMO on the patient's circadian clock (HH:MM). */
function biologicalTimeRelative(dlmoHours: number, now: Date): string {
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const dlmoMins = Math.round(dlmoHours * 60) % 1440
  const delta = ((nowMins - dlmoMins) % 1440 + 1440) % 1440
  return minutesToHHMM(delta)
}

function windowToIso(now: Date, hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(now)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function deriveStatus(
  inWindow: boolean,
  circadianScore: number,
  deviceAlert: boolean
): BtiStatus {
  if (deviceAlert || (circadianScore > 0 && circadianScore < 50)) {
    return 'CRITICAL_DRIFT'
  }
  if (inWindow) return 'WINDOW_OPEN'
  return 'WINDOW_CLOSED'
}

function displayInstruction(
  status: BtiStatus,
  displayName: string,
  windowStart: string,
  windowEnd: string
): string {
  switch (status) {
    case 'WINDOW_OPEN':
      return `Take ${displayName} now. Your window is open.`
    case 'CRITICAL_DRIFT':
      return `Circadian drift detected — review ${displayName} timing with your clinician.`
    default:
      return `${displayName}: dosing window ${windowStart} – ${windowEnd}.`
  }
}

export function computeMedicationBti(
  patientId: string,
  medication: ActiveMedication,
  context: PatientCircadianContext,
  options?: { now?: Date; deviceAlertTriggered?: boolean }
): BtiPayload | null {
  const code = medication.medication_code
  if (!(code in MEDICATION_TIMINGS)) return null

  const timing = MEDICATION_TIMINGS[code as MedicationCode]
  const window = adjustTimingForPhase(timing, context.phaseOffsetMinutes)
  const now = options?.now ?? new Date()
  const current = localTimeHHMM(now)
  const currentTiming = medication.current_timing?.slice(0, 5) ?? window.start
  const inWindow = isTimeInWindow(current, window.start, window.end)
  const status = deriveStatus(
    inWindow,
    context.circadianScore,
    options?.deviceAlertTriggered ?? false
  )

  return {
    patient_id: patientId,
    medication_id: code,
    clock_time_utc: now.toISOString(),
    biological_time_relative: biologicalTimeRelative(context.dlmoEstimateHours, now),
    bti_status: status,
    dosing_window_start: windowToIso(now, window.start),
    dosing_window_end: windowToIso(now, window.end),
    display_instruction: displayInstruction(
      status,
      timing.displayName,
      window.start,
      window.end
    ),
  }
}

export function computePatientBti(
  patientId: string,
  medications: ActiveMedication[],
  context: PatientCircadianContext,
  options?: { now?: Date; deviceAlertTriggered?: boolean }
): BtiPayload[] {
  return medications
    .map((m) => computeMedicationBti(patientId, m, context, options))
    .filter((p): p is BtiPayload => p !== null)
}

export function dlmoDisplayTime(dlmoHours: number): string {
  return decimalHoursToHHMM(dlmoHours)
}

export function minutesSinceDlmo(dlmoHours: number, now: Date): number {
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const dlmoMins = Math.round(dlmoHours * 60) % 1440
  return ((nowMins - dlmoMins) % 1440 + 1440) % 1440
}

export function isBtiInWindow(payload: BtiPayload, now?: Date): boolean {
  const n = now ?? new Date()
  const current = timeToMinutes(localTimeHHMM(n))
  const start = timeToMinutes(payload.dosing_window_start.slice(11, 16))
  const end = timeToMinutes(payload.dosing_window_end.slice(11, 16))
  if (end <= start) return current >= start || current <= end
  return current >= start && current <= end
}
