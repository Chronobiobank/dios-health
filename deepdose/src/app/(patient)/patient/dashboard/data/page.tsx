import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { WearableConnectCard } from '@/components/patient/WearableConnectCard'
import { isOuraConfigured } from '@/lib/wearables/oura'
import { hoursSince, DEVICE_STALE_HOURS } from '@/lib/wearables/device-health'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'

export default async function PatientDataPage({
  searchParams,
}: {
  searchParams: Promise<{ oura?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/dashboard/data')
  }

  await refreshDeviceAlert(adminClient, user.id)

  const params = await searchParams

  const { data: connection } = await supabase
    .from('wearable_connections')
    .select('last_sync_at, sync_status, last_error')
    .eq('patient_id', user.id)
    .eq('provider', 'oura')
    .maybeSingle()

  const { count: sleepNights } = await supabase
    .from('wearable_sleep_logs')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  const hours = hoursSince(connection?.last_sync_at)
  const syncHealthy = connection && hours !== null && hours <= DEVICE_STALE_HOURS

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Data sources</p>
        <h1 className="seco-app-section-title">Smart devices</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Connect wearables to improve circadian score confidence and dosing accuracy.
        </p>
      </header>

      {params.oura === 'connected' && (
        <p className="text-sm text-success">Oura connected successfully.</p>
      )}
      {params.oura === 'error' && (
        <p className="text-sm text-warning">Oura connection failed. Try again.</p>
      )}

      <WearableConnectCard
        connected={Boolean(connection)}
        lastSyncAt={connection?.last_sync_at ?? null}
        syncStatus={connection?.sync_status ?? null}
        lastError={connection?.last_error ?? null}
        ouraConfigured={isOuraConfigured()}
      />

      {connection && (
        <div className="seco-app-card p-5 md:p-6">
          <p className="seco-page__eyebrow mb-1">Ingestion summary</p>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>Sleep nights on file: {sleepNights ?? 0}</li>
            <li>
              Sync health:{' '}
              {syncHealthy ? 'Within 36h window' : 'Stale or missing — clinician may be alerted'}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
