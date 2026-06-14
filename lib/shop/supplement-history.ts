import type { SupabaseClient } from '@supabase/supabase-js'

import { mapDbItem, mapDbOrder } from '@/lib/fulfillment/requirements'
import { getShopProduct } from '@/lib/shop/catalog'
import { resolvePatientProfileId } from '@/lib/shop/fulfillment-bridge'
import type {
  OrderFlow,
  ShopProductSlug,
  SupplementOrderEvent,
  SupplementOrderStatus,
} from '@/lib/shop/types'

const SKU_TO_SHOP_SLUG: Partial<Record<string, ShopProductSlug>> = {
  'supplement-d3-k2': 'd3-k2-protocol',
  'supplement-b-complex': 'b-complex-gominak',
  'supplement-magnesium': 'magnesium-glycinate',
}

function mapFulfillmentStatus(status: string): SupplementOrderStatus {
  if (status === 'dispatched' || status === 'completed') return 'shipped'
  if (status === 'ordered') return 'confirmed'
  return 'pending_fulfilment'
}

function mapOrderFlow(flow: string): OrderFlow {
  return flow === 'clinician_for_patient' ? 'practitioner_for_patient' : 'patient_self'
}

function metadataString(meta: Record<string, unknown>, key: string): string | null {
  const value = meta[key]
  return typeof value === 'string' && value.trim() ? value : null
}

function metadataNumber(meta: Record<string, unknown>, key: string): number | null {
  const value = meta[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function toSupplementOrderEvent(
  orderRow: Record<string, unknown>,
  itemRow: Record<string, unknown>
): SupplementOrderEvent {
  const order = mapDbOrder(orderRow, [mapDbItem(itemRow)])
  const item = order.items[0]
  const meta = item.metadata

  const productSlug =
    (metadataString(meta, 'product_slug') as ShopProductSlug | null) ??
    SKU_TO_SHOP_SLUG[item.sku] ??
    'd3-k2-protocol'

  const product = getShopProduct(productSlug)

  return {
    id: metadataString(meta, 'shop_order_id') ?? order.id,
    patientRecordId: order.cohortPatientRef ?? order.patientProfileId,
    patientName: metadataString(meta, 'patient_name') ?? 'Patient',
    productSlug,
    productName: metadataString(meta, 'product_name') ?? product?.name ?? item.title,
    micronutrientId: null,
    quantity: metadataNumber(meta, 'quantity_units') ?? 1,
    unitPriceGbp: metadataNumber(meta, 'unit_price_gbp') ?? metadataNumber(meta, 'total_gbp') ?? 0,
    totalGbp: metadataNumber(meta, 'total_gbp') ?? 0,
    protocolDose: metadataString(meta, 'protocol_dose') ?? product?.defaultProtocolDose ?? '',
    orderFlow: mapOrderFlow(order.orderFlow),
    orderedBy: metadataString(meta, 'ordered_by_name') ?? 'DIOS user',
    deliveryLine1: metadataString(meta, 'delivery_line1') ?? '',
    deliveryCity: metadataString(meta, 'delivery_city') ?? '',
    deliveryPostcode: metadataString(meta, 'delivery_postcode') ?? '',
    deliveryCountry: metadataString(meta, 'delivery_country') ?? '',
    status: mapFulfillmentStatus(String(item.status)),
    createdAt: item.createdAt,
    stripeSessionId: metadataString(meta, 'stripe_session_id'),
  }
}

async function loadSupplementRows(
  supabase: SupabaseClient,
  patientRecordId: string,
  options?: { patientName?: string; viewerUserId?: string; selfOrder?: boolean }
) {
  const patientProfileId = await resolvePatientProfileId(supabase, patientRecordId, {
    patientName: options?.patientName,
    selfProfileId: options?.viewerUserId,
    selfOrder: options?.selfOrder,
  })

  if (!patientProfileId) return []

  const filters = [`patient_profile_id.eq.${patientProfileId}`]
  if (patientRecordId !== patientProfileId) {
    filters.push(`cohort_patient_ref.eq.${patientRecordId}`)
  }

  const { data: orderRows, error } = await supabase
    .from('fulfillment_orders')
    .select('*')
    .or(filters.join(','))
    .order('created_at', { ascending: false })

  if (error || !orderRows?.length) return []

  const orderIds = orderRows.map((row) => row.id as string)
  const { data: itemRows } = await supabase
    .from('fulfillment_items')
    .select('*')
    .in('order_id', orderIds)
    .eq('item_type', 'supplement')
    .order('created_at', { ascending: false })

  if (!itemRows?.length) return []

  const orderById = new Map(orderRows.map((row) => [String(row.id), row as Record<string, unknown>]))
  const events: SupplementOrderEvent[] = []

  for (const itemRow of itemRows) {
    const orderRow = orderById.get(String(itemRow.order_id))
    if (!orderRow) continue
    events.push(toSupplementOrderEvent(orderRow, itemRow as Record<string, unknown>))
  }

  return events.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Supplement order history for a patient record ref or profile id. */
export async function fetchSupplementHistory(
  supabase: SupabaseClient,
  patientRecordId: string,
  options?: { patientName?: string; viewerUserId?: string }
): Promise<SupplementOrderEvent[]> {
  return loadSupplementRows(supabase, patientRecordId, options)
}

/** Lookup a single shop checkout by ord_* id or fulfillment order UUID. */
export async function getSupplementOrderById(
  supabase: SupabaseClient,
  orderId: string
): Promise<SupplementOrderEvent | null> {
  const { data: itemByMeta } = await supabase
    .from('fulfillment_items')
    .select('*, fulfillment_orders(*)')
    .eq('item_type', 'supplement')
    .filter('metadata->>shop_order_id', 'eq', orderId)
    .maybeSingle()

  if (itemByMeta?.fulfillment_orders) {
    return toSupplementOrderEvent(
      itemByMeta.fulfillment_orders as Record<string, unknown>,
      itemByMeta as Record<string, unknown>
    )
  }

  const { data: orderRow } = await supabase
    .from('fulfillment_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (!orderRow) return null

  const { data: itemRow } = await supabase
    .from('fulfillment_items')
    .select('*')
    .eq('order_id', orderId)
    .eq('item_type', 'supplement')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!itemRow) return null

  return toSupplementOrderEvent(orderRow as Record<string, unknown>, itemRow as Record<string, unknown>)
}
