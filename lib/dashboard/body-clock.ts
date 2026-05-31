import { formatMinutesLabel, parseTimeToMinutes } from '@/lib/dashboard/time-utils'

export type DoseWindow = {
  label: string
  minutes: number
}

export type BodyClockModel = {
  chronotypeLabel: string
  msfscLabel: string
  sleepStartMinutes: number
  sleepEndMinutes: number
  dlmoMinutes: number
  lightStartMinutes: number
  lightEndMinutes: number
  doseWindows: DoseWindow[]
}

export function buildBodyClockModel(
  wakeTime: string,
  sleepTime: string,
  chronotypeLabel: string
): BodyClockModel {
  const wake = parseTimeToMinutes(wakeTime) ?? 7 * 60
  const sleep = parseTimeToMinutes(sleepTime) ?? 23 * 60

  let msfsc = Math.round((sleep + (wake + (sleep > wake ? 1440 : 0))) / 2)
  if (msfsc >= 1440) msfsc -= 1440

  const dlmo = sleep - 120
  const lightStart = wake
  const lightEnd = wake + 120

  const isEvening = chronotypeLabel.includes('evening')
  const isMorning = chronotypeLabel.includes('morning')

  const doseWindows: DoseWindow[] = isEvening
    ? [
        { label: 'Simvastatin', minutes: 21 * 60 + 30 },
        { label: 'Ramipril', minutes: 22 * 60 },
      ]
    : isMorning
      ? [
          { label: 'Simvastatin', minutes: 7 * 60 },
          { label: 'Ramipril', minutes: 7 * 60 + 30 },
        ]
      : [
          { label: 'Simvastatin', minutes: 21 * 60 },
          { label: 'Ramipril', minutes: 8 * 60 },
        ]

  return {
    chronotypeLabel,
    msfscLabel: `${formatMinutesLabel(msfsc)} estimated`,
    sleepStartMinutes: sleep,
    sleepEndMinutes: wake,
    dlmoMinutes: ((dlmo % 1440) + 1440) % 1440,
    lightStartMinutes: lightStart,
    lightEndMinutes: lightEnd,
    doseWindows,
  }
}
