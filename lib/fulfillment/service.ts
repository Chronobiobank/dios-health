import type { SupabaseClient } from '@supabase/supabase-js'

import { getCatalogEntry } from '@/lib/fulfillment/catalog'
import {
  buildProtocolRequirements,
  mapDbItem,
  mapDbOrder,
  splitRequirements,
  type ProtocolContext,
} from '@/lib/fulfillment/requirements'
import { initialItemStatus } from '@/lib/fulfillment/status-labels'
import type {
  ClinicianFulfillmentSummary,
  CreateFulfillmentOrderInput,
  FulfillmentOrder,
  PatientFulfillmentSummary,
  ProtocolRequirement,
} from '@/lib/fulfillment/types'

type Db = SupabaseClient

function tablesAvailable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return true
  return error.code !== '42P01' && !error.message?.includes('does not exist')
}

export async function fetchPatientOrders(
  supabase: Db,
  patientProfileId: string
): Promise<FulfillmentOrder[]> {
  const { data: orderRows, error } = await supabase
    .from('fulfillment_orders')
    .select('*')
    .eq('patient_profile_id', patientProfileId)
    .order('created_at', { ascending: false })

  if (!tablesAvailable(error)) {
    return []
  }

  if (!orderRows?.length) {
    return []
  }

  const orderIds = orderRows.map((r) => r.id as string)
  const { data: itemRows } = await supabase
    .from('fulfillment_items')
    .select('*')
    .in('order_id', orderIds)
    .order('created_at', { ascending: true })

  const itemsByOrder = new Map<string, ReturnType<typeof mapDbItem>[]>()
  for (const row of itemRows ?? []) {
    const orderId = String(row.order_id)
    const list = itemsByOrder.get(orderId) ?? []
    list.push(mapDbItem(row as Record<string, unknown>))
    itemsByOrder.set(orderId, list)
  }

  return orderRows.map((row) =>
    mapDbOrder(row as Record<string, unknown>, itemsByOrder.get(String(row.id)) ?? [])
  )
}

export async function resolvePatientProtocolContext(
  supabase: Db,
  patientProfileId: string
): Promise<ProtocolContext> {
  const { data: protocol } = await supabase
    .from('patient_protocols')
    .select('protocol_type, review_at, status')
    .eq('patient_id', patientProfileId)
    .eq('status', 'active')
    .maybeSingle<{ protocol_type: string; review_at: string | null; status: string }>()

  const [{ count: bloodCount }, { count: tiptraqCount }] = await Promise.all([
    supabase
      .from('blood_circadian_panels')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientProfileId),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientProfileId),
  ])

  if (!protocol?.protocol_type) {
    return {
      protocolType: 'unassigned',
      hasBloodPanel: (bloodCount ?? 0) > 0,
      hasTipTraqBlock: (tiptraqCount ?? 0) >= 3,
      reviewAt: null,
    }
  }

  return {
    protocolType: protocol.protocol_type,
    reviewAt: protocol.review_at,
    hasBloodPanel: (bloodCount ?? 0) > 0,
    hasTipTraqBlock: (tiptraqCount ?? 0) >= 3,
  }
}

export async function getPatientFulfillmentSummary(
  supabase: Db,
  patientProfileId: string
): Promise<PatientFulfillmentSummary> {
  const [orders, ctx] = await Promise.all([
    fetchPatientOrders(supabase, patientProfileId),
    resolvePatientProtocolContext(supabase, patientProfileId),
  ])

  const requirements = buildProtocolRequirements(ctx, orders)
  const { upcomingTests, upcomingReorders, outstanding } = splitRequirements(requirements)

  return {
    requirements,
    upcomingTests,
    upcomingReorders,
    outstanding,
    recentOrders: orders.slice(0, 5),
  }
}

export async function getRequirementsForCohortPatient(
  protocolType: string,
  cohortRef: string,
  orders: FulfillmentOrder[] = []
): Promise<ProtocolRequirement[]> {
  const ctx: ProtocolContext = {
    protocolType,
    hasBloodPanel: false,
    hasTipTraqBlock: cohortRef === 'SEAN-001',
    reviewAt: null,
  }
  return buildProtocolRequirements(ctx, orders)
}

export async function createFulfillmentOrder(
  supabase: Db,
  input: CreateFulfillmentOrderInput,
  orderedByProfileId: string
): Promise<{ order: FulfillmentOrder | null; error?: string }> {
  const { data: orderRow, error: orderError } = await supabase
    .from('fulfillment_orders')
    .insert({
      patient_profile_id: input.patientProfileId,
      cohort_patient_ref: input.cohortPatientRef ?? null,
      ordered_by_profile_id: orderedByProfileId,
      order_flow: input.orderFlow,
      status: 'open',
    })
    .select('*')
    .single()

  if (orderError || !orderRow) {
    return { order: null, error: orderError?.message ?? 'Could not create order' }
  }

  const items = input.requirementKeys
    .map((key) => {
      const entry = getCatalogEntry(key)
      if (!entry) return null
      return {
        order_id: orderRow.id,
        item_type: entry.kind,
        sku: entry.sku,
        provider_id: entry.providerId,
        title: entry.title,
        status: initialItemStatus(entry.kind),
        requirement_key: entry.sku,
        due_at: entry.cadenceDays
          ? new Date(Date.now() + entry.cadenceDays * 86400000).toISOString()
          : null,
        metadata: {},
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)

  const { data: itemRows, error: itemError } = await supabase
    .from('fulfillment_items')
    .insert(items)
    .select('*')

  if (itemError) {
    return { order: null, error: itemError.message }
  }

  return {
    order: mapDbOrder(
      orderRow as Record<string, unknown>,
      (itemRows ?? []).map((r) => mapDbItem(r as Record<string, unknown>))
    ),
  }
}

/** Clinician cohort summary — uses demo cohort when DB panel is sparse. */
export function buildClinicianFulfillmentSummary(
  patients: Array<{ ref: string; name: string; protocol: string }>
): ClinicianFulfillmentSummary {
  const patientsMissingTests: ClinicianFulfillmentSummary['patientsMissingTests'] = []
  const patientsOverdueMonitoring: ClinicianFulfillmentSummary['patientsOverdueMonitoring'] = []
  const outstandingTasks: ClinicianFulfillmentSummary['outstandingTasks'] = []
  const unreviewedResults: ClinicianFulfillmentSummary['unreviewedResults'] = []

  for (const patient of patients) {
    const requirements = buildProtocolRequirements({
      protocolType: patient.protocol,
      hasBloodPanel: patient.ref !== 'SEAN-001',
      hasTipTraqBlock: patient.ref === 'SEAN-001',
    })

    for (const req of requirements) {
      if (req.kind === 'lab_test' && req.status === 'due') {
        patientsMissingTests.push({ patientRef: patient.ref, patientName: patient.name, requirement: req })
      }
      if (req.status === 'overdue') {
        patientsOverdueMonitoring.push({ patientRef: patient.ref, patientName: patient.name, requirement: req })
      }
      if (req.status === 'due' || req.status === 'overdue') {
        outstandingTasks.push({ patientRef: patient.ref, patientName: patient.name, requirement: req })
      }
      if (req.kind === 'assessment' && req.status === 'ordered') {
        unreviewedResults.push({ patientRef: patient.ref, patientName: patient.name, requirement: req })
      }
    }

    if (patient.ref === 'SEAN-001') {
      unreviewedResults.push({
        patientRef: patient.ref,
        patientName: patient.name,
        requirement: {
          key: 'tiptraq-hsat-3night',
          kind: 'assessment',
          sku: 'tiptraq-hsat-3night',
          title: 'TipTraQ HSAT kit (3 nights)',
          providerId: 'tiptraq',
          status: 'ordered',
          dueAt: null,
          rationale: 'Report available — awaiting clinician review.',
          orderId: null,
          itemId: null,
        },
      })
    }
  }

  return { patientsMissingTests, patientsOverdueMonitoring, outstandingTasks, unreviewedResults }
}
