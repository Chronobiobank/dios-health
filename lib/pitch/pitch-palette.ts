/**
 * Pitch landing — one spot colour family (calm brand gold), not per-tile rainbow variants.
 * Aligns with calm-ui.css: --calm-brand, --calm-optimal.
 */

export const PITCH_SPOT = {
  brand: '#c9973a',
  optimal: '#ed8936',
  brandRgb: '201 151 58',
  optimalRgb: '237 137 54',
} as const

/** Media tile tint at 35% layer opacity — warm gold wash over photography */
export const PITCH_TILE_TINT_GRADIENT = `linear-gradient(
  145deg,
  rgb(${PITCH_SPOT.optimalRgb} / 0.45) 0%,
  rgb(${PITCH_SPOT.brandRgb} / 0.5) 42%,
  rgb(8 8 8 / 0.92) 100%
)`

/** Spectrum bar fill — same hue, opacity encodes score (no magenta/navy mix). */
export function pitchSpectrumBarColor(score: number): string {
  const t = Math.max(0, Math.min(1, score))
  const alpha = 0.28 + t * 0.62
  return `rgb(${PITCH_SPOT.brandRgb} / ${alpha})`
}
