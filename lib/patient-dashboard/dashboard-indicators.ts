/** Two-colour indicator system for patient dashboard — defined once per prompt spec. */

export const DASH_GREEN = {
  fill: '#E1F5EE',
  border: '#085041',
} as const

export const DASH_RED = {
  watch: { fill: '#FCEBEB', border: '#A32D2D', borderWidth: 2 },
  elevated: { fill: '#F7C1C1', border: '#A32D2D', borderWidth: 2.5 },
  high: { fill: '#F09595', border: '#791F1F', borderWidth: 3 },
  critical: { fill: '#F7C1C1', border: '#791F1F', borderWidth: 3 },
} as const

export type DotStyle = {
  size: number
  fill: string
  border: string
  borderWidth: number
}

export function dotStyleForSeverity(
  severity: 'normal' | 'watch' | 'elevated' | 'high' | 'critical',
  normalSize: 'sm' | 'md' = 'sm'
): DotStyle {
  if (severity === 'normal') {
    return {
      size: normalSize === 'md' ? 18 : 14,
      fill: DASH_GREEN.fill,
      border: DASH_GREEN.border,
      borderWidth: 2,
    }
  }

  const red = DASH_RED[severity === 'watch' ? 'watch' : severity]
  const size =
    severity === 'watch' ? 16 : severity === 'elevated' ? 22 : severity === 'high' ? 28 : 32

  return {
    size,
    fill: red.fill,
    border: red.border,
    borderWidth: red.borderWidth,
  }
}

export function isElevatedSeverity(severity: string): boolean {
  return severity === 'elevated' || severity === 'high' || severity === 'critical'
}
