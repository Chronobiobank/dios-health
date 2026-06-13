/** Protocol-driven fulfillment — not a general e-commerce catalog. */

export type FulfillmentProviderId = 'city_labs' | 'tiptraq' | 'dios_supplements'

export type FulfillmentItemKind = 'lab_test' | 'supplement' | 'assessment'

export type RequirementStatus = 'due' | 'ordered' | 'completed' | 'overdue'

export type LabFulfillmentStatus =
  | 'ordered'
  | 'dispatched'
  | 'sample_received'
  | 'processing'
  | 'completed'
  | 'results_imported'

export type AssessmentFulfillmentStatus =
  | 'order_kit'
  | 'shipped'
  | 'completed'
  | 'report_available'
  | 'clinician_reviewed'

export type SupplementFulfillmentStatus = 'due' | 'ordered' | 'dispatched' | 'completed'

export type FulfillmentItemStatus =
  | RequirementStatus
  | LabFulfillmentStatus
  | AssessmentFulfillmentStatus
  | SupplementFulfillmentStatus

export type FulfillmentOrderFlow = 'patient_self' | 'clinician_for_patient'

export type FulfillmentOrderStatus = 'open' | 'completed' | 'cancelled'

export type ProtocolRequirement = {
  key: string
  kind: FulfillmentItemKind
  sku: string
  title: string
  providerId: FulfillmentProviderId
  status: RequirementStatus
  dueAt: string | null
  rationale: string
  orderId: string | null
  itemId: string | null
}

export type FulfillmentItem = {
  id: string
  orderId: string
  kind: FulfillmentItemKind
  sku: string
  providerId: FulfillmentProviderId
  title: string
  status: FulfillmentItemStatus
  requirementKey: string | null
  dueAt: string | null
  completedAt: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type FulfillmentOrder = {
  id: string
  patientProfileId: string
  cohortPatientRef: string | null
  orderedByProfileId: string
  orderFlow: FulfillmentOrderFlow
  status: FulfillmentOrderStatus
  items: FulfillmentItem[]
  createdAt: string
  updatedAt: string
}

export type PatientFulfillmentSummary = {
  requirements: ProtocolRequirement[]
  upcomingTests: ProtocolRequirement[]
  upcomingReorders: ProtocolRequirement[]
  outstanding: ProtocolRequirement[]
  recentOrders: FulfillmentOrder[]
}

export type ClinicianFulfillmentSummary = {
  patientsMissingTests: Array<{ patientRef: string; patientName: string; requirement: ProtocolRequirement }>
  patientsOverdueMonitoring: Array<{ patientRef: string; patientName: string; requirement: ProtocolRequirement }>
  outstandingTasks: Array<{ patientRef: string; patientName: string; requirement: ProtocolRequirement }>
  unreviewedResults: Array<{ patientRef: string; patientName: string; requirement: ProtocolRequirement }>
}

export type CreateFulfillmentOrderInput = {
  patientProfileId: string
  cohortPatientRef?: string | null
  orderFlow: FulfillmentOrderFlow
  requirementKeys: string[]
}
