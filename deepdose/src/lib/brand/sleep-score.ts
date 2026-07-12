/**
 * Consumer score language — chemical phenotype profile, not a diagnosis.
 * Screen calculates daily SRI; Score shows phenotype gains; chrome badges stay short as “Score”.
 * Homekit = consumer name for TipTraQ at-home nights.
 */
export const SLEEP_SCORE = {
  /** Primary label (Score chrome, ring) */
  label: 'SRI',
  /** One-line meaning */
  hint: 'How steady your chemical phenotype is across nights.',
  /** Feed / peer badge prefix */
  badge: 'Score',
  /** Climb / CTA verbs */
  climb: 'Strengthen your phenotype.',
  climbShort: 'Raise your score',
  stamp: 'Shares toward your phenotype score',
  /** Homekit — TipTraQ at-home nights, consumer label */
  tiptraqHref: '/testkit',
  tiptraqLabel: 'Get a Homekit read',
  tiptraqHint: 'Three nights at home. Clearer phenotype baseline.',
  /** Full clinical name (research / methodology surfaces) */
  clinicalName: 'Sleep Regularity Index (SRI)',
} as const

export function sleepScoreBadge(score: number): string {
  return `${SLEEP_SCORE.badge} ${Math.round(score)}`
}
