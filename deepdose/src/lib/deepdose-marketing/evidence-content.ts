/** Published research links · rendered on /science#evidence */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_RESEARCH_INTRO } from '@/lib/deepdose-marketing/research-content'

export const EVIDENCE_PAGE_META = {
  title: `Science · ${DEEPDOSE_NAME}`,
  description:
    'Peer-reviewed science on why when you take a medicine can matter as much as what you take.',
} as const

export const EVIDENCE_PAGE_INTRO = {
  eyebrow: 'Foundation',
  titleWhite: 'Timing',
  titleAccent: 'really matters',
  lede:
    'Your body still runs on a clock · even when your nights don’t. When dose, sleep, and light fall out of step, the same medicine does less, and the harm compounds night after night.',
} as const

export const EVIDENCE_WHY_NOW = {
  label: 'Why now',
  cue: '#8b9cf8',
  title: 'Wrong hour, wrong dose',
  beats: [
    'The same medicine at the wrong point in your clock does less, and harms more when the pattern repeats.',
    'Brighter nights and broken light–dark rhythms predict higher mortality in large cohorts.',
    'Mis-timed medicines drive avoidable harm · England\u2019s medicines optimisation agenda names it plainly.',
    'So we track the chain from evening melatonin rise through sleep repair to dose timing.',
  ],
} as const

export const EVIDENCE_TRACK_LAYERS = [
  {
    id: 'dlmo',
    rank: 1,
    label: 'DLMO',
    cue: '#c9b6f2',
    title: 'Melatonin rises',
    body: 'Dim-light onset marks when your night phase begins · the anchor we estimate from sleep and chronotype.',
  },
  {
    id: 'sleep',
    rank: 2,
    label: 'Sleep',
    cue: '#8a76c6',
    title: 'Onset & staging',
    body: 'Sleep onset and deep/REM architecture from your phone, wearable, or TipTraQ nights.',
  },
  {
    id: 'repair',
    rank: 3,
    label: 'Repair',
    cue: '#acd3de',
    title: 'Cellular recovery',
    body: 'Deep sleep switches on brain and body maintenance · when repair peaks if timing is right.',
  },
  {
    id: 'health',
    rank: 4,
    label: 'Health',
    cue: '#8b9cf8',
    title: 'Long-run outcomes',
    body: 'Steady light–dark rhythm protects metabolism and healthy years; drift compounds harm.',
  },
  {
    id: 'meds',
    rank: 5,
    label: 'Meds',
    cue: '#f2b8a2',
    title: 'Dose timing',
    body: 'The same medicine lands better in the right window · precision dosing is what we optimise.',
  },
] as const

/** Curated sources that support the Deepdose timing approach. */
export type EvidenceResearchLink = {
  href: string
  label: string
  meta: string
}

export const EVIDENCE_RESEARCH = {
  label: 'Research',
  cue: '#acd3de',
  title: 'Studies that back the timing',
  body: `Peer-reviewed work on body clocks and dose timing. The same science ${DEEPDOSE_NAME} uses for atypical folk with late nights and stacked meds.`,
  links: [
    {
      href: 'https://doi.org/10.1073/pnas.2405924121',
      label: 'Brighter nights predict higher mortality',
      meta: 'Windred et al. · PNAS 2024',
    },
    {
      href: 'https://doi.org/10.1093/eurheartj/ehaa152',
      label: 'Bedtime hypertension treatment',
      meta: 'Hermida et al. · European Heart Journal 2020',
    },
    {
      href: 'https://doi.org/10.1016/j.eclinm.2024.102633',
      label: 'Timed antihypertensives by chronotype',
      meta: 'Pigazzani et al. · eClinicalMedicine 2024',
    },
    {
      href: 'https://doi.org/10.1016/j.sleep.2007.05.001',
      label: 'Epidemiology of the human circadian clock',
      meta: 'Roenneberg et al., sleep Medicine Reviews 2007',
    },
    {
      href: 'https://doi.org/10.1016/j.molmed.2016.03.004',
      label: 'Dosing-time makes the poison',
      meta: 'Dallmann et al. · Trends in Molecular Medicine 2016',
    },
    {
      href: 'https://doi.org/10.1146/annurev.ph.31.030169.003331',
      label: 'Chronobiology · the science that started it all',
      meta: 'Halberg · Annual Review of Physiology 1969',
    },
  ] as const satisfies readonly EvidenceResearchLink[],
} as const

export const EVIDENCE_PAGE_CTA = {
  label: 'Start free',
  href: '/login',
  note: DEEPDOSE_RESEARCH_INTRO.consent,
} as const

/** @deprecated Used only by MelatoninCascadeStrip · prefer EVIDENCE_TRACK_LAYERS */
export const EVIDENCE_CASCADE = {
  label: 'What we track',
  title: 'The melatonin cascade',
  support: '',
  layers: EVIDENCE_TRACK_LAYERS,
} as const
