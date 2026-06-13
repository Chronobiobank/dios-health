import type { FulfillmentItemKind, FulfillmentProviderId } from '@/lib/fulfillment/types'

export type FulfillmentCatalogEntry = {
  sku: string
  kind: FulfillmentItemKind
  providerId: FulfillmentProviderId
  title: string
  shortLabel: string
  cadenceDays: number | null
  protocolTypes: string[]
}

/** Protocol-linked SKUs — surfaced as requirements, not browseable products. */
export const FULFILLMENT_CATALOG: FulfillmentCatalogEntry[] = [
  {
    sku: 'city-labs-25ohd',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Vitamin D (25-OH-D)',
    shortLabel: '25-OH-D',
    cadenceDays: 90,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3', 'circadian'],
  },
  {
    sku: 'city-labs-calcium',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Serum calcium',
    shortLabel: 'Calcium',
    cadenceDays: 90,
    protocolTypes: ['coimbra', 'coimbra_d3'],
  },
  {
    sku: 'city-labs-pth',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Parathyroid hormone (PTH)',
    shortLabel: 'PTH',
    cadenceDays: 90,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3'],
  },
  {
    sku: 'city-labs-magnesium',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Magnesium',
    shortLabel: 'Magnesium',
    cadenceDays: 180,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3'],
  },
  {
    sku: 'city-labs-renal',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Kidney function panel',
    shortLabel: 'Kidney panel',
    cadenceDays: 180,
    protocolTypes: ['coimbra', 'coimbra_d3'],
  },
  {
    sku: 'city-labs-monitoring',
    kind: 'lab_test',
    providerId: 'city_labs',
    title: 'Coimbra monitoring panel',
    shortLabel: 'Monitoring panel',
    cadenceDays: 90,
    protocolTypes: ['coimbra', 'coimbra_d3'],
  },
  {
    sku: 'tiptraq-hsat-3night',
    kind: 'assessment',
    providerId: 'tiptraq',
    title: 'TipTraQ HSAT kit (3 nights)',
    shortLabel: 'TipTraQ block',
    cadenceDays: 365,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3', 'circadian'],
  },
  {
    sku: 'supplement-d3-k2',
    kind: 'supplement',
    providerId: 'dios_supplements',
    title: 'Vitamin D3 + K2',
    shortLabel: 'D3/K2',
    cadenceDays: 30,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3'],
  },
  {
    sku: 'supplement-magnesium',
    kind: 'supplement',
    providerId: 'dios_supplements',
    title: 'Magnesium glycinate',
    shortLabel: 'Magnesium',
    cadenceDays: 30,
    protocolTypes: ['coimbra', 'coimbra_d3', 'gominak', 'gominak_d3'],
  },
  {
    sku: 'supplement-k2',
    kind: 'supplement',
    providerId: 'dios_supplements',
    title: 'Vitamin K2',
    shortLabel: 'K2',
    cadenceDays: 30,
    protocolTypes: ['coimbra', 'coimbra_d3'],
  },
  {
    sku: 'supplement-b-complex',
    kind: 'supplement',
    providerId: 'dios_supplements',
    title: 'B-complex (Gominak spec)',
    shortLabel: 'B-complex',
    cadenceDays: 30,
    protocolTypes: ['gominak', 'gominak_d3', 'gominak_b_vitamins'],
  },
]

export function getCatalogEntry(sku: string): FulfillmentCatalogEntry | null {
  return FULFILLMENT_CATALOG.find((e) => e.sku === sku) ?? null
}

export function catalogForProtocol(protocolType: string): FulfillmentCatalogEntry[] {
  const normalized = protocolType.toLowerCase()
  return FULFILLMENT_CATALOG.filter((e) =>
    e.protocolTypes.some((p) => normalized.includes(p) || p.includes(normalized))
  )
}
