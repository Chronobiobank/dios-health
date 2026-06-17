import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchOuraSleep, ouraDurationMinutes } from '@/lib/wearables/oura'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'

function dateRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export async function syncOuraForPatient(
  admin: SupabaseClient,
  patientId: string
): Promise<{ nights: number; error?: string }> {
  const { data: connection, error: connError } = await admin
    .from('wearable_connections')
    .select('id, access_token')
    .eq('patient_id', patientId)
    .eq('provider', 'oura')
    .maybeSingle()

  if (connError || !connection?.access_token) {
    return { nights: 0, error: 'Oura not connected.' }
  }

  await admin
    .from('wearable_connections')
    .update({ sync_status: 'syncing', last_error: null })
    .eq('id', connection.id)

  try {
    const { start, end } = dateRange(14)
    const sessions = await fetchOuraSleep(connection.access_token, start, end)

    for (const session of sessions) {
      if (!session.bedtime_start || !session.bedtime_end) continue

      await admin.from('wearable_sleep_logs').upsert(
        {
          patient_id: patientId,
          provider: 'oura',
          external_id: session.id,
          sleep_onset_timestamp: session.bedtime_start,
          wake_timestamp: session.bedtime_end,
          deep_sleep_duration_minutes: ouraDurationMinutes(session.deep_sleep_duration),
          rem_duration_minutes: ouraDurationMinutes(session.rem_sleep_duration),
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'patient_id,provider,external_id' }
      )
    }

    const now = new Date().toISOString()
    await admin
      .from('wearable_connections')
      .update({ sync_status: 'ok', last_sync_at: now, last_error: null })
      .eq('id', connection.id)

    await admin
      .from('patient_profiles')
      .update({ last_device_sync_at: now })
      .eq('id', patientId)

    await refreshDeviceAlert(admin, patientId)

    return { nights: sessions.length }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    await admin
      .from('wearable_connections')
      .update({ sync_status: 'error', last_error: message })
      .eq('id', connection.id)
    await refreshDeviceAlert(admin, patientId)
    return { nights: 0, error: message }
  }
}

export async function countRecentSleepNights(
  supabase: SupabaseClient,
  patientId: string,
  days = 7
): Promise<number> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { count } = await supabase
    .from('wearable_sleep_logs')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .gte('synced_at', since.toISOString())

  return count ?? 0
}
