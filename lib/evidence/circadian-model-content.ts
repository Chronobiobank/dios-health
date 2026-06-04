/** Narrative content for /evidence — UK Biobank foundation + recent clinical translation */

export type UkBiobankFinding = {
  id: string
  journal: string
  title: string
  body: string
  href: string
  hrefLabel: string
}

export const EVIDENCE_HERO = {
  eyebrow: 'Clinical evidence',
  title: 'UK Biobank proved your light–dark cycle drives metabolic health.',
  lead:
    'Nearly 90,000 participants wore wrist light sensors for millions of hours. Brighter days, darker nights, and steadier rhythms predicted lower diabetes, cardiovascular, and mortality risk — independent of diet, exercise, and genetics. DIOS turns that population evidence into a personal body-clock readout.',
} as const

export const UK_BIOBANK_STATS = [
  { value: '89k', label: 'Participants with light sensors' },
  { value: '13M', label: 'Hours of wrist sensor data' },
  { value: '2024', label: 'Lancet & PNAS publications' },
] as const

export const UK_BIOBANK_FINDINGS: readonly UkBiobankFinding[] = [
  {
    id: 'pnas-mortality',
    journal: 'PNAS · 2024',
    title: 'Brighter nights and darker days raise mortality risk',
    body:
      'Accelerometer-measured light exposure across the cohort showed that opposing the natural day–night pattern — more light at night and too little by day — tracks with higher all-cause mortality.',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    hrefLabel: 'Read the PNAS paper',
  },
  {
    id: 'lancet-t2dm',
    journal: 'The Lancet · 2024',
    title: 'Personal light rhythm predicts type 2 diabetes',
    body:
      'Irregular light exposure and poor day–night contrast predicted incident type 2 diabetes over follow-up, adding a circadian signal on top of traditional metabolic risk factors.',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    hrefLabel: 'Read the Lancet paper',
  },
  {
    id: 'pnas-mlux',
    journal: 'PNAS · 2023',
    title: 'Melanopic lux (MLux) is a practical circadian biomarker',
    body:
      'Smartphone-measurable melanopic light links to the same biology the Biobank cohorts used at scale — the basis for DIOS light alignment and Chronosomatic Age scoring.',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
    hrefLabel: 'Read the MLux biomarker study',
  },
] as const

export const EVIDENCE_DIOS_BRIDGE = {
  eyebrow: 'What DIOS adds',
  title: 'Population proof, personal measurement.',
  body:
    'The Biobank work establishes that light–dark alignment matters at scale. DIOS measures your phase with smartphone MLux, sleep timing, and optional TipTraQ and bloods — then scores seven circadian disease nodes and medication timing windows for your clinician to review.',
  links: [
    { label: 'See Chronosomatic Age', href: '/circadian-digital-twin' },
    { label: 'Read the founder paper', href: '/pitch/problem' },
  ],
} as const

export const RECENT_CLINICAL_EVIDENCE = {
  eyebrow: 'Recent clinical translation',
  title: 'Timing still matters in routine prescribing.',
  items: [
    {
      year: '2024',
      source: 'Pigazzani et al. · eClinicalMedicine',
      detail:
        'TIME study chronotype sub-study: aligning usual antihypertensive dosing with chronotype influenced cardiovascular outcomes — questionnaire-based chronotype; DIOS replaces that with continuous phase from wearables and light.',
      href: 'https://doi.org/10.1016/j.eclinm.2024.102633',
    },
    {
      year: '2022',
      source: 'Amiama-Roig et al. · Pharmaceutics',
      detail:
        'Review of commonly prescribed medicines: timing changed therapeutic effect in more than half of studies — most labels still default to population-average clocks.',
      href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4932476/',
    },
  ],
} as const

export const SPECTRUM_SECTION = {
  eyebrow: 'The circadian model',
  title: 'Seven nodes. One body clock.',
  lead:
    'Each node is a place circadian drift shows up before disease labels — what a clinician reviews when adjusting timing. Tap any node for mechanism and signals.',
} as const
