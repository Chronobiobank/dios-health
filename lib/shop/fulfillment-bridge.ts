import type { SupabaseClient } from '@supabase/supabase-js'

import { getCatalogEntry } from '@/lib/fulfillment/catalog'
import { createFulfillmentOrder } from '@/lib/fulfillment/service'
import type { FulfillmentOrderFlow } from '@/lib/fulfillment/types'
import type { ShopProductSlug } from '@/lib/shop/types'
import { CLINICIAN_TRIAGE_DASHBOARD_VIEW } from '@/lib/clinicians/clinician-triage-dashboard'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Shop catalogue slugs mapped to protocol fulfillment SKUs. */
const SHOP_TO_FULFILLMENT_SKU: Partial<Record<ShopProductSlug, string>> = {
  'd3-k2-protocol': 'supplement-d3-k2',
  'b-complex-gominak': 'supplement-b-complex',
  'magnesium-glycinate': 'supplement-magnesium',
}

export type ShopFulfillmentSyncInput = {
  productSlug: ShopProductSlug
  patientRecordId: string
  patientName: string
  orderFlow: 'patient_self' | 'practitioner_for_patient'
  orderedByProfileId: string
  shopOrderId: string
  quantityLabel: string
  totalGbp: number
  protocolDose: string
}

function mapOrderFlow(flow: ShopFulfillmentSyncInput['orderFlow']): FulfillmentOrderFlow {
  return flow === 'practitioner_for_patient' ? 'clinician_for_patient' : 'patient_self'
}

export async function resolvePatientProfileId(
  supabase: SupabaseClient,
  recordId: string,
  options?: { patientName?: string; selfProfileId?: string; selfOrder?: boolean }
): Promise<string | null> {
  if (UUID_RE.test(recordId)) return recordId
  if (options?.selfOrder && options.selfProfileId) return options.selfProfileId

  const { data: triageRow } = await supabase
    .from(CLINICIAN_TRIAGE_DASHBOARD_VIEW)
    .select('patient_id')
    .eq('patient_ref', recordId)
    .maybeSingle<{ patient_id: string }>()

  if (triageRow?.patient_id) return triageRow.patient_id

  if (options?.patientName?.trim()) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', options.patientName.trim())
      .eq('role', 'patient')
      .maybeSingle<{ id: string }>()

    if (profile?.id) return profile.id
  }

  return options?.selfProfileId ?? null
}

/** Mirror a shop supplement checkout into fulfillment_orders + fulfillment_items. */
export async function syncShopCheckoutToFulfillment(
  supabase: SupabaseClient,
  input: ShopFulfillmentSyncInput
): Promise<{ synced: boolean; orderId?: string; error?: string }> {
  const sku = SHOP_TO_FULFILLMENT_SKU[input.productSlug]
  if (!sku || !getCatalogEntry(sku)) {
    return { synced: false, error: 'No fulfillment SKU for product' }
  }

  const patientProfileId = await resolvePatientProfileId(supabase, input.patientRecordId, {
    patientName: input.patientName,
    selfProfileId: input.orderedByProfileId,
    selfOrder: input.orderFlow === 'patient_self',
  })

  if (!patientProfileId) {
    return { synced: false, error: 'Could not resolve patient profile' }
  }

  const result = await createFulfillmentOrder(
    supabase,
    {
      patientProfileId,
      cohortPatientRef: input.patientRecordId,
      orderFlow: mapOrderFlow(input.orderFlow),
      requirementKeys: [sku],
    },
    input.orderedByProfileId
  )

  if (!result.order) {
    return { synced: false, error: result.error ?? 'Fulfillment order failed' }
  }

  const item = result.order.items[0]
  if (item) {
    await supabase
      .from('fulfillment_items')
      .update({
        metadata: {
          shop_order_id: input.shopOrderId,
          quantity_label: input.quantityLabel,
          total_gbp: input.totalGbp,
          protocol_dose: input.protocolDose,
          source: 'shop_checkout',
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)
  }

  return { synced: true, orderId: result.order.id }
}
