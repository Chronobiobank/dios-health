import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { syncOuraForPatient } from '@/lib/wearables/sync-oura'
import { syncWhoopForPatient } from '@/lib/wearables/sync-whoop'
import { persistDlmoProxySnapshot } from '@/lib/circadian/persist-dlmo-proxy'

// Sync every connected token-based wearable for the patient, then refresh the
// free-tier DLMO proxy snapshot. (Apple Health pushes via its own ingest route.)
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: connections } = await supabase
    .from('wearable_connections')
    .select('provider')
    .eq('patient_id', user.id)

  const providers = new Set((connections ?? []).map((c) => c.provider))

  const results: Record<string, { nights: number; error?: string }> = {}
  if (providers.has('oura')) {
    results.oura = await syncOuraForPatient(adminClient, user.id)
  }
  if (providers.has('whoop')) {
    results.whoop = await syncWhoopForPatient(adminClient, user.id)
  }

  if (Object.keys(results).length === 0) {
    return Response.json({ error: 'No syncable wearable connected.' }, { status: 400 })
  }

  await persistDlmoProxySnapshot(adminClient, user.id)

  const nights = Object.values(results).reduce((sum, r) => sum + r.nights, 0)
  const errors = Object.entries(results)
    .filter(([, r]) => r.error)
    .map(([provider, r]) => `${provider}: ${r.error}`)

  if (errors.length > 0 && nights === 0) {
    return Response.json({ error: errors.join('; '), results }, { status: 500 })
  }

  return Response.json({ ok: true, nights, results })
}
