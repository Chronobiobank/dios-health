import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { normaliseAppleHealthSamples } from '@/lib/wearables/apple-health'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'
import { persistDlmoProxySnapshot } from '@/lib/circadian/persist-dlmo-proxy'

// Ingest Apple HealthKit sleep samples posted from an iOS Shortcut / companion app.
// Body: { samples: [{ start, end, deepMinutes?, remMinutes?, externalId? }] }
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { samples?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { logs, rejected } = normaliseAppleHealthSamples(body.samples)

  if (logs.length === 0) {
    return Response.json(
      { error: 'No valid sleep samples provided.', rejected },
      { status: 400 }
    )
  }

  const now = new Date().toISOString()

  await adminClient.from('patient_profiles').upsert({ id: user.id }, { onConflict: 'id' })

  // Register (or refresh) the Apple Health connection. No token — HealthKit is
  // device-local, so presence of this row marks the source as connected.
  await adminClient.from('wearable_connections').upsert(
    {
      patient_id: user.id,
      provider: 'apple_health',
      access_token: null,
      sync_status: 'ok',
      last_sync_at: now,
      last_error: null,
    },
    { onConflict: 'patient_id,provider' }
  )

  for (const log of logs) {
    await adminClient.from('wearable_sleep_logs').upsert(
      {
        patient_id: user.id,
        provider: 'apple_health',
        external_id: log.external_id,
        sleep_onset_timestamp: log.sleep_onset_timestamp,
        wake_timestamp: log.wake_timestamp,
        deep_sleep_duration_minutes: log.deep_sleep_duration_minutes,
        rem_duration_minutes: log.rem_duration_minutes,
        synced_at: now,
      },
      { onConflict: 'patient_id,provider,external_id' }
    )
  }

  await adminClient.from('patient_profiles').update({ last_device_sync_at: now }).eq('id', user.id)
  await refreshDeviceAlert(adminClient, user.id)
  await persistDlmoProxySnapshot(adminClient, user.id)

  return Response.json({ ok: true, ingested: logs.length, rejected })
}
