import { catalogForProtocol, getCatalogEntry } from '@/lib/fulfillment/catalog'
import type {
  FulfillmentItem,
  FulfillmentItemKind,
  FulfillmentOrder,
  ProtocolRequirement,
  RequirementStatus,
} from '@/lib/fulfillment/types'

export type ProtocolContext = {
  protocolType: string
  reviewAt?: string | null
  hasBloodPanel?: boolean
  hasTipTraqBlock?: boolean
}

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function resolveRequirementStatus(
  entrySku: string,
  orders: FulfillmentOrder[],
  ctx: ProtocolContext
): { status: RequirementStatus; orderId: string | null; itemId: string | null; dueAt: string | null } {
  for (const order of orders) {
    for (const item of order.items) {
      if (item.requirementKey === entrySku || item.sku === entrySku) {
        if (item.status === 'results_imported' || item.status === 'clinician_reviewed' || item.status === 'completed') {
          return { status: 'completed', orderId: order.id, itemId: item.id, dueAt: item.dueAt }
        }
        if (item.status === 'overdue') {
          return { status: 'overdue', orderId: order.id, itemId: item.id, dueAt: item.dueAt }
        }
        return { status: 'ordered', orderId: order.id, itemId: item.id, dueAt: item.dueAt }
      }
    }
  }

  const entry = getCatalogEntry(entrySku)
  if (!entry) {
    return { status: 'due', orderId: null, itemId: null, dueAt: null }
  }

  if (entry.kind === 'lab_test' && ctx.hasBloodPanel) {
    const dueAt = ctx.reviewAt ?? daysFromNow(entry.cadenceDays ?? 90)
    const overdue = new Date(dueAt).getTime() < Date.now()
    return {
      status: overdue ? 'overdue' : 'due',
      orderId: null,
      itemId: null,
      dueAt,
    }
  }

  if (entry.kind === 'assessment' && ctx.hasTipTraqBlock) {
    return { status: 'completed', orderId: null, itemId: null, dueAt: null }
  }

  const dueAt = entry.cadenceDays ? daysFromNow(entry.cadenceDays) : null
  return { status: 'due', orderId: null, itemId: null, dueAt }
}

export function buildProtocolRequirements(
  ctx: ProtocolContext,
  orders: FulfillmentOrder[] = []
): ProtocolRequirement[] {
  const entries = catalogForProtocol(ctx.protocolType)

  return entries.map((entry) => {
    const resolved = resolveRequirementStatus(entry.sku, orders, ctx)
    return {
      key: entry.sku,
      kind: entry.kind,
      sku: entry.sku,
      title: entry.title,
      providerId: entry.providerId,
      status: resolved.status,
      dueAt: resolved.dueAt,
      rationale: protocolRationale(entry.kind, ctx.protocolType),
      orderId: resolved.orderId,
      itemId: resolved.itemId,
    }
  })
}

function protocolRationale(kind: FulfillmentItemKind, protocolType: string): string {
  const p = protocolType.toLowerCase()
  if (kind === 'lab_test') {
    if (p.includes('coimbra')) return 'Required between-panel safety monitoring on Coimbra protocols.'
    return 'Required lab cadence for your active protocol.'
  }
  if (kind === 'assessment') return 'Three-night sleep block for dose window confidence.'
  return 'Protocol-linked supplement — ordered from your requirement list.'
}

export function splitRequirements(requirements: ProtocolRequirement[]) {
  const upcomingTests = requirements.filter(
    (r) => r.kind === 'lab_test' && (r.status === 'due' || r.status === 'ordered')
  )
  const upcomingReorders = requirements.filter(
    (r) => r.kind === 'supplement' && (r.status === 'due' || r.status === 'ordered')
  )
  const outstanding = requirements.filter((r) => r.status === 'due' || r.status === 'overdue')
  return { upcomingTests, upcomingReorders, outstanding }
}

export function mapDbItem(row: Record<string, unknown>): FulfillmentItem {
  return {
    id: String(row.id),
    orderId: String(row.order_id),
    kind: row.item_type as FulfillmentItem['kind'],
    sku: String(row.sku),
    providerId: row.provider_id as FulfillmentItem['providerId'],
    title: String(row.title),
    status: row.status as FulfillmentItem['status'],
    requirementKey: row.requirement_key ? String(row.requirement_key) : null,
    dueAt: row.due_at ? String(row.due_at) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export function mapDbOrder(row: Record<string, unknown>, items: FulfillmentItem[]): FulfillmentOrder {
  return {
    id: String(row.id),
    patientProfileId: String(row.patient_profile_id),
    cohortPatientRef: row.cohort_patient_ref ? String(row.cohort_patient_ref) : null,
    orderedByProfileId: String(row.ordered_by_profile_id),
    orderFlow: row.order_flow as FulfillmentOrder['orderFlow'],
    status: row.status as FulfillmentOrder['status'],
    items,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

/** Demo seed when DB tables are empty or unavailable. */
export function demoProtocolContext(protocolType = 'coimbra_d3'): ProtocolContext {
  return {
    protocolType,
    reviewAt: daysAgo(14),
    hasBloodPanel: false,
    hasTipTraqBlock: true,
  }
}

export function demoOrdersForPatient(patientProfileId: string): FulfillmentOrder[] {
  const orderId = `demo-order-${patientProfileId.slice(0, 8)}`
  const now = new Date().toISOString()
  return [
    {
      id: orderId,
      patientProfileId,
      cohortPatientRef: null,
      orderedByProfileId: patientProfileId,
      orderFlow: 'patient_self',
      status: 'open',
      createdAt: daysAgo(3),
      updatedAt: now,
      items: [
        {
          id: `${orderId}-tiptraq`,
          orderId,
          kind: 'assessment',
          sku: 'tiptraq-hsat-3night',
          providerId: 'tiptraq',
          title: 'TipTraQ HSAT kit (3 nights)',
          status: 'report_available',
          requirementKey: 'tiptraq-hsat-3night',
          dueAt: null,
          completedAt: daysAgo(1),
          metadata: {},
          createdAt: daysAgo(10),
          updatedAt: daysAgo(1),
        },
      ],
    },
  ]
}
