/** Display copy helpers for patient dashboard tiles. */

export function formatCompletenessValue(gapCount: number): string {
  if (gapCount === 0) return 'Complete'
  if (gapCount === 1) return '1 gap'
  return `${gapCount} gaps`
}

export function formatOpenGapsLabel(gapCount: number): string {
  return gapCount === 1 ? 'Open gap' : 'Open gaps'
}

export function formatBodyClockCta(recoveryYears: number): {
  before: string
  highlight: string
  after: string
} {
  return {
    before: 'Reduce your Dark Years · recover ',
    highlight: `${recoveryYears} years`,
    after: ' in 90 days',
  }
}

const TILE_SUBHEAD_MIN_WORDS = 8
const TILE_SUBHEAD_MAX_WORDS = 10

/** Compact tile subheads — always 8–10 words for Tools and What we measured. */
export function tileSubhead(
  text: string,
  minWords = TILE_SUBHEAD_MIN_WORDS,
  maxWords = TILE_SUBHEAD_MAX_WORDS
): string {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const capped = words.length > maxWords ? words.slice(0, maxWords) : words
  return capped.join(' ')
}
