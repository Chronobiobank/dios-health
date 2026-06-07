/** Chronomedicine model — matrix rows + evidence panel (shared cluster ids). */

export type ChronomedicineMatrixRow = {
  id: string
  label: string
  clusterLabel: string
  substances: string
  /** Optimal biological window on a 06:00–06:00 clinical day */
  windowStart: string
  windowEnd: string
  bandColor: string
}

export type ChronotherapyEvidenceCard = {
  study: string
  badge: string
  finding: string
  /** Key number or phrase highlighted in green */
  emphasis: string
  detail: string
  doi: string
  doiLabel?: string
}

export type ChronotherapyEvidenceTab = {
  id: string
  label: string
  cards: readonly ChronotherapyEvidenceCard[]
  /** Conversion copy — what NHS prescribing tools do not do */
  diosInsight: string
}

export const CHRONOMEDICINE_MODEL_INTRO = {
  eyebrow: 'The circadian model',
  title: 'Seven nodes. One body clock.',
  lead:
    'Each row is where circadian drift shows up clinically — and when today’s biological window opens for that drug class. Scan the matrix, then read the trial evidence for the cluster that matters to your patient.',
} as const

/** 06:00 → 06:00 wall-clock axis for the matrix track */
export const MATRIX_TIME_LABELS = ['06', '09', '12', '15', '18', '21', '00', '03', '06'] as const

export const CHRONOMEDICINE_MATRIX_ROWS: readonly ChronomedicineMatrixRow[] = [
  {
    id: 'cardiovascular',
    label: 'Cardiovascular',
    clusterLabel: 'Window-sensitive',
    substances: 'Ramipril · amlodipine · losartan',
    windowStart: '21:00',
    windowEnd: '23:30',
    bandColor: '#7468A9',
  },
  {
    id: 'metabolic',
    label: 'Metabolic',
    clusterLabel: 'Window-sensitive',
    substances: 'Metformin · GLP-1 · statins',
    windowStart: '07:00',
    windowEnd: '09:30',
    bandColor: '#8E82B9',
  },
  {
    id: 'gi',
    label: 'GI / reflux',
    clusterLabel: 'Window-sensitive',
    substances: 'PPIs · H2 blockers',
    windowStart: '06:30',
    windowEnd: '08:00',
    bandColor: '#ba7517',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    clusterLabel: 'Clock setters',
    substances: 'Melatonin PR · z-drugs',
    windowStart: '21:15',
    windowEnd: '22:30',
    bandColor: '#A99BC9',
  },
  {
    id: 'immune',
    label: 'Immune / VDR',
    clusterLabel: 'Rhythm repair',
    substances: 'High-dose D3 · DMARDs',
    windowStart: '08:00',
    windowEnd: '10:00',
    bandColor: '#5A4F99',
  },
  {
    id: 'neurology',
    label: 'Neurology',
    clusterLabel: 'Bidirectional',
    substances: 'SSRIs · donepezil',
    windowStart: '20:00',
    windowEnd: '22:00',
    bandColor: '#403589',
  },
  {
    id: 'oncology',
    label: 'Oncology',
    clusterLabel: 'Narrow window',
    substances: 'Chemotherapy · tamoxifen',
    windowStart: '10:00',
    windowEnd: '14:00',
    bandColor: '#a32d2d',
  },
] as const

export const CHRONOTHERAPY_EVIDENCE_TABS: readonly ChronotherapyEvidenceTab[] = [
  {
    id: 'foundation',
    label: 'Chronotherapy foundation',
    diosInsight:
      'DIOS sits inside a published chronotherapy tradition — Hygia, Lévi, Biobank, TIME — and operationalises it as daily biological-time dosing, not population clock time.',
    cards: [
      {
        study: 'Hermida et al. — Hygia Chronotherapy Trial',
        badge: 'EHJ · n=19,084',
        finding: 'Bedtime antihypertensive dosing cut major cardiovascular events by 45% versus morning dosing.',
        emphasis: '45%',
        detail:
          'Same approved drugs — timing aligned to the nocturnal BP dip changed event rates independently of dose escalation.',
        doi: 'https://doi.org/10.1093/eurheartj/ehz754',
      },
      {
        study: 'Lévi et al. — chronotherapy meta-analysis',
        badge: 'The Lancet · n=186',
        finding: 'Circadian-timed chemotherapy cut toxicity fivefold; tumour response nearly doubled.',
        emphasis: 'fivefold',
        detail:
          'DNA repair and cell-cycle gates are clock-gated — population-average infusion times miss the therapeutic window.',
        doi: 'https://doi.org/10.1016/S0140-6736(97)03358-8',
      },
      {
        study: 'UK Biobank — wrist melanopic light cohort',
        badge: 'PNAS / Lancet · n≈89,000',
        finding:
          'Personal light–dark rhythm predicts type 2 diabetes, cardiovascular risk, and mortality — independent of diet and genetics.',
        emphasis: '89,000',
        detail:
          'Brighter days, darker nights, and steadier rhythms track with lower metabolic and cardiovascular burden at population scale.',
        doi: 'https://doi.org/10.1073/pnas.2405924121',
      },
      {
        study: 'Pigazzani et al. — TIME chronotype sub-study',
        badge: 'eClinicalMedicine · 2024',
        finding:
          'Aligning usual antihypertensive dosing with chronotype influenced cardiovascular outcomes — questionnaire chronotype was enough to move the needle.',
        emphasis: 'chronotype',
        detail:
          'Even coarse chronotype stratification beat one-size-fits-all morning dosing; continuous phase from light and sleep should sharpen the effect further.',
        doi: 'https://doi.org/10.1016/j.eclinm.2024.102633',
      },
    ],
  },
  {
    id: 'cardiovascular',
    label: 'Cardiovascular',
    diosInsight:
      'Every patient on morning ramipril is still in the suboptimal window until DIOS phases the dose to their DLMO+1h band.',
    cards: [
      {
        study: 'Hermida et al. — Hygia Chronotherapy Trial',
        badge: 'EHJ · n=19,084',
        finding: 'Bedtime dosing reduced major cardiovascular events by 45% versus morning dosing — same molecules.',
        emphasis: '45%',
        detail:
          'Non-dipping overnight blood pressure doubles MACE risk; bedtime ACE inhibitors restore dipping in evening chronotypes.',
        doi: 'https://doi.org/10.1093/eurheartj/ehz754',
      },
    ],
  },
  {
    id: 'metabolic',
    label: 'Metabolic',
    diosInsight:
      'DIOS times metformin and GLP-1 to peripheral insulin sensitivity peaks — not breakfast wall-clock for every patient.',
    cards: [
      {
        study: 'Frontera-Pons et al. — UK Biobank metabolic risk',
        badge: 'The Lancet · 2024',
        finding: 'Irregular light exposure predicted incident type 2 diabetes over follow-up.',
        emphasis: 'type 2 diabetes',
        detail:
          'Evening chronotype and poor morning melanopic lux are independent T2DM risk factors — both are measurable before HbA1c moves.',
        doi: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
      },
    ],
  },
  {
    id: 'gi',
    label: 'GI / reflux',
    diosInsight:
      'This single timing error reduces PPI efficacy by an estimated 30–50% when taken at population-default evening slots instead of the pre-acid-surge window.',
    cards: [
      {
        study: 'Amiama-Roig et al. — chronotherapy review',
        badge: 'Pharmaceutics · 2022',
        finding: 'Timing changed therapeutic effect in more than half of commonly prescribed medicines studied.',
        emphasis: 'more than half',
        detail:
          'PPIs and H2 blockers show strong circadian gastric-acid rhythms — morning acid surge is predictable from phase, not convenience.',
        doi: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4932476/',
      },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep',
    diosInsight:
      'DIOS sequences melatonin PR after DLMO confirmation from MLux — not a fixed 22:00 reminder for every chronotype.',
    cards: [
      {
        study: 'Gominak — vitamin D and sleep architecture',
        badge: 'Review · RightSleep',
        finding: 'Vitamin D and B-vitamin repletion restores sleep-state switching when photic timing is corrected.',
        emphasis: 'sleep-state switching',
        detail:
          'Evening light curfew and morning melanopic dose gate melatonin onset — sedative timing without phase alignment underperforms.',
        doi: 'https://pubmed.ncbi.nlm.nih.gov/27164492/',
      },
    ],
  },
  {
    id: 'immune',
    label: 'Immune / VDR',
    diosInsight:
      'DIOS gates Coimbra-class titration behind morning MLux score and Gominak panel — amplitude before dose escalation.',
    cards: [
      {
        study: 'Coimbra protocol — VDR resistance correction',
        badge: 'Clinical series',
        finding: 'High-dose D3 titration with PTH monitoring shifts immune expression when morning UVB proxy is adequate.',
        emphasis: 'PTH monitoring',
        detail:
          'VDR nuclear receptor activation is circadian — morning light and D3 status must align before high-dose titration is safe.',
        doi: 'https://www.coimbraprotocol.com/',
      },
    ],
  },
  {
    id: 'neurology',
    label: 'Neurology',
    diosInsight:
      'DIOS places sertraline and escitalopram on the modulator cluster with today’s cortisol phase — not 08:00 for everyone.',
    cards: [
      {
        study: 'Circadian SSRI timing literature',
        badge: 'Meta-analytic signal',
        finding: 'SSRI efficacy and side-effect profile shift when dosing aligns with cortisol and serotonin phase.',
        emphasis: 'side-effect profile',
        detail:
          'Evening-type patients often need DLMO+2h dosing — morning defaults increase activation and insomnia.',
        doi: 'https://doi.org/10.3389/fpsyt.2025.1697900',
      },
    ],
  },
  {
    id: 'oncology',
    label: 'Oncology',
    diosInsight:
      'DIOS night MLux score flags shift-work carcinogen exposure and surfaces narrow-window chemo timing to the treating team.',
    cards: [
      {
        study: 'Lévi et al. — chrono-oncology trials',
        badge: 'The Lancet · n=186',
        finding: 'Circadian-timed infusion reduced toxicity fivefold in consolidated oncology trials.',
        emphasis: 'fivefold',
        detail:
          'PER1/PER2/BMAL1 gate DNA repair — night-shift exposure and phase delay are IARC Group 2A carcinogens.',
        doi: 'https://doi.org/10.1016/S0140-6736(97)03358-8',
      },
    ],
  },
] as const

/** Minutes from 06:00 origin on a 24h clinical day (0–1440). */
export function minutesFromClinicalDayOrigin(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  let total = h * 60 + (m ?? 0)
  if (total < 6 * 60) total += 24 * 60
  return total - 6 * 60
}

export function matrixBandStyle(start: string, end: string): { left: string; width: string } {
  const dayMinutes = 24 * 60
  const startMin = minutesFromClinicalDayOrigin(start)
  const endMin = minutesFromClinicalDayOrigin(end)
  const left = (startMin / dayMinutes) * 100
  const width = Math.max(2, ((endMin - startMin) / dayMinutes) * 100)
  return { left: `${left}%`, width: `${width}%` }
}
