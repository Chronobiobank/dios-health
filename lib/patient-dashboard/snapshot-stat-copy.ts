import type { SnapshotStatNotes } from '@/lib/patient-dashboard/types'

export type BuildSnapshotStatNotesInput = {
  darkYearsHours: number
  lightAlignment: number
  clockDrift: number
  dlmoEstimate: string
  tipTraqNights?: number
  meanSleepOnset?: string
  sleepTimingCentre?: string
}

export function buildSnapshotStatNotes(input: BuildSnapshotStatNotesInput): SnapshotStatNotes {
  const nights = input.tipTraqNights ?? 0
  const nightsPhrase =
    nights >= 5 ? 'your five TipTraQ nights' : nights > 1 ? `your last ${nights} TipTraQ nights` : 'your tracked nights'

  const sct = input.sleepTimingCentre
  const darkYearsHours = input.darkYearsHours

  const darkYearsHoursNote = sct
    ? `Sleep midpoint averages ${sct} — about ${darkYearsHours}h later than a 3am population anchor. That phase lag feeds your Dark Years score.`
    : `Your sleep rhythm sits about ${darkYearsHours}h out of phase with the population anchor — a model estimate of metabolic hibernation time.`

  const lightAlignmentNote =
    nights >= 2
      ? `How steady your bedtimes were across ${nightsPhrase}. Higher is more regular — tight onsets score well.`
      : `How closely your sleep and light habits match your estimated body clock. Higher is a steadier day–night pattern.`

  const onsetPart = input.meanSleepOnset ? `mean onset ${input.meanSleepOnset}` : 'mean sleep onset'
  const clockDriftNote =
    nights >= 2
      ? `${onsetPart} vs DLMO target ${input.dlmoEstimate} — ${input.clockDrift} min average slip across ${nightsPhrase}, not a single night.`
      : `Minutes between when you fell asleep and your DLMO-based target (${input.dlmoEstimate}). ${input.clockDrift} min means your sleep ran late versus your clock.`

  return {
    darkYearsHours: darkYearsHoursNote,
    lightAlignment: lightAlignmentNote,
    clockDrift: clockDriftNote,
  } satisfies SnapshotStatNotes
}
