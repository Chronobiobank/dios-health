import type { SupabaseClient } from '@supabase/supabase-js'
import { loadDlmoProxy } from './load-dlmo-proxy'

/**
 * Compute the smartphone/wearable DLMO proxy and store a snapshot in
 * dlmo_estimates (method 'smartphone_l3'). Called after a wearable sync so the
 * patient's free-tier body-clock reading is captured over time and can feed the
 * chronobiobank + layer merge. No-ops when there is no usable signal yet.
 */
export async function persistDlmoProxySnapshot(
  client: SupabaseClient,
  patientId: string
): Promise<{ persisted: boolean }> {
  const proxy = await loadDlmoProxy(client, patientId)

  if (!proxy.available || proxy.dlmoTime === null) {
    return { persisted: false }
  }

  const { error } = await client.from('dlmo_estimates').insert({
    patient_id: patientId,
    method: 'smartphone_l3',
    dlmo_time: proxy.dlmoTime,
    confidence: proxy.confidence,
    phase_offset: proxy.phaseOffsetMinutes,
    raw_data: proxy,
  })

  return { persisted: !error }
}
