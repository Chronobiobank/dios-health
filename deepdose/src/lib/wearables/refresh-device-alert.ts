import type { SupabaseClient } from '@supabase/supabase-js'
import { shouldTriggerDeviceAlert } from '@/lib/wearables/device-health'
import {
  patientHasClinicalGradeDevice,
  resolvePrimaryWearableConnection,
} from '@/lib/wearables/tiers'

export async function refreshDeviceAlert(
  admin: SupabaseClient,
  patientId: string
): Promise<boolean> {
  const { data: connections } = await admin
    .from('wearable_connections')
    .select('provider, access_token, last_sync_at')
    .eq('patient_id', patientId)

  const active = connections ?? []
  const primary = resolvePrimaryWearableConnection(active)
  const hasConnection = active.length > 0
  const alert = shouldTriggerDeviceAlert({
    hasActiveConnection: hasConnection,
    accessTokenPresent: Boolean(primary?.access_token),
    lastSyncAt: primary?.last_sync_at ?? null,
  })

  const isPremium = patientHasClinicalGradeDevice(active)

  await admin
    .from('patient_profiles')
    .update({
      device_alert_triggered: alert,
      is_premium_tier: isPremium,
      last_device_sync_at: primary?.last_sync_at ?? null,
    })
    .eq('id', patientId)

  return alert
}
