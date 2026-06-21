import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { DashboardDevicesPanel } from '@/components/patient/DashboardDevicesPanel'
import type { DeviceConnectionState } from '@/components/patient/WearableDeviceCard'
import { isOuraConfigured } from '@/lib/wearables/oura'
import { isWhoopConfigured } from '@/lib/wearables/whoop'
import { refreshDeviceAlert } from '@/lib/wearables/refresh-device-alert'
import {
  WEARABLE_PROVIDERS_ORDERED,
} from '@/lib/wearables/tiers'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'

const WEARABLES = WEARABLE_PROVIDERS_ORDERED.filter((p) => p.tier === 'core')
const CLINICAL_KIT = WEARABLE_PROVIDERS_ORDERED.filter((p) => p.tier === 'clinical')

export default async function PatientDataPage({
  searchParams,
}: {
  searchParams: Promise<{ oura?: string; whoop?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/dashboard/data')
  }

  const nextOnboardingStep = await resolveOnboardingStep(supabase, user.id)
  if (nextOnboardingStep === 'consent' || nextOnboardingStep === 'medications') {
    redirect(onboardingPathForStep(nextOnboardingStep))
  }

  await refreshDeviceAlert(adminClient, user.id)

  const params = await searchParams

  const { data: rows } = await supabase
    .from('wearable_connections')
    .select('provider, last_sync_at, sync_status, last_error')
    .eq('patient_id', user.id)

  const connections: Record<string, DeviceConnectionState | null> = {}

  for (const provider of WEARABLE_PROVIDERS_ORDERED) {
    const row = (rows ?? []).find((r) => r.provider === provider.id)
    connections[provider.id] = row
      ? {
          connected: true,
          lastSyncAt: row.last_sync_at,
          syncStatus: row.sync_status,
          lastError: row.last_error,
        }
      : null
  }

  const flash: {
    oura?: 'connected' | 'error'
    whoop?: 'connected' | 'error'
  } = {}

  if (params.oura === 'connected' || params.oura === 'error') {
    flash.oura = params.oura
  }
  if (params.whoop === 'connected' || params.whoop === 'error') {
    flash.whoop = params.whoop
  }

  return (
    <div className="dash-meds space-y-8">
      <header className="seco-landing__copy-stack dash-meds__page-head">
        <h1 className="seco-page__title dash-meds__page-title">Smart devices</h1>
      </header>

      <DashboardDevicesPanel
        wearables={WEARABLES}
        clinicalKit={CLINICAL_KIT}
        connections={connections}
        ouraConfigured={isOuraConfigured()}
        whoopConfigured={isWhoopConfigured()}
        flash={Object.keys(flash).length ? flash : undefined}
      />
    </div>
  )
}
