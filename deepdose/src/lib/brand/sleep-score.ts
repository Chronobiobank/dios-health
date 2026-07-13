/**
 * Consumer score language — chemical chronotype profile, not a diagnosis.
 * Screen calculates daily SRI; Score shows chronotype gains; chrome badges stay short as “Score”.
 * Homekit = consumer name for TipTraQ at-home nights.
 */
export const SLEEP_SCORE = {
  /** Primary label (Score chrome, ring) */
  label: 'SRI',
  /** One-line meaning */
  hint: 'How steady your chemical chronotype is across nights.',
  /** Feed / peer badge prefix */
  badge: 'Score',
  /** Climb / CTA verbs */
  climb: 'Strengthen your chronotype.',
  climbShort: 'Raise your score',
  stamp: 'Shares toward your chronotype score',
  /** Homekit — TipTraQ at-home nights, consumer label */
  tiptraqHref: '/homekit',
  tiptraqLabel: 'Get a Homekit read',
  tiptraqHint: 'Three nights at home. Clearer chronotype baseline.',
  /** Full clinical name (research / methodology surfaces) */
  clinicalName: 'Sleep Regularity Index (SRI)',
} as const

export function sleepScoreBadge(score: number): string {
  return `${SLEEP_SCORE.badge} ${Math.round(score)}`
}
