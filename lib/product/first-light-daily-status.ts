import type { EatingWindowSummary } from '@/lib/patient-dashboard/types'
import type {
  FirstLightAdherence,
  FirstLightOutputs,
  FirstLightSessionCache,
} from '@/lib/product/first-light-outputs'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'

export type FirstLightDailyStatus = {
  completeToday: boolean
  completedAt: string | null
  scanWithinWindow: boolean
  adherenceComplete: boolean
  riskStatus: 'green' | 'amber' | null
  eatingWindow: EatingWindowSummary | null
  scanNote: string | null
  missedCheckpoints: string[]
}

type FirstLightSessionRecord = {
  scan_within_window?: boolean
  adherence?: Partial<FirstLightAdherence>
  completed_at?: string
}

function isSameLocalDay(iso: string, now = new Date()): boolean {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return false
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function eatingWindowFromScan(scanAt: Date): EatingWindowSummary {
  const open = new Date(scanAt)
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

function parseAdherence(raw: Partial<FirstLightAdherence> | undefined): FirstLightAdherence {
  return {
    fluidIntake: raw?.fluidIntake === true,
    lowCalciumDiet: raw?.lowCalciumDiet === true,
    physicalActivity: raw?.physicalActivity === true,
  }
}

function missedCheckpointLabels(adherence: FirstLightAdherence): string[] {
  const labels: string[] = []
  const keys = ['fluidIntake', 'lowCalciumDiet', 'physicalActivity'] as const
  FIRST_LIGHT_PROTOCOL.adherenceCheckpoints.forEach((label, index) => {
    if (!adherence[keys[index]]) labels.push(label)
  })
  return labels
}

function scanNoteFor(scanWithinWindow: boolean, outdoorLight: boolean | null): string | null {
  if (!scanWithinWindow) {
    return 'Recorded outside the first-light window — timing precision is reduced today.'
  }
  if (outdoorLight === false) {
    return 'Indoor scan — outdoor morning light strengthens tomorrow’s estimate.'
  }
  return null
}

export function dailyStatusFromSessionCache(cache: FirstLightSessionCache): FirstLightDailyStatus {
  return dailyStatusFromOutputsWithAdherence(
    cache.outputs,
    cache.completedAt,
    cache.adherence,
    cache.scanWithinWindow,
    cache.outdoorLight
  )
}

export function dailyStatusFromOutputs(outputs: FirstLightOutputs, completedAt: string): FirstLightDailyStatus {
  return {
    completeToday: isSameLocalDay(completedAt, new Date()),
    completedAt,
    scanWithinWindow: outputs.bodyClockSynced,
    adherenceComplete: outputs.adherenceComplete,
    riskStatus: outputs.riskStatus,
    eatingWindow: outputs.eatingWindow,
    scanNote: outputs.scanNote,
    missedCheckpoints: [],
  }
}

export function dailyStatusFromOutputsWithAdherence(
  outputs: FirstLightOutputs,
  completedAt: string,
  adherence: FirstLightAdherence,
  scanWithinWindow: boolean,
  outdoorLight: boolean | null
): FirstLightDailyStatus {
  const missed = missedCheckpointLabels(adherence)
  const adherenceComplete = missed.length === 0
  const riskStatus: 'green' | 'amber' =
    adherenceComplete && scanWithinWindow ? 'green' : 'amber'

  return {
    completeToday: isSameLocalDay(completedAt),
    completedAt,
    scanWithinWindow,
    adherenceComplete,
    riskStatus,
    eatingWindow: outputs.eatingWindow,
    scanNote: outputs.scanNote ?? scanNoteFor(scanWithinWindow, outdoorLight),
    missedCheckpoints: missed,
  }
}

export function resolveFirstLightDailyStatus(
  observation: {
    observed_at: string
    sensor_payload: Record<string, unknown> | null
  } | null,
  now = new Date()
): FirstLightDailyStatus | null {
  if (!observation) return null

  const payload = observation.sensor_payload ?? {}
  const session = payload.first_light_session as FirstLightSessionRecord | undefined
  const completedAt =
    (typeof session?.completed_at === 'string' ? session.completed_at : null) ??
    observation.observed_at

  if (!isSameLocalDay(completedAt, now)) return null

  const adherence = parseAdherence(session?.adherence)
  const scanWithinWindow = session?.scan_within_window !== false
  const outdoorLight =
    typeof payload.outdoor_light_before_10am === 'boolean'
      ? payload.outdoor_light_before_10am
      : null

  const missed = missedCheckpointLabels(adherence)
  const adherenceComplete = missed.length === 0
  const riskStatus: 'green' | 'amber' =
    adherenceComplete && scanWithinWindow ? 'green' : 'amber'

  const scanAt = new Date(completedAt)

  return {
    completeToday: true,
    completedAt,
    scanWithinWindow,
    adherenceComplete,
    riskStatus,
    eatingWindow: eatingWindowFromScan(scanAt),
    scanNote: scanNoteFor(scanWithinWindow, outdoorLight),
    missedCheckpoints: missed,
  }
}

export function mergeFirstLightDailyStatus(
  server: FirstLightDailyStatus | null,
  client: FirstLightDailyStatus | null
): FirstLightDailyStatus | null {
  if (!server && !client) return null
  if (!server) return client
  if (!client) return server
  if (!client.completedAt) return server
  if (!server.completedAt) return client
  return new Date(client.completedAt) >= new Date(server.completedAt) ? client : server
}
