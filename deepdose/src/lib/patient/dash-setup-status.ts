import { hoursSince, DEVICE_STALE_HOURS } from '@/lib/wearables/device-health'
import { resolvePrimaryWearableConnection } from '@/lib/wearables/tiers'

export type DashSetupRowStatus = 'done' | 'optional' | 'attention' | 'empty'

export type DashSetupRow = {
  id: 'medicines' | 'rhythm' | 'devices'
  label: string
  href: string
  status: DashSetupRowStatus
  meta: string
}

type BuildDashSetupRowsInput = {
  medCount: number
  hasRhythm: boolean
  deviceAlertTriggered: boolean
  connections: { provider: string; last_sync_at: string | null }[]
}

export function buildDashSetupRows(input: BuildDashSetupRowsInput): DashSetupRow[] {
  const medicines: DashSetupRow = {
    id: 'medicines',
    label: 'Medicines',
    href: '/patient/dashboard/medications',
    status: input.medCount > 0 ? 'done' : 'empty',
    meta:
      input.medCount > 0
        ? `${input.medCount} on dash`
        : 'Not set',
  }

  const rhythm: DashSetupRow = {
    id: 'rhythm',
    label: 'Rhythm',
    href: '/patient/dashboard/rhythm',
    status: input.hasRhythm ? 'done' : 'optional',
    meta: input.hasRhythm ? 'Baselined' : 'Optional',
  }

  const primary = resolvePrimaryWearableConnection(input.connections)
  let devices: DashSetupRow

  if (!primary) {
    devices = {
      id: 'devices',
      label: 'Devices',
      href: '/patient/dashboard/data',
      status: 'optional',
      meta: 'Not connected',
    }
  } else {
    const hours = hoursSince(primary.last_sync_at)
    const syncHealthy = hours !== null && hours <= DEVICE_STALE_HOURS
    const stale = input.deviceAlertTriggered || !syncHealthy

    devices = {
      id: 'devices',
      label: 'Devices',
      href: '/patient/dashboard/data',
      status: stale ? 'attention' : 'done',
      meta: stale
        ? 'Sync interrupted'
        : `${primary.meta.displayName} · synced`,
    }
  }

  return [medicines, rhythm, devices]
}
