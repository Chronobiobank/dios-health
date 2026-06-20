import type { SupabaseClient } from '@supabase/supabase-js'
import { estimateDlmoProxy, type DlmoProxyResult, type SleepLogSample } from './dlmo'

const RECENT_NIGHTS_LIMIT = 14
const RECENT_WINDOW_DAYS = 21

/**
 * Pull the free-tier inputs (chronotype questionnaire + recent phone / wearable
 * sleep logs) and compute the smartphone DLMO proxy. Read-only and idempotent —
 * safe to call on every dashboard load.
 */
export async function loadDlmoProxy(
  supabase: SupabaseClient,
  patientId: string
): Promise<DlmoProxyResult> {
  const since = new Date()
  since.setDate(since.getDate() - RECENT_WINDOW_DAYS)

  const [chronotypeResult, sleepResult] = await Promise.all([
    supabase
      .from('chronotype_profiles')
      .select('msf_sc')
      .eq('patient_id', patientId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('wearable_sleep_logs')
      .select('sleep_onset_timestamp, wake_timestamp')
      .eq('patient_id', patientId)
      .gte('synced_at', since.toISOString())
      .order('sleep_onset_timestamp', { ascending: false })
      .limit(RECENT_NIGHTS_LIMIT),
  ])

  const msfScHours =
    chronotypeResult.data?.msf_sc != null ? Number(chronotypeResult.data.msf_sc) : null

  const sleepLogs: SleepLogSample[] = (sleepResult.data ?? [])
    .filter((row) => row.sleep_onset_timestamp && row.wake_timestamp)
    .map((row) => ({
      sleepOnset: row.sleep_onset_timestamp as string,
      wake: row.wake_timestamp as string,
    }))

  return estimateDlmoProxy({ sleepLogs, msfScHours })
}
