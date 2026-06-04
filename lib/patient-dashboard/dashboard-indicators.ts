import type { SpectrumSeverity } from '@/lib/patient-dashboard/types'

/** Metabolic risk spectrum — four clinical bands (no “normal”). */
export const SPECTRUM_SEVERITY_STYLES: Record<
  SpectrumSeverity,
  { fill: string; border: string; borderWidth: number; size: number }
> = {
  weak: { fill: '#F4F4F1', border: '#9CA3AF', borderWidth: 2, size: 14 },
  mild: { fill: '#FCEBEB', border: '#A32D2D', borderWidth: 2, size: 18 },
  moderate: { fill: '#F7C1C1', border: '#A32D2D', borderWidth: 2.5, size: 24 },
  severe: { fill: '#F09595', border: '#791F1F', borderWidth: 3, size: 32 },
} as const

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

/** WHO-style AHI bands for five-night TipTraQ means. */
export function severityFromMeanAhi(meanAhi: number | null, hasTipTraq: boolean): SpectrumSeverity {
  if (!hasTipTraq || meanAhi == null || Number.isNaN(meanAhi)) return 'weak'
  if (meanAhi >= 30) return 'severe'
  if (meanAhi >= 15) return 'moderate'
  if (meanAhi >= 5) return 'mild'
  return 'weak'
}
