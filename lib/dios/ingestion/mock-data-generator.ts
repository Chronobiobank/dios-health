import type {
  HrvSample,
  IngestionLayerPayload,
  MockPersonaKey,
} from '@/lib/dios/ingestion/types'

/** Fixed reference for deterministic UI snapshots and tests. */
export const MOCK_INGESTION_SYNC_REFERENCE = '2026-06-05T08:00:00.000Z'

const PERSONA_IDS: Record<MockPersonaKey, string> = {
  'early-riser': 'c1000000-0000-4000-8000-000000000001',
  insomniac: 'c1000000-0000-4000-8000-000000000002',
  'night-shift-worker': 'c1000000-0000-4000-8000-000000000003',
}

const PERSONA_LABELS: Record<MockPersonaKey, string> = {
  'early-riser': 'The Early Riser',
  insomniac: 'The Insomniac',
  'night-shift-worker': 'The Night Shift Worker',
}

export const MOCK_PERSONA_KEYS = Object.keys(PERSONA_IDS) as MockPersonaKey[]

type PersonaProfile = {
  sleep: {
    onsetHour: number
    onsetMinute: number
    wakeHour: number
    wakeMinute: number
    deepMinutes: number
    remMinutes: number
    /** Negative = sleep started previous calendar day. */
    onsetDayOffset: -1 | 0
  }
  hrv: {
    dailyAverage: number
    base: number
    amplitude: number
    trend: 'stable' | 'declining' | 'flat'
  }
  light: {
    luxExposureHours: number
  }
  integration: IngestionLayerPayload['integration']
}

const PERSONA_PROFILES: Record<MockPersonaKey, PersonaProfile> = {
  'early-riser': {
    sleep: {
      onsetHour: 21,
      onsetMinute: 15,
      wakeHour: 5,
      wakeMinute: 45,
      deepMinutes: 98,
      remMinutes: 112,
      onsetDayOffset: -1,
    },
    hrv: {
      dailyAverage: 74,
      base: 76,
      amplitude: 8,
      trend: 'stable',
    },
    light: {
      luxExposureHours: 3.4,
    },
    integration: {
      oura_oauth_token: 'mock_oura_early_riser',
      whoop_oauth_token: null,
      apple_health_connected: false,
    },
  },
  insomniac: {
    sleep: {
      onsetHour: 2,
      onsetMinute: 40,
      wakeHour: 7,
      wakeMinute: 15,
      deepMinutes: 32,
      remMinutes: 38,
      onsetDayOffset: 0,
    },
    hrv: {
      dailyAverage: 36,
      base: 42,
      amplitude: 14,
      trend: 'declining',
    },
    light: {
      luxExposureHours: 0.35,
    },
    integration: {
      oura_oauth_token: null,
      whoop_oauth_token: null,
      apple_health_connected: true,
    },
  },
  'night-shift-worker': {
    sleep: {
      onsetHour: 9,
      onsetMinute: 30,
      wakeHour: 17,
      wakeMinute: 15,
      deepMinutes: 68,
      remMinutes: 82,
      onsetDayOffset: 0,
    },
    hrv: {
      dailyAverage: 47,
      base: 48,
      amplitude: 4,
      trend: 'flat',
    },
    light: {
      luxExposureHours: 1.8,
    },
    integration: {
      oura_oauth_token: null,
      whoop_oauth_token: 'mock_whoop_night_shift',
      apple_health_connected: false,
    },
  },
}

function utcTimestamp(
  syncAt: Date,
  dayOffset: number,
  hour: number,
  minute: number
): string {
  const anchor = new Date(syncAt)
  anchor.setUTCHours(0, 0, 0, 0)
  anchor.setUTCDate(anchor.getUTCDate() + dayOffset)
  anchor.setUTCHours(hour, minute, 0, 0)
  return anchor.toISOString()
}

function sleepDurationMinutes(onset: Date, wake: Date): number {
  const diff = wake.getTime() - onset.getTime()
  return Math.max(0, Math.round(diff / 60_000))
}

function buildHrvSeries(
  onset: Date,
  wake: Date,
  profile: PersonaProfile['hrv']
): HrvSample[] {
  const durationMin = sleepDurationMinutes(onset, wake)
  const sampleCount = Math.max(4, Math.floor(durationMin / 45))
  const samples: HrvSample[] = []

  for (let i = 0; i < sampleCount; i++) {
    const progress = sampleCount <= 1 ? 0 : i / (sampleCount - 1)
    const elapsedMs = progress * (wake.getTime() - onset.getTime())
    const recordedAt = new Date(onset.getTime() + elapsedMs)

    let value = profile.base
    if (profile.trend === 'stable') {
      value += Math.sin(progress * Math.PI * 2) * profile.amplitude * 0.35
      value += (0.5 - progress) * profile.amplitude * 0.2
    } else if (profile.trend === 'declining') {
      value -= progress * profile.amplitude
      value += Math.sin(progress * Math.PI * 4) * 3
    } else {
      value += Math.sin(progress * Math.PI) * profile.amplitude * 0.15
    }

    samples.push({
      recorded_at: recordedAt.toISOString(),
      value: Math.round(value * 10) / 10,
    })
  }

  return samples
}

function buildPayload(personaKey: MockPersonaKey, syncedAt: string): IngestionLayerPayload {
  const profile = PERSONA_PROFILES[personaKey]
  const syncDate = new Date(syncedAt)

  const onset = new Date(
    utcTimestamp(
      syncDate,
      profile.sleep.onsetDayOffset,
      profile.sleep.onsetHour,
      profile.sleep.onsetMinute
    )
  )
  const wake = new Date(
    utcTimestamp(syncDate, 0, profile.sleep.wakeHour, profile.sleep.wakeMinute)
  )
  if (wake.getTime() <= onset.getTime()) {
    wake.setUTCDate(wake.getUTCDate() + 1)
  }

  return {
    patient_id: PERSONA_IDS[personaKey],
    persona_key: personaKey,
    display_name: PERSONA_LABELS[personaKey],
    synced_at: syncedAt,
    integration: profile.integration,
    sleep_stream: {
      sleep_onset_timestamp: onset.toISOString(),
      wake_timestamp: wake.toISOString(),
      deep_sleep_duration_minutes: profile.sleep.deepMinutes,
      rem_duration_minutes: profile.sleep.remMinutes,
    },
    hrv_stream: {
      daily_average_hrv: profile.hrv.dailyAverage,
      intra_night_hrv_series: buildHrvSeries(onset, wake, profile.hrv),
    },
    light_stream: {
      lux_exposure_hours: profile.light.luxExposureHours,
    },
  }
}

export type MockIngestionGeneratorOptions = {
  /** Pull trigger time — defaults to fixed reference for reproducible UI tests. */
  syncedAt?: string
}

/**
 * Pull-based mock ingestion service — three circadian archetypes for UI and BTI engine dev.
 * Decoupled from UI controllers per CLAUDE.md architecture rules.
 */
export class MockIngestionDataGenerator {
  static listPersonaKeys(): MockPersonaKey[] {
    return [...MOCK_PERSONA_KEYS]
  }

  static getPersonaLabel(key: MockPersonaKey): string {
    return PERSONA_LABELS[key]
  }

  static generate(
    personaKey: MockPersonaKey,
    options: MockIngestionGeneratorOptions = {}
  ): IngestionLayerPayload {
    const syncedAt = options.syncedAt ?? MOCK_INGESTION_SYNC_REFERENCE
    return buildPayload(personaKey, syncedAt)
  }

  static generateAll(options: MockIngestionGeneratorOptions = {}): IngestionLayerPayload[] {
    return MOCK_PERSONA_KEYS.map((key) => MockIngestionDataGenerator.generate(key, options))
  }

  static getEarlyRiser(options?: MockIngestionGeneratorOptions): IngestionLayerPayload {
    return MockIngestionDataGenerator.generate('early-riser', options)
  }

  static getInsomniac(options?: MockIngestionGeneratorOptions): IngestionLayerPayload {
    return MockIngestionDataGenerator.generate('insomniac', options)
  }

  static getNightShiftWorker(options?: MockIngestionGeneratorOptions): IngestionLayerPayload {
    return MockIngestionDataGenerator.generate('night-shift-worker', options)
  }
}
