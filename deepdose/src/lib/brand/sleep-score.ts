/**
 * Consumer score language — chemical phenotype profile, not a diagnosis.
 * Screen calculates daily SRI; Score shows phenotype gains; chrome badges stay short as “Score”.
 */
export const SLEEP_SCORE = {
  /** Primary label (Score chrome, ring) */
  label: 'SRI',
  /** One-line meaning */
  hint: 'How steady your chemical phenotype is — circadian stability across nights.',
  /** Feed / peer badge prefix */
  badge: 'Score',
  /** Climb / CTA verbs */
  climb: 'Strengthen your phenotype.',
  climbShort: 'Raise your score',
  stamp: 'Shares toward your phenotype score',
  /** TipTraQ — deeper phenotype read from any score surface */
  tiptraqHref: '/testkit',
  tiptraqLabel: 'Get a TipTraQ deeper phenotype read',
  tiptraqHint: 'Three nights at home — a clearer chemical phenotype baseline.',
  /** Full clinical name (research / methodology surfaces) */
  clinicalName: 'Sleep Regularity Index (SRI)',
} as const

export function sleepScoreBadge(score: number): string {
  return `${SLEEP_SCORE.badge} ${Math.round(score)}`
}
