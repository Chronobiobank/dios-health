import type { MicronutrientItemId } from '@/lib/chronoimmune/indication-zones'
import type { ShopProductSlug } from '@/lib/shop/types'

export type QuantityOption = {
  id: string
  label: string
  units: number
  priceGbp: number
}

export type ShopProduct = {
  slug: ShopProductSlug
  name: string
  shortName: string
  protocolIndication: string
  doseSpecification: string
  description: string
  /** Gominak / Chronoimmune protocol dose pre-populated for patient self-order */
  defaultProtocolDose: string
  quantityOptions: QuantityOption[]
  micronutrientIds: MicronutrientItemId[]
  fulfilmentNote: string
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    slug: 'd3-k2-protocol',
    name: 'DIOS D3/K2 Protocol Formula',
    shortName: 'D3/K2 Protocol',
    protocolIndication: 'Chronoimmune Zone 2–4 — VDR restitution cofactor',
    doseSpecification: '10,000 IU D3 + 200 mcg K2 (MK-7) per capsule',
    description:
      'Protocol-matched vitamin D3 with K2 at Gominak specification. DIOS recommends this formulation when your checklist flags D3/K2 as unconfirmed.',
    defaultProtocolDose: '1 capsule daily with morning meal (10,000 IU + 200 mcg K2)',
    quantityOptions: [
      { id: '30', label: '30-day supply', units: 1, priceGbp: 34 },
      { id: '90', label: '90-day supply', units: 3, priceGbp: 89 },
    ],
    micronutrientIds: ['d3-k2'],
    fulfilmentNote: 'Queued for affiliate fulfilment — no inventory held by DIOS at launch.',
  },
  {
    slug: 'b-complex-gominak',
    name: 'DIOS B-Complex (Gominak spec)',
    shortName: 'B-Complex',
    protocolIndication: 'Sleep Architecture — brainstem fuel pathway',
    doseSpecification: 'B5 500 mg + B12 methylcobalamin 1,000 mcg + B2 100 mg',
    description:
      'Therapeutic B5 and methylcobalamin at Gominak RightSleep specification with riboflavin cofactor.',
    defaultProtocolDose: 'B5 morning · B12 with evening meal',
    quantityOptions: [
      { id: '30', label: '30-day supply', units: 1, priceGbp: 42 },
      { id: '90', label: '90-day supply', units: 3, priceGbp: 108 },
    ],
    micronutrientIds: ['b5', 'b12', 'riboflavin-b2'],
    fulfilmentNote: 'Queued for affiliate fulfilment.',
  },
  {
    slug: 'magnesium-glycinate',
    name: 'DIOS Magnesium Glycinate',
    shortName: 'Magnesium',
    protocolIndication: 'Chronoimmune cofactor — VDR and CLOCK expression',
    doseSpecification: '400 mg elemental magnesium per serving',
    description: 'Magnesium glycinate for circadian and VDR cofactor support across all zones.',
    defaultProtocolDose: '400 mg at bedtime',
    quantityOptions: [
      { id: '30', label: '30-day supply', units: 1, priceGbp: 28 },
      { id: '90', label: '90-day supply', units: 3, priceGbp: 72 },
    ],
    micronutrientIds: ['magnesium-glycinate', 'magnesium-citrate'],
    fulfilmentNote: 'Queued for affiliate fulfilment.',
  },
  {
    slug: 'omega-3-high-dose',
    name: 'DIOS Omega-3 High Dose',
    shortName: 'Omega-3',
    protocolIndication: 'Zone 2+ — inflammatory modulation cofactor',
    doseSpecification: '2,000 mg EPA/DHA combined per day',
    description: 'High-dose omega-3 aligned to Chronoimmune protocol anti-inflammatory stack.',
    defaultProtocolDose: '2 g EPA/DHA with largest meal',
    quantityOptions: [
      { id: '30', label: '30-day supply', units: 1, priceGbp: 38 },
      { id: '90', label: '90-day supply', units: 3, priceGbp: 99 },
    ],
    micronutrientIds: ['omega-3'],
    fulfilmentNote: 'Queued for affiliate fulfilment.',
  },
  {
    slug: 'ferritin-support',
    name: 'DIOS Ferritin Support',
    shortName: 'Ferritin support',
    protocolIndication: 'Gominak panel — iron-dependent circadian metabolism',
    doseSpecification: 'Lactoferrin 250 mg gentle iron support',
    description: 'Gentle ferritin support without high-dose iron — Gominak cofactor pathway.',
    defaultProtocolDose: '250 mg lactoferrin between meals',
    quantityOptions: [
      { id: '30', label: '30-day supply', units: 1, priceGbp: 32 },
      { id: '90', label: '90-day supply', units: 3, priceGbp: 82 },
    ],
    micronutrientIds: ['ferritin-support'],
    fulfilmentNote: 'Queued for affiliate fulfilment.',
  },
]

export function getShopProduct(slug: string): ShopProduct | null {
  return SHOP_PRODUCTS.find((p) => p.slug === slug) ?? null
}

export function productForMicronutrient(id: MicronutrientItemId): ShopProduct | null {
  return SHOP_PRODUCTS.find((p) => p.micronutrientIds.includes(id)) ?? null
}

export function shopProductUrl(
  slug: ShopProductSlug,
  params?: { qty?: string; source?: string; micronutrient?: MicronutrientItemId }
): string {
  const search = new URLSearchParams()
  if (params?.qty) search.set('qty', params.qty)
  if (params?.source) search.set('source', params.source)
  if (params?.micronutrient) search.set('micronutrient', params.micronutrient)
  const q = search.toString()
  return `/shop/${slug}${q ? `?${q}` : ''}`
}
