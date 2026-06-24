import { cn } from '@/lib/utils/cn'

/** Canonical marketing tile grid class — clinician-landing reference */
export const MARKETING_TILES_CLASS = 'seco-marketing-tiles'

/** Right-aligned bottom-of-page CTA row */
export const MARKETING_CTA_CLASS = 'seco-marketing-cta'

export function marketingTilesClass(...classes: (string | false | undefined)[]) {
  return cn(MARKETING_TILES_CLASS, ...classes)
}

export function marketingCtaClass(...classes: (string | false | undefined)[]) {
  return cn(MARKETING_CTA_CLASS, ...classes)
}
