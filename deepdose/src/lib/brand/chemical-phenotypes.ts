/**
 * Chemical phenotypes — observable body-clock chemistry classes.
 * Feed groups, dose posts, and Sync all use this same taxonomy.
 */

export type ChemicalPhenotypeId =
  | 'night_creator'
  | 'early_explorer'
  | 'twilight_transformer'
  | 'pulse_shifter'

export type ChemicalPhenotype = {
  id: ChemicalPhenotypeId
  /** Social name shown in UI */
  label: string
  /** Peak energy window */
  peak: string
  /** One-line chemistry expression */
  expression: string
  /** Feed / dose cue token */
  cue: string
  /** Hashtag on cards */
  hash: string
}

export const CHEMICAL_PHENOTYPES: readonly ChemicalPhenotype[] = [
  {
    id: 'night_creator',
    label: 'Night Creator',
    peak: 'Evening / night',
    expression: 'Creative and social after dark',
    cue: 'var(--dd-cue-resetter)',
    hash: '#NightCreator',
  },
  {
    id: 'early_explorer',
    label: 'Early Explorer',
    peak: 'Morning',
    expression: 'Active and connected early',
    cue: 'var(--dd-cue-hijacker)',
    hash: '#EarlyExplorer',
  },
  {
    id: 'twilight_transformer',
    label: 'Twilight Transformer',
    peak: 'Afternoon / evening',
    expression: 'Flexible and adaptive',
    cue: 'var(--dd-cue-crosser)',
    hash: '#TwilightTransformer',
  },
  {
    id: 'pulse_shifter',
    label: 'Pulse Shifter',
    peak: 'Variable',
    expression: 'Non-standard schedules — shift work, travel, unconventional clocks',
    cue: 'var(--dd-cue-battery)',
    hash: '#PulseShifter',
  },
] as const

export const CHEMICAL_PHENOTYPE_IDS: readonly ChemicalPhenotypeId[] = CHEMICAL_PHENOTYPES.map(
  (p) => p.id
)

export const CHEMICAL_PHENOTYPE_BY_ID = Object.fromEntries(
  CHEMICAL_PHENOTYPES.map((p) => [p.id, p])
) as Record<ChemicalPhenotypeId, ChemicalPhenotype>

export function isChemicalPhenotypeId(value: unknown): value is ChemicalPhenotypeId {
  return (
    value === 'night_creator' ||
    value === 'early_explorer' ||
    value === 'twilight_transformer' ||
    value === 'pulse_shifter'
  )
}

/** Rough phenotype from typical wake minutes (local clock). */
export function phenotypeFromWakeMinutes(wakeMinutes: number): ChemicalPhenotype {
  const normalized = ((wakeMinutes % 1440) + 1440) % 1440
  if (normalized < 5 * 60 || normalized >= 10 * 60) {
    return CHEMICAL_PHENOTYPE_BY_ID.pulse_shifter
  }
  if (normalized < 6 * 60 + 45) return CHEMICAL_PHENOTYPE_BY_ID.early_explorer
  if (normalized >= 9 * 60) return CHEMICAL_PHENOTYPE_BY_ID.night_creator
  return CHEMICAL_PHENOTYPE_BY_ID.twilight_transformer
}

export function phenotypeFromWakeLabel(wakeLabel: string | null | undefined): ChemicalPhenotype {
  if (!wakeLabel) return CHEMICAL_PHENOTYPE_BY_ID.night_creator
  const m = wakeLabel.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!m) return CHEMICAL_PHENOTYPE_BY_ID.night_creator
  const minutes = Number(m[1]) * 60 + Number(m[2])
  return phenotypeFromWakeMinutes(minutes)
}

export function phenotypeHintLine(phenotype: ChemicalPhenotype): string {
  return `${phenotype.label} — peak ${phenotype.peak.toLowerCase()}. ${phenotype.expression}.`
}

/** Sync overlap copy — chemistry, not vibes. */
export function phenotypeOverlapLine(name: string, pct: number): string {
  return `You and ${name} share a ${pct}% phenotype overlap.`
}
