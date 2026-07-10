/**
 * Consumer score language — sleepmaxxer vernacular.
 * Engine / clinical code may still say SRI; UI should not lead with it.
 */
export const SLEEP_SCORE = {
  /** Primary label (Bank, Me, ring) */
  label: 'Sleep score',
  /** One-line meaning */
  hint: 'How locked your nights are.',
  /** Grid / peer badge prefix */
  badge: 'Score',
  /** Climb / CTA verbs */
  climb: 'Raise your sleep score.',
  climbShort: 'Raise your score',
  stamp: 'Stamps your sleep score',
  /** Optional clinical footnote — rare, not in product chrome */
  clinicalName: 'Sleep Regularity Index (SRI)',
} as const

export function sleepScoreBadge(score: number): string {
  return `${SLEEP_SCORE.badge} ${Math.round(score)}`
}
