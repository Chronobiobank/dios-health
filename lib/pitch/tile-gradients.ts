/** Pitch landing tile tint — single brand spot (see pitch-palette.ts). */

import { PITCH_TILE_TINT_GRADIENT } from '@/lib/pitch/pitch-palette'

/** @deprecated Use brand only on pitch deck; kept for type compatibility */
export type PitchGlowVariant = 'brand'

export const PITCH_GLOW_GRADIENT: Record<
  PitchGlowVariant,
  { css: string; glow: string }
> = {
  brand: {
    css: PITCH_TILE_TINT_GRADIENT,
    glow: `rgb(201 151 58 / 0.35)`,
  },
}
