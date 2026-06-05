import type { MicronutrientItemId } from '@/lib/chronoimmune/indication-zones'

export type ShopProductSlug =
  | 'd3-k2-protocol'
  | 'b-complex-gominak'
  | 'magnesium-glycinate'
  | 'omega-3-high-dose'
  | 'ferritin-support'

export type OrderFlow = 'patient_self' | 'practitioner_for_patient'

export type SupplementOrderStatus = 'pending_fulfilment' | 'confirmed' | 'shipped'

export type SupplementOrderEvent = {
  id: string
  patientRecordId: string
  patientName: string
  productSlug: ShopProductSlug
  productName: string
  micronutrientId: MicronutrientItemId | null
  quantity: number
  unitPriceGbp: number
  totalGbp: number
  protocolDose: string
  orderFlow: OrderFlow
  orderedBy: string
  deliveryLine1: string
  deliveryCity: string
  deliveryPostcode: string
  deliveryCountry: string
  status: SupplementOrderStatus
  createdAt: string
  stripeSessionId: string | null
}

export type PatientDeliveryProfile = {
  line1: string
  line2?: string
  city: string
  postcode: string
  country: string
}
