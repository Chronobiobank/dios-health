import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { WearableDeviceCard } from '@/components/patient/WearableDeviceCard'
import { isOuraConfigured } from '@/lib/wearables/oura'
import { hoursSince, DEVICE_STALE_HOURS } from '@/lib/wearables/device-health'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'
import {
  WEARABLE_PROVIDERS_ORDERED,
  resolvePrimaryWearableConnection,
} from '@/lib/wearables/tiers'

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

  const { data: connections } = await supabase
    .from('wearable_connections')
    .select('provider, last_sync_at, sync_status, last_error')
    .eq('patient_id', user.id)

  const connectionByProvider = new Map(
    (connections ?? []).map((c) => [c.provider, c])
  )

  const primary = resolvePrimaryWearableConnection(connections ?? [])

  const { count: sleepNights } = await supabase
    .from('wearable_sleep_logs')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  const hours = hoursSince(primary?.last_sync_at)
  const syncHealthy = primary && hours !== null && hours <= DEVICE_STALE_HOURS

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Data sources</p>
        <h1 className="seco-app-section-title">Smart devices</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Devices are ranked by clinical sleep accuracy. TipTraQ is medical-grade; consumer
          wearables improve confidence but cap lower.
        </p>
      </header>

      {params.oura === 'connected' && (
        <p className="text-sm text-success">Oura connected successfully.</p>
      )}
      {params.oura === 'error' && (
        <p className="text-sm text-warning">Oura connection failed. Try again.</p>
      )}

      <div className="space-y-4">
        {WEARABLE_PROVIDERS_ORDERED.map((provider) => {
          const row = connectionByProvider.get(provider.id)
          return (
            <WearableDeviceCard
              key={provider.id}
              provider={provider}
              ouraConfigured={isOuraConfigured()}
              connection={
                row
                  ? {
                      connected: true,
                      lastSyncAt: row.last_sync_at,
                      syncStatus: row.sync_status,
                      lastError: row.last_error,
                    }
                  : null
              }
            />
          )
        })}
      </div>

      {primary && (
        <div className="seco-app-card p-5 md:p-6">
          <p className="seco-page__eyebrow mb-1">Ingestion summary</p>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>
              Primary source: {primary.meta.displayName} (clinical rank #
              {primary.meta.clinicalRank})
            </li>
            <li>Sleep nights on file: {sleepNights ?? 0}</li>
            <li>
              Sync health:{' '}
              {syncHealthy ? 'Within 36h window' : 'Stale or missing — clinician may be alerted'}
            </li>
            <li>Data quality cap: {primary.meta.clinicalReliabilityMax}/100</li>
          </ul>
        </div>
      )}
    </div>
  )
}
