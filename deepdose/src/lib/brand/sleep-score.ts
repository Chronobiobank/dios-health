/**
 * Consumer score language — plain English.
 * Engine / clinical code may still say SRI; UI should not lead with it.
 */
export const SLEEP_SCORE = {
  /** Primary label (Score, Me, ring) */
  label: 'Sleep score',
  /** One-line meaning */
  hint: 'How steady your nights are.',
  /** Feed / peer badge prefix */
  badge: 'Score',
  /** Climb / CTA verbs */
  climb: 'Raise your sleep score.',
  climbShort: 'Raise your score',
  stamp: 'Logs your sleep score',
  /** TipTraQ — clinical early-risk deepen from any score surface */
  tiptraqHref: '/testkit',
  tiptraqLabel: 'Get a TipTraQ early-risk read',
  tiptraqHint: 'Three nights at home — sleep, breathing, and oxygen for a clearer clinical picture.',
  /** Optional clinical footnote — rare, not in product chrome */
  clinicalName: 'Sleep Regularity Index (SRI)',
} as const

export function sleepScoreBadge(score: number): string {
  return `${SLEEP_SCORE.badge} ${Math.round(score)}`
}
