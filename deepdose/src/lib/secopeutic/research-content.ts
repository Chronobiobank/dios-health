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
    'Medicines are often taken at the wrong point in the body clock. The same dose can mean weaker effects, more side effects, and hundreds of millions in avoidable NHS harm each year.',
  cost: {
    href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
    label: 'NHS medicines optimisation',
  },
  consent:
    'You choose what data we can use. Consent first · UK GDPR · Your clinician stays in the loop.',
} as const

export const DEEPDOSE_RESEARCH_SCHOLARS = [
  {
    clinician: LANDING_CLINICIANS.foster,
    cite: 'Circadian light pathways set biological phase, the foundation for timing medicines and daily habits.',
    href: 'https://www.penguin.co.uk/books/446135/life-time-by-russell-foster/',
    sourceLabel: 'Life Time (2022)',
  },
  {
    clinician: LANDING_CLINICIANS.roenneberg,
    cite: 'Chronotype and social jet lag shape when the body best responds to light, sleep, and routine cues.',
    href: 'https://doi.org/10.1016/j.sleep.2007.05.001',
    sourceLabel: 'Sleep Medicine Reviews (2007)',
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

export const DEEPDOSE_RESEARCH_PAPERS: ResearchPaperTile[] = [
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
    id: 'hermida-2008',
    tier: 'Drug-specific',
    title: 'Time of day of blood pressure treatment in diabetes',
    authors: 'Hermida, R.C. et al.',
    year: '2008',
    meta: 'Diabetes Care',
    href: 'https://doi.org/10.2337/dc08-0293',
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
  {
    id: 'smolensky-2007',
    tier: 'Drug-specific',
    title: 'Chronobiology, drug delivery, and chronotherapeutics',
    authors: 'Smolensky, M.H. et al.',
    year: '2007',
    meta: 'Advanced Drug Delivery Reviews',
    href: 'https://doi.org/10.1016/j.addr.2007.05.009',
  },
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
    id: 'amiama-roig-2022',
    tier: 'Population',
    title: 'Timing of administration for common medicines',
    authors: 'Amiama-Roig, A. et al.',
    year: '2016',
    meta: 'Pharmaceutics · PMC',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4932476/',
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
]
