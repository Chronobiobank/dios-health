import type { SupabaseClient } from '@supabase/supabase-js'

/** Advance lab fulfillment items when a blood panel is ingested. */
export async function syncLabFulfillmentAfterPanel(
  supabase: SupabaseClient,
  patientProfileId: string
): Promise<void> {
  const { data: orders } = await supabase
    .from('fulfillment_orders')
    .select('id')
    .eq('patient_profile_id', patientProfileId)

  if (!orders?.length) return

  const orderIds = orders.map((row) => row.id as string)
  const now = new Date().toISOString()

  await supabase
    .from('fulfillment_items')
    .update({
      status: 'results_imported',
      completed_at: now,
      updated_at: now,
    })
    .in('order_id', orderIds)
    .eq('item_type', 'lab_test')
    .neq('status', 'results_imported')
}

/** Advance TipTraQ assessment items when a three-night block is on file. */
export async function syncAssessmentFulfillmentAfterTipTraq(
  supabase: SupabaseClient,
  patientProfileId: string,
  minNights = 3
): Promise<void> {
  const { count } = await supabase
    .from('tiptraq_nights')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientProfileId)

  if ((count ?? 0) < minNights) return

  const { data: orders } = await supabase
    .from('fulfillment_orders')
    .select('id')
    .eq('patient_profile_id', patientProfileId)

  if (!orders?.length) return

  const orderIds = orders.map((row) => row.id as string)
  const now = new Date().toISOString()

  await supabase
    .from('fulfillment_items')
    .update({
      status: 'report_available',
      completed_at: now,
      updated_at: now,
    })
    .in('order_id', orderIds)
    .eq('item_type', 'assessment')
    .in('status', ['order_kit', 'shipped', 'completed', 'ordered'])
}
