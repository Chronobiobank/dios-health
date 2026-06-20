/** Research & evidence: dedicated page content and external source tiles. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { LANDING_CLINICIANS } from '@/lib/secopeutic/landing-clinicians'

export const DEEPDOSE_RESEARCH_META = {
  title: `Research · ${DEEPDOSE_NAME}`,
  description:
    'Chronobiology and chronotherapy evidence behind precision dosing: peer-reviewed sources and clinical context.',
} as const

export const DEEPDOSE_RESEARCH_INTRO = {
  lede:
    'Your body runs on a clock. Take a medicine, eat, or sleep at the wrong point in that clock and the same dose does less, harms more, and — repeated night after night — costs healthy years of life.',
  cost: {
    href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
    label: 'NHS medicines optimisation',
  },
  human: {
    href: 'https://doi.org/10.1073/pnas.2405924121',
    label: 'UK Biobank · PNAS (2024)',
  },
  consent:
    'You choose what data we can use. Consent first · UK GDPR · Your clinician stays in the loop.',
} as const

export const DEEPDOSE_RESEARCH_SCHOLARS = [
  {
    clinician: LANDING_CLINICIANS.halberg,
    cite: 'Founded chronobiology and coined the word "circadian" in 1959. He showed that body rhythms decide health or disease, and that medicines work better when timed to them. Everything below proves him right.',
    href: 'https://en.wikipedia.org/wiki/Franz_Halberg',
    sourceLabel: 'Biography & works',
  },
  {
    clinician: LANDING_CLINICIANS.foster,
    cite: 'Maps the light pathways that set the body clock Halberg described, and why the timing of a dose changes its effect.',
    href: 'https://www.scni.ox.ac.uk/team/russell-foster',
    sourceLabel: 'Oxford profile & papers',
  },
  {
    clinician: LANDING_CLINICIANS.roenneberg,
    cite: 'Measures each person\u2019s body-clock type at population scale, putting numbers to the individual timing Halberg called for.',
    href: 'https://scholar.google.com/citations?user=NvUedX8AAAAJ',
    sourceLabel: 'Publications (Scholar)',
  },
] as const

export type ResearchPaperTile = {
  id: string
  tier: string
  title: string
  authors: string
  year: string
  meta: string
  href: string
  /** Optional banner image (used on the landing evidence tiles). */
  image?: string
  imageAlt?: string
}

export type ResearchCluster = {
  id: string
  tier: 'Foundational' | 'Drug-specific' | 'Population'
  summary: string
  papers: ResearchPaperTile[]
}

export const DEEPDOSE_RESEARCH_CLUSTERS: ResearchCluster[] = [
  {
    id: 'foundational',
    tier: 'Foundational',
    summary: 'Body clocks and chronobiology — the science precision timing is built on.',
    papers: [
      {
        id: 'halberg-1969',
        tier: 'Foundational',
        title: 'Chronobiology — the science that started it all',
        authors: 'Halberg, F.',
        year: '1969',
        meta: 'Annual Review of Physiology · Coined “circadian”',
        href: 'https://doi.org/10.1146/annurev.ph.31.030169.003331',
      },
      {
        id: 'foster-2022',
        tier: 'Foundational',
        title: 'Life Time: The New Science of the Body Clock',
        authors: 'Foster, R.',
        year: '2022',
        meta: 'Oxford · When to take drugs',
        href: 'https://www.penguin.co.uk/books/446135/life-time-by-russell-foster/',
      },
      {
        id: 'pigazzani-2024',
        tier: 'Foundational',
        title: 'Timed antihypertensives by chronotype (TIME substudy)',
        authors: 'Pigazzani, F. et al.',
        year: '2024',
        meta: 'eClinicalMedicine',
        href: 'https://doi.org/10.1016/j.eclinm.2024.102633',
        image: '/research/evidence-antihypertensives.png',
        imageAlt: 'Heartbeat pulse tracing across a dawn-to-night sky',
      },
    ],
  },
  {
    id: 'drug-specific',
    tier: 'Drug-specific',
    summary: 'Same drug, different hour — when the dose lands changes what it does.',
    papers: [
      {
        id: 'hermida-2020',
        tier: 'Drug-specific',
        title: 'Bedtime hypertension treatment (Hygia Chronotherapy Trial)',
        authors: 'Hermida, R.C. et al.',
        year: '2020',
        meta: 'European Heart Journal',
        href: 'https://doi.org/10.1093/eurheartj/ehaa152',
        image: '/research/evidence-bedtime.png',
        imageAlt: 'Crescent moon over a glowing blood vessel at night',
      },
      {
        id: 'dallmann-2016',
        tier: 'Drug-specific',
        title: 'Dosing-Time Makes the Poison',
        authors: 'Dallmann, R. et al.',
        year: '2016',
        meta: 'Trends in Molecular Medicine',
        href: 'https://doi.org/10.1016/j.molmed.2016.03.004',
      },
      {
        id: 'wallace-2003',
        tier: 'Drug-specific',
        title: 'Simvastatin morning vs evening (RCT)',
        authors: 'Wallace, A. et al.',
        year: '2003',
        meta: 'BMJ',
        href: 'https://doi.org/10.1136/bmj.327.7418.788',
        image: '/research/evidence-statin.png',
        imageAlt: 'Glowing capsule between a sunrise and an evening sky',
      },
    ],
  },
  {
    id: 'population',
    tier: 'Population',
    summary: 'Real-world body clocks at scale — why one schedule fails whole groups.',
    papers: [
      {
        id: 'roenneberg-2007',
        tier: 'Population',
        title: 'Epidemiology of the human circadian clock',
        authors: 'Roenneberg, T. et al.',
        year: '2007',
        meta: 'Sleep Medicine Reviews',
        href: 'https://doi.org/10.1016/j.sleep.2007.05.001',
      },
      {
        id: 'windred-2024',
        tier: 'Population',
        title: 'Brighter nights, darker days predict higher mortality',
        authors: 'Windred, D.P. et al.',
        year: '2024',
        meta: 'PNAS · 88,905 UK Biobank participants',
        href: 'https://doi.org/10.1073/pnas.2405924121',
      },
      {
        id: 'cajochen-2025',
        tier: 'Population',
        title: 'Stuck in time: the slow march of circadian medicine',
        authors: 'Cajochen, C. et al.',
        year: '2025',
        meta: 'Journal of Sleep Research',
        href: 'https://doi.org/10.1111/jsr.14318',
      },
    ],
  },
]

export const DEEPDOSE_RESEARCH_PAPERS: ResearchPaperTile[] = DEEPDOSE_RESEARCH_CLUSTERS.flatMap(
  (cluster) => cluster.papers
)
