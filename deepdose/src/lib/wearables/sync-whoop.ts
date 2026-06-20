import type { SupabaseClient } from '@supabase/supabase-js'
import {
  fetchWhoopSleep,
  refreshWhoopToken,
  whoopMillisToMinutes,
  isWhoopConfigured,
} from '@/lib/wearables/whoop'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'

function isoRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function syncWhoopForPatient(
  admin: SupabaseClient,
  patientId: string
): Promise<{ nights: number; error?: string }> {
  if (!isWhoopConfigured()) {
    return { nights: 0, error: 'Whoop not configured.' }
  }

  const { data: connection, error: connError } = await admin
    .from('wearable_connections')
    .select('id, access_token, refresh_token, token_expires_at')
    .eq('patient_id', patientId)
    .eq('provider', 'whoop')
    .maybeSingle()

  if (connError || !connection?.access_token) {
    return { nights: 0, error: 'Whoop not connected.' }
  }

  await admin
    .from('wearable_connections')
    .update({ sync_status: 'syncing', last_error: null })
    .eq('id', connection.id)

  try {
    // Whoop access tokens are short-lived; refresh when expired.
    let accessToken = connection.access_token
    const expiresAt = connection.token_expires_at
      ? new Date(connection.token_expires_at).getTime()
      : 0
    if (expiresAt && expiresAt < Date.now() + 60_000 && connection.refresh_token) {
      const refreshed = await refreshWhoopToken(connection.refresh_token)
      accessToken = refreshed.access_token
      await admin
        .from('wearable_connections')
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token ?? connection.refresh_token,
          token_expires_at: refreshed.expires_in
            ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
            : null,
        })
        .eq('id', connection.id)
    }

    const { start, end } = isoRange(14)
    const records = await fetchWhoopSleep(accessToken, start, end)

    let nights = 0
    for (const record of records) {
      if (record.nap || !record.start || !record.end) continue
      nights += 1
      await admin.from('wearable_sleep_logs').upsert(
        {
          patient_id: patientId,
          provider: 'whoop',
          external_id: String(record.id),
          sleep_onset_timestamp: record.start,
          wake_timestamp: record.end,
          deep_sleep_duration_minutes: whoopMillisToMinutes(
            record.score?.stage_summary?.total_slow_wave_sleep_time_milli
          ),
          rem_duration_minutes: whoopMillisToMinutes(
            record.score?.stage_summary?.total_rem_sleep_time_milli
          ),
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

    await admin.from('patient_profiles').update({ last_device_sync_at: now }).eq('id', patientId)
    await refreshDeviceAlert(admin, patientId)

    return { nights }
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
