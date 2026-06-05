import type { SupplementOrderEvent } from '@/lib/shop/types'

/** In-memory fulfilment queue for prototype — persists for server process lifetime. */
const orderQueue: SupplementOrderEvent[] = []

export function listSupplementOrders(patientRecordId: string): SupplementOrderEvent[] {
  return orderQueue
    .filter((o) => o.patientRecordId === patientRecordId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getSupplementOrder(id: string): SupplementOrderEvent | null {
  return orderQueue.find((o) => o.id === id) ?? null
}

export function appendSupplementOrder(order: SupplementOrderEvent): SupplementOrderEvent {
  orderQueue.unshift(order)
  return order
}

export function createOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
