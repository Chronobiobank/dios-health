import type { FulfillmentProviderId } from '@/lib/fulfillment/types'

export type FulfillmentProvider = {
  id: FulfillmentProviderId
  label: string
  region: string
  kinds: Array<'lab_test' | 'supplement' | 'assessment'>
}

export const FULFILLMENT_PROVIDERS: FulfillmentProvider[] = [
  {
    id: 'city_labs',
    label: 'City Labs',
    region: 'UK',
    kinds: ['lab_test'],
  },
  {
    id: 'tiptraq',
    label: 'TipTraQ',
    region: 'Global',
    kinds: ['assessment'],
  },
  {
    id: 'dios_supplements',
    label: 'DIOS protocol supplements',
    region: 'UK',
    kinds: ['supplement'],
  },
]

export function getFulfillmentProvider(id: FulfillmentProviderId): FulfillmentProvider | null {
  return FULFILLMENT_PROVIDERS.find((p) => p.id === id) ?? null
}
