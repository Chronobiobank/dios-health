/** Wearable providers ordered by clinical sleep-monitoring accuracy (highest first). */

export type WearableTier = 'clinical' | 'core'

export type WearableProviderId = 'tiptraq' | 'oura' | 'whoop' | 'apple_health'

export type WearableProvider = {
  id: WearableProviderId
  tier: WearableTier
  /** 1 = most clinically reliable */
  clinicalRank: number
  displayName: string
  eyebrow: string
  description: string
  streams: string
  /** Caps data-quality contribution to circadian score (0–100) */
  clinicalReliabilityMax: number
  setsPremiumTier: boolean
  connectable: boolean
}

export const WEARABLE_PROVIDERS: Record<WearableProviderId, WearableProvider> = {
  tiptraq: {
    id: 'tiptraq',
    tier: 'clinical',
    clinicalRank: 1,
    displayName: 'TipTraQ',
    eyebrow: 'Clinical tier',
    description:
      'GP-ordered home kit: £149 for 3 nights — half WatchPAT rental — precision dosing profile plus £99 quarterly re-reads. Free with research opt-in.',
    streams: 'SpO₂ · Respiratory events · DLMO calibration',
    clinicalReliabilityMax: 100,
    setsPremiumTier: true,
    connectable: false,
  },
  oura: {
    id: 'oura',
    tier: 'core',
    clinicalRank: 2,
    displayName: 'Oura Ring',
    eyebrow: 'Core tier',
    description: 'Validated sleep staging — onset, wake, deep and REM duration.',
    streams: 'Sleep stream · HRV',
    clinicalReliabilityMax: 85,
    setsPremiumTier: false,
    connectable: true,
  },
  whoop: {
    id: 'whoop',
    tier: 'core',
    clinicalRank: 3,
    displayName: 'Whoop',
    eyebrow: 'Core tier',
    description: 'Recovery and strain signals; sleep timing from wrist-based inference.',
    streams: 'HRV · Recovery · Sleep duration',
    clinicalReliabilityMax: 76,
    setsPremiumTier: false,
    connectable: true,
  },
  apple_health: {
    id: 'apple_health',
    tier: 'core',
    clinicalRank: 4,
    displayName: 'Apple Health',
    eyebrow: 'Core tier',
    description: 'User-authorized HealthKit sleep and light exposure; variable sensor quality.',
    streams: 'Sleep · Light exposure',
    clinicalReliabilityMax: 68,
    setsPremiumTier: false,
    connectable: false,
  },
}

/** TipTraQ first, then descending clinical reliability */
export const WEARABLE_PROVIDERS_ORDERED: WearableProvider[] = Object.values(WEARABLE_PROVIDERS).sort(
  (a, b) => a.clinicalRank - b.clinicalRank
)

export function getWearableProvider(id: string): WearableProvider | undefined {
  return id in WEARABLE_PROVIDERS ? WEARABLE_PROVIDERS[id as WearableProviderId] : undefined
}

type ConnectionRow = {
  provider: string
  last_sync_at: string | null
  access_token?: string | null
}

/** Highest-tier active connection for scoring and device alerts */
export function resolvePrimaryWearableConnection(
  connections: ConnectionRow[]
): (ConnectionRow & { meta: WearableProvider }) | null {
  let best: (ConnectionRow & { meta: WearableProvider }) | null = null

  for (const row of connections) {
    const meta = getWearableProvider(row.provider)
    if (!meta) continue
    if (!best || meta.clinicalRank < best.meta.clinicalRank) {
      best = { ...row, meta }
    }
  }

  return best
}

export function patientHasClinicalGradeDevice(connections: ConnectionRow[]): boolean {
  return connections.some((c) => getWearableProvider(c.provider)?.setsPremiumTier)
}
