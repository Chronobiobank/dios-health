// Apple HealthKit ingestion. HealthKit data only exists on-device, so there is no
// web OAuth flow: an iOS Shortcut or companion app POSTs sleep samples to the
// ingest endpoint. This module validates and normalises those samples into the
// shared wearable_sleep_logs shape.

export type AppleHealthSleepSample = {
  /** ISO timestamp of sleep onset (in-bed asleep start). */
  start: string
  /** ISO timestamp of wake. */
  end: string
  /** Optional stage durations in minutes. */
  deepMinutes?: number | null
  remMinutes?: number | null
  /** Stable identifier from HealthKit (UUID); falls back to start timestamp. */
  externalId?: string | null
}

export type NormalisedSleepLog = {
  external_id: string
  sleep_onset_timestamp: string
  wake_timestamp: string
  deep_sleep_duration_minutes: number | null
  rem_duration_minutes: number | null
}

function isValidIso(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function asMinutes(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : null
}

/**
 * Validate and normalise an array of incoming Apple Health sleep samples.
 * Invalid samples (bad timestamps, end before start) are dropped.
 */
export function normaliseAppleHealthSamples(
  samples: unknown
): { logs: NormalisedSleepLog[]; rejected: number } {
  if (!Array.isArray(samples)) return { logs: [], rejected: 0 }

  const logs: NormalisedSleepLog[] = []
  let rejected = 0

  for (const raw of samples) {
    const sample = raw as Partial<AppleHealthSleepSample>
    if (!isValidIso(sample.start) || !isValidIso(sample.end)) {
      rejected += 1
      continue
    }
    if (Date.parse(sample.end) <= Date.parse(sample.start)) {
      rejected += 1
      continue
    }

    logs.push({
      external_id:
        typeof sample.externalId === 'string' && sample.externalId.trim()
          ? sample.externalId.trim()
          : sample.start,
      sleep_onset_timestamp: sample.start,
      wake_timestamp: sample.end,
      deep_sleep_duration_minutes: asMinutes(sample.deepMinutes),
      rem_duration_minutes: asMinutes(sample.remMinutes),
    })
  }

  return { logs, rejected }
}
