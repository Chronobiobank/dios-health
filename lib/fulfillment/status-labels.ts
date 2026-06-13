import type {
  FulfillmentItemKind,
  FulfillmentItemStatus,
  RequirementStatus,
} from '@/lib/fulfillment/types'

export function requirementStatusLabel(status: RequirementStatus): string {
  switch (status) {
    case 'due':
      return 'Due'
    case 'ordered':
      return 'Ordered'
    case 'completed':
      return 'Completed'
    case 'overdue':
      return 'Overdue'
  }
}

export function itemStatusLabel(kind: FulfillmentItemKind, status: FulfillmentItemStatus): string {
  if (kind === 'lab_test') {
    switch (status) {
      case 'ordered':
        return 'Ordered'
      case 'dispatched':
        return 'Dispatched'
      case 'sample_received':
        return 'Sample received'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'results_imported':
        return 'Results imported'
      case 'overdue':
        return 'Overdue'
      default:
        return String(status)
    }
  }

  if (kind === 'assessment') {
    switch (status) {
      case 'order_kit':
        return 'Order kit'
      case 'shipped':
        return 'Shipped'
      case 'completed':
        return 'Completed'
      case 'report_available':
        return 'Report available'
      case 'clinician_reviewed':
        return 'Clinician reviewed'
      case 'due':
        return 'Due'
      case 'ordered':
        return 'Ordered'
      case 'overdue':
        return 'Overdue'
      default:
        return String(status)
    }
  }

  return requirementStatusLabel(status as RequirementStatus)
}

export function initialItemStatus(kind: FulfillmentItemKind): FulfillmentItemStatus {
  if (kind === 'lab_test') return 'ordered'
  if (kind === 'assessment') return 'order_kit'
  return 'ordered'
}
