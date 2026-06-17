import type { SupabaseClient } from '@supabase/supabase-js'
import { shouldTriggerDeviceAlert } from '@/lib/wearables/device-health'

export async function refreshDeviceAlert(
  admin: SupabaseClient,
  patientId: string
): Promise<boolean> {
  const { data: connections } = await admin
    .from('wearable_connections')
    .select('provider, access_token, last_sync_at')
    .eq('patient_id', patientId)

  const active = connections ?? []
  const hasConnection = active.length > 0
  const primary = active[0]
  const alert = shouldTriggerDeviceAlert({
    hasActiveConnection: hasConnection,
    accessTokenPresent: Boolean(primary?.access_token),
    lastSyncAt: primary?.last_sync_at ?? null,
  })

  await admin
    .from('patient_profiles')
    .update({ device_alert_triggered: alert })
    .eq('id', patientId)

  return alert
}
