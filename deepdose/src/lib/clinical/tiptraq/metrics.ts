import type { TipTraqBlockMetrics, TipTraqNightInput } from '@/lib/clinical/tiptraq/types'
import {
  ahiSeverity,
  ahiStatus,
  confidenceFromNights,
  remLatencyStatus,
  sleepEfficiencyStatus,
} from '@/lib/clinical/tiptraq/clinical-status'

function clockToMinutes(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  return h * 60 + m
}

function minutesToClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function circularMeanMinutes(values: number[]): number {
  if (values.length === 0) return 0
  const radians = values.map((v) => (v / 1440) * 2 * Math.PI)
  const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0)
  const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0)
  let minutes = Math.round((Math.atan2(sinSum / values.length, cosSum / values.length) / (2 * Math.PI)) * 1440)
  if (minutes < 0) minutes += 1440
  return minutes
}

function sleepMidpointMinutes(onset: string, offset: string): number {
  let sleep = clockToMinutes(onset)
  const wake = clockToMinutes(offset)
  if (sleep < wake) sleep += 1440
  return Math.round((sleep + wake + 1440) / 2) % 1440
}

function remLatencyMinutes(night: TipTraqNightInput): number {
  if (!night.first_rem_onset) return 0
  const onset = clockToMinutes(night.sleep_onset)
  let firstRem = clockToMinutes(night.first_rem_onset)
  if (firstRem < onset) firstRem += 1440
  return firstRem - onset
}

/** DLMO proxy: sleep onset minus 2.5h (aligned with MCTQ estimate in patient-phase). */
export function proxyDlmoFromOnset(sleepOnset: string): string {
  return minutesToClock(clockToMinutes(sleepOnset) - 150)
}

function formatHoursMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function computeTipTraqBlockMetrics(
  nights: TipTraqNightInput[],
  nightsRequired = 3
): TipTraqBlockMetrics {
  const n = nights.length
  const onsets = nights.map((night) => clockToMinutes(night.sleep_onset))
  const wakes = nights.map((night) => clockToMinutes(night.sleep_offset))
  const meanSleepOnset = minutesToClock(circularMeanMinutes(onsets))
  const meanWake = minutesToClock(circularMeanMinutes(wakes))
  const meanTstMinutes = Math.round(
    nights.reduce((sum, night) => sum + night.tst_minutes, 0) / Math.max(n, 1)
  )
  const meanEfficiencyPct = Math.round(
    nights.reduce((sum, night) => sum + night.sleep_efficiency_pct, 0) / Math.max(n, 1)
  )
  const meanAhi = Math.round((nights.reduce((sum, night) => sum + night.ahi, 0) / Math.max(n, 1)) * 10) / 10
  const meanRemLatencyMins = Math.round(
    nights.reduce((sum, night) => sum + remLatencyMinutes(night), 0) / Math.max(n, 1)
  )
  const dlmoEstimate = proxyDlmoFromOnset(meanSleepOnset)
  const clockDriftMinutes = Math.abs(
    clockToMinutes(meanSleepOnset) - clockToMinutes(dlmoEstimate) - 150
  )

  const weekdayMidpoints = nights
    .filter((night) => night.day_type === 'weekday')
    .map((night) => sleepMidpointMinutes(night.sleep_onset, night.sleep_offset))
  const weekendMidpoints = nights
    .filter((night) => night.day_type === 'weekend')
    .map((night) => sleepMidpointMinutes(night.sleep_onset, night.sleep_offset))

  let socialJetlagLabel = '—'
  if (weekdayMidpoints.length > 0 && weekendMidpoints.length > 0) {
    const weekdayMean = circularMeanMinutes(weekdayMidpoints)
    const weekendMean = circularMeanMinutes(weekendMidpoints)
    let diff = weekendMean - weekdayMean
    if (diff > 720) diff -= 1440
    if (diff < -720) diff += 1440
    socialJetlagLabel = formatHoursMinutes(Math.abs(Math.round(diff)))
  }

  const { label: confidenceLabel } = confidenceFromNights(n, nightsRequired)
  const ahiBand = ahiSeverity(meanAhi)
  const effStatus = sleepEfficiencyStatus(meanEfficiencyPct)
  const remStatus = remLatencyStatus(meanRemLatencyMins)

  let clinicalRead =
    n === 0
      ? 'No TipTraQ nights on file. Add three home nights to establish a dosing baseline.'
      : `${n}/${nightsRequired} nights recorded. Mean sleep onset ${meanSleepOnset}, wake ${meanWake}, AHI ${meanAhi} (${ahiBand}).`

  if (n >= nightsRequired) {
    if (effStatus === 'red' || remStatus === 'red') {
      clinicalRead += ' Sleep architecture warrants review before tightening dose windows.'
    } else if (ahiStatus(meanAhi) !== 'green') {
      clinicalRead += ' Mild–moderate sleep apnoea may confound chronotherapy — interpret dose timing alongside respiratory review.'
    } else {
      clinicalRead += ' Block complete — use DLMO proxy to refresh patient dose cues.'
    }
  }

  return {
    nightsLoaded: n,
    nightsRequired,
    blockComplete: n >= nightsRequired,
    meanSleepOnset,
    meanWake,
    meanTstLabel: formatHoursMinutes(meanTstMinutes),
    meanEfficiencyPct,
    meanAhi,
    meanRemLatencyMins,
    dlmoEstimate,
    clockDriftMinutes,
    socialJetlagLabel,
    ahiSeverityBand: ahiBand,
    clinicalRead,
    confidenceLabel,
  }
}
