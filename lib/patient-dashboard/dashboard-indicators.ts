import type { SpectrumSeverity } from '@/lib/patient-dashboard/types'

/**
 * Metabolic risk spectrum — four clinical bands (no “normal”).
 * Size steps proportionally; colour runs grey → pink → rose → dark red.
 */
export const SPECTRUM_SEVERITY_STYLES: Record<
  SpectrumSeverity,
  { fill: string; border: string; borderWidth: number; size: number }
> = {
  weak: { fill: '#E8EAED', border: '#B0B5BE', borderWidth: 1.5, size: 9 },
  mild: { fill: '#F6E4EA', border: '#D4A8B4', borderWidth: 1.5, size: 11 },
  moderate: { fill: '#C07070', border: '#8A4545', borderWidth: 2, size: 13 },
  severe: { fill: '#6E3838', border: '#4A2424', borderWidth: 2, size: 16 },
} as const

/** Largest spectrum dot — use for rail height and square wrap sizing. */
export const SPECTRUM_MAX_DOT_PX = Math.max(
  ...Object.values(SPECTRUM_SEVERITY_STYLES).map((s) => s.size)
)

export const SPECTRUM_SEVERITY_LABELS: { severity: SpectrumSeverity; label: string }[] = [
  { severity: 'weak', label: 'Weak' },
  { severity: 'mild', label: 'Mild' },
  { severity: 'moderate', label: 'Moderate' },
  { severity: 'severe', label: 'Severe' },
]

/** @deprecated Use SPECTRUM_SEVERITY_STYLES.severe — kept for any legacy imports */
export const DASH_RED = {
  watch: SPECTRUM_SEVERITY_STYLES.mild,
  elevated: SPECTRUM_SEVERITY_STYLES.moderate,
  high: SPECTRUM_SEVERITY_STYLES.severe,
  critical: SPECTRUM_SEVERITY_STYLES.severe,
} as const

export type DotStyle = {
  size: number
  fill: string
  border: string
  borderWidth: number
}

/** Square wrap matching dot diameter so severe indicators stay circular. */
export function spectrumDotWrapStyle(size: number): {
  width: number
  height: number
  minWidth: number
  minHeight: number
} {
  return { width: size, height: size, minWidth: size, minHeight: size }
}

export function dotStyleForSeverity(severity: SpectrumSeverity): DotStyle {
  const style = SPECTRUM_SEVERITY_STYLES[severity]
  return {
    size: style.size,
    fill: style.fill,
    border: style.border,
    borderWidth: style.borderWidth,
  }
}

export function isElevatedSeverity(severity: SpectrumSeverity): boolean {
  return severity === 'mild' || severity === 'moderate' || severity === 'severe'
}

/** Mean AHI across one or more TipTraQ nights (rounded to 1 decimal). */
export function meanAhiFromValues(ahiValues: number[]): number | null {
  const valid = ahiValues.filter((v) => typeof v === 'number' && !Number.isNaN(v))
  if (valid.length === 0) return null
  const sum = valid.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / valid.length) * 10) / 10
}

/** WHO-style AHI bands for five-night TipTraQ means. */
export function severityFromMeanAhi(meanAhi: number | null, hasTipTraq: boolean): SpectrumSeverity {
  if (!hasTipTraq || meanAhi == null || Number.isNaN(meanAhi)) return 'weak'
  if (meanAhi >= 30) return 'severe'
  if (meanAhi >= 15) return 'moderate'
  if (meanAhi >= 5) return 'mild'
  return 'weak'
}
