import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { matchPatientMedications } from '@/lib/medication/patient-medications'
import { resolveMedicationWindowTime } from '@/lib/medication/timing-catalog'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import { formatMinutesLabel } from '@/lib/dashboard/time-utils'

export type FirstLightAdherence = {
  fluidIntake: boolean
  lowCalciumDiet: boolean
  physicalActivity: boolean
}

export type FirstLightSessionPayload = {
  wakeTimeLocal: string
  sleepOnsetLocal: string
  outdoorLight: boolean
  scanWithinWindow: boolean
  scanCompletedAt: string
  adherence: FirstLightAdherence
}

export type FirstLightDoseTiming = {
  name: string
  time: string
  note?: string
}

export type FirstLightOutputs = {
  bodyClockSynced: boolean
  adherenceComplete: boolean
  riskStatus: 'green' | 'amber'
  eatingWindow: { opens: string; closes: string }
  doseTimings: FirstLightDoseTiming[]
  scanNote: string | null
  phaseTimeLabel: string | null
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function buildEatingWindow(scanCompletedAt: Date): { opens: string; closes: string } {
  const open = new Date(scanCompletedAt)
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

function adherenceComplete(adherence: FirstLightAdherence): boolean {
  return adherence.fluidIntake && adherence.lowCalciumDiet && adherence.physicalActivity
}

export function buildFirstLightOutputs(
  payload: FirstLightSessionPayload,
  options: {
    currentMedications?: string[] | null
    mluxProfile?: MLuxProfileRow | null
  } = {}
): FirstLightOutputs {
  const scanAt = new Date(payload.scanCompletedAt)
  const eatingWindow = buildEatingWindow(scanAt)
  const allAdherence = adherenceComplete(payload.adherence)

  const meds = matchPatientMedications(options.currentMedications ?? [])
  const profile = options.mluxProfile ?? null
  const phaseMinutes = profile?.mlux_phase_minutes ?? 7 * 60 + 30
  const hasDlmo = profile?.mlux_phase_minutes != null

  let doseTimings: FirstLightDoseTiming[] = meds.slice(0, 5).map((med) => {
    const { timeLabel, estimated } = resolveMedicationWindowTime(
      med,
      phaseMinutes,
      profile,
      hasDlmo
    )
    return {
      name: med.name,
      time: timeLabel,
      note: estimated ? `${med.explanation} (estimated window)` : med.explanation,
    }
  })

  if (doseTimings.length === 0) {
    doseTimings = [
      {
        name: 'Your protocol',
        time: 'Add meds in Settings to see windows',
        note: 'DIOS times each script to your body clock once your list is saved.',
      },
    ]
  }

  const phaseTimeLabel =
    profile?.mlux_phase_minutes != null
      ? formatMinutesLabel(profile.mlux_phase_minutes)
      : null

  let scanNote: string | null = null
  if (!payload.scanWithinWindow) {
    scanNote =
      'Scan recorded outside the first-light entrainment window — used for adherence, not primary clock sync.'
  } else if (!payload.outdoorLight) {
    scanNote = 'Indoor scan noted — outdoor melanopic light strengthens tomorrow’s window estimate.'
  }

  const riskStatus: 'green' | 'amber' =
    allAdherence && payload.scanWithinWindow ? 'green' : 'amber'

  return {
    bodyClockSynced: payload.scanWithinWindow && payload.outdoorLight,
    adherenceComplete: allAdherence,
    riskStatus,
    eatingWindow,
    doseTimings,
    scanNote,
    phaseTimeLabel,
  }
}

export const FIRST_LIGHT_SESSION_STORAGE_KEY = 'dios:first-light-outputs' as const

/** Client cache after POST /api/first-light/complete — consumed by dashboard on return. */
export type FirstLightSessionCache = {
  outputs: FirstLightOutputs
  completedAt: string
  adherence: FirstLightAdherence
  scanWithinWindow: boolean
  outdoorLight: boolean | null
}

export function parseFirstLightSessionCache(raw: unknown): FirstLightSessionCache | null {
  if (!raw || typeof raw !== 'object') return null
  const record = raw as Record<string, unknown>
  if (record.outputs && typeof record.completedAt === 'string') {
    return {
      outputs: record.outputs as FirstLightOutputs,
      completedAt: record.completedAt,
      adherence: (record.adherence as FirstLightAdherence) ?? {
        fluidIntake: false,
        lowCalciumDiet: false,
        physicalActivity: false,
      },
      scanWithinWindow: record.scanWithinWindow !== false,
      outdoorLight: typeof record.outdoorLight === 'boolean' ? record.outdoorLight : null,
    }
  }
  if ('eatingWindow' in record && 'riskStatus' in record) {
    const outputs = record as FirstLightOutputs
    return {
      outputs,
      completedAt: new Date().toISOString(),
      adherence: {
        fluidIntake: outputs.adherenceComplete,
        lowCalciumDiet: outputs.adherenceComplete,
        physicalActivity: outputs.adherenceComplete,
      },
      scanWithinWindow: outputs.bodyClockSynced,
      outdoorLight: null,
    }
  }
  return null
}
