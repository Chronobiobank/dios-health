/** Display copy helpers for patient dashboard tiles. */

export function formatCompletenessValue(gapCount: number): string {
  if (gapCount === 0) return 'Complete'
  if (gapCount === 1) return '1 gap'
  return `${gapCount} gaps`
}

export function formatOpenGapsLabel(gapCount: number): string {
  return gapCount === 1 ? 'Open gap' : 'Open gaps'
}
