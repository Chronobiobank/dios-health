import { cn } from '@/lib/utils/cn'

/** Canonical marketing tile grid class — clinician-landing reference */
export const MARKETING_TILES_CLASS = 'seco-marketing-tiles'

/** Right-aligned bottom-of-page CTA row */
export const MARKETING_CTA_CLASS = 'seco-marketing-cta'

/** Full-width / hero-scale marketing tile (photo or feature band) */
export const MARKETING_WIDE_TILE_CLASS = 'seco-marketing-wide-tile'

/** Gradient spectrum numbered bullet (tiptraq steps, mission plane beats, etc.) */
export const MARKETING_NUM_CLASS = 'seco-marketing-num'

export function marketingTilesClass(...classes: (string | false | undefined)[]) {
  return cn(MARKETING_TILES_CLASS, ...classes)
}

export function marketingCtaClass(...classes: (string | false | undefined)[]) {
  return cn(MARKETING_CTA_CLASS, ...classes)
}
