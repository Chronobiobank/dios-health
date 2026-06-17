/** Device interruption threshold — CLAUDE.md §5 */
export const DEVICE_STALE_HOURS = 36

export function hoursSince(iso: string | null | undefined): number | null {
  if (!iso) return null
  const ms = Date.now() - new Date(iso).getTime()
  return ms / (1000 * 60 * 60)
}

export function shouldTriggerDeviceAlert(input: {
  hasActiveConnection: boolean
  accessTokenPresent: boolean
  lastSyncAt: string | null
}): boolean {
  if (!input.hasActiveConnection || !input.accessTokenPresent) {
    return true
  }
  const hours = hoursSince(input.lastSyncAt)
  if (hours === null) return true
  return hours > DEVICE_STALE_HOURS
}

/** 0–100 wearable data quality for CCS dataQualityScore */
export function wearableQualityScore(input: {
  connected: boolean
  lastSyncAt: string | null
  recentSleepNights: number
}): number | undefined {
  if (!input.connected) return undefined

  let score = 40
  const hours = hoursSince(input.lastSyncAt)
  if (hours !== null) {
    if (hours <= 24) score += 35
    else if (hours <= DEVICE_STALE_HOURS) score += 20
    else score += 0
  }
  score += Math.min(25, input.recentSleepNights * 5)
  return Math.min(100, score)
}
