import type { TipTraQNight } from '@/lib/mlux'
import type { TipTraQClinicalNight, WearableTelemetryInsert } from '@/lib/dios/premium/types'

/** Clinical-grade TipTraQ night — Sean James canonical validation night. */
export const MOCK_TIPTRAQ_CLINICAL_NIGHT: TipTraQClinicalNight = {
  sleep_onset: '00:36',
  sleep_offset: '08:12',
  sleep_latency_minutes: 18,
  tst_minutes: 392,
  waso_minutes: 95,
  sleep_efficiency_pct: 86,
  rem_duration_minutes: 78,
  rem_pct_tst: 19.9,
  first_rem_onset: '02:57',
  ahi: 5.4,
  sns_pct: 72,
  pns_pct: 28,
  mean_pr: 62,
  min_pr: 48,
  min_spo2: 89,
  hypoxic_burden: 12.4,
  signal_quality_pct: 84,
}

function parseClockToMinutes(clock: string): number {
  const [hours, minutes] = clock.split(':').map(Number)
  return hours * 60 + minutes
}

function utcTimestampFromClock(
  clock: string,
  anchor: Date,
  dayOffset: number
): string {
  const minutes = parseClockToMinutes(clock)
  const result = new Date(anchor)
  result.setUTCHours(0, 0, 0, 0)
  result.setUTCDate(result.getUTCDate() + dayOffset)
  result.setUTCHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
  return result.toISOString()
}

function estimateDeepSleepMinutes(night: TipTraQNight): number {
  const nonRem = night.tst_minutes - night.rem_duration_minutes
  return Math.max(0, Math.round(nonRem * 0.31))
}

function estimateDailyAverageHrv(night: TipTraQNight): number {
  return Math.round((28 + night.pns_pct * 0.95 + (100 - night.sns_pct) * 0.15) * 10) / 10
}

function estimateAverageSpo2(night: TipTraQNight): number {
  const hypoxicPenalty = night.hypoxic_burden * 0.28
  const estimate = 97 - hypoxicPenalty + night.min_spo2 * 0.05
  return Math.round(Math.min(98, Math.max(night.min_spo2 + 2, estimate)) * 10) / 10
}

function buildIntraNightHrvSeries(
  onsetIso: string,
  wakeIso: string,
  night: TipTraQNight
): { recorded_at: string; value: number }[] {
  const onset = new Date(onsetIso).getTime()
  const wake = new Date(wakeIso).getTime()
  const durationMs = wake - onset
  const sampleCount = 12
  const baseHrv = estimateDailyAverageHrv(night)
  const samples: { recorded_at: string; value: number }[] = []

  for (let i = 0; i < sampleCount; i++) {
    const progress = sampleCount <= 1 ? 0 : i / (sampleCount - 1)
    const recordedAt = new Date(onset + progress * durationMs)
    const remBand =
      night.first_rem_onset && progress > 0.35 && progress < 0.55 ? -6 + night.sns_pct * 0.04 : 0
    const rdiSuppression = night.ahi > 5 ? -(night.ahi - 5) * 0.8 : 0
    const pulseSwing = Math.sin(progress * Math.PI * 3) * ((night.mean_pr - night.min_pr) * 0.15)
    const value = Math.round((baseHrv + remBand + rdiSuppression + pulseSwing) * 10) / 10

    samples.push({
      recorded_at: recordedAt.toISOString(),
      value,
    })
  }

  return samples
}

/**
 * Maps FDA-cleared TipTraQ night metrics into `wearable_telemetry_logs` premium rows.
 */
export class MockTipTraQAdapter {
  private readonly night: TipTraQClinicalNight
  private readonly syncedAt: Date

  constructor(night: TipTraQClinicalNight = MOCK_TIPTRAQ_CLINICAL_NIGHT, syncedAt: Date = new Date()) {
    this.night = night
    this.syncedAt = syncedAt
  }

  toWearableTelemetryInsert(patientId: string): WearableTelemetryInsert {
    const anchor = new Date(this.syncedAt)
    const onsetDayOffset = parseClockToMinutes(this.night.sleep_onset) >= 12 * 60 ? -1 : 0
    const sleepOnset = utcTimestampFromClock(this.night.sleep_onset, anchor, onsetDayOffset)
    const wakeDayOffset = parseClockToMinutes(this.night.sleep_offset) < parseClockToMinutes(this.night.sleep_onset) ? 1 : 0
    const wakeTimestamp = utcTimestampFromClock(
      this.night.sleep_offset,
      anchor,
      wakeDayOffset + (onsetDayOffset < 0 ? 1 : 0)
    )

    return {
      patient_id: patientId,
      synced_at: this.syncedAt.toISOString(),
      sleep_onset_timestamp: sleepOnset,
      wake_timestamp: wakeTimestamp,
      deep_sleep_duration_minutes: estimateDeepSleepMinutes(this.night),
      rem_duration_minutes: this.night.rem_duration_minutes,
      daily_average_hrv: estimateDailyAverageHrv(this.night),
      intra_night_hrv_series: buildIntraNightHrvSeries(sleepOnset, wakeTimestamp, this.night),
      lux_exposure_hours: 1.2,
      source: 'tiptraq',
      ingestion_tier: 'PREMIUM',
      average_spo2: estimateAverageSpo2(this.night),
      respiratory_disturbance_index: this.night.ahi,
    }
  }
}
