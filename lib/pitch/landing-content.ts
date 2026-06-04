/** Landing pitch deck — concise copy and primary sources (Calm UI). */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

export type PitchCitation = {
  label: string
  href: string
}

export const PITCH_HOOK_CITATIONS: PitchCitation[] = [
  {
    label: 'York (2010)',
    href: 'https://www.gov.uk/government/news/improving-medicine-use-and-cutting-wastage-to-be-tackled',
  },
  {
    label: 'NHS waste',
    href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
  },
]

export const PITCH_PROBLEM_CARDS = [
  {
    id: 'hygia',
    image: PITCH_IMAGES.problem.hygia,
    imageAlt: 'Bedtime blood pressure medication at night',
    finding: 'Bedtime antihypertensives cut major cardiovascular events.',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
    label: 'EHJ · Hygia',
  },
  {
    id: 'biobank-mortality',
    image: PITCH_IMAGES.problem['biobank-mortality'],
    imageAlt: 'Bright nights versus dark days light exposure contrast',
    finding: 'Brighter nights, darker days — higher mortality.',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    label: 'PNAS 2024',
  },
  {
    id: 'biobank-t2dm',
    image: PITCH_IMAGES.problem['biobank-t2dm'],
    imageAlt: 'Light exposure and type 2 diabetes risk',
    finding: 'Light exposure predicts type 2 diabetes.',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    label: 'Lancet 2024',
  },
  {
    id: 'elliott',
    image: PITCH_IMAGES.problem.elliott,
    imageAlt: 'Medication errors in primary care pharmacy',
    finding: '237M medication errors in England yearly.',
    href: 'https://doi.org/10.1136/bmjqs-2019-010206',
    label: 'BMJ QS',
  },
] as const

export const PITCH_BIOMARKER_STATS = [
  {
    value: '89k',
    label: 'UK Biobank with light sensors',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    cite: 'PNAS',
    image: PITCH_IMAGES.biomarker.uk,
    imageAlt: 'UK Biobank participant wearing a light sensor',
  },
  {
    value: '13M',
    label: 'Hours of sensor data',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    cite: 'Lancet',
    image: PITCH_IMAGES.biomarker.hours,
    imageAlt: 'Millions of hours of personal light sensor data',
  },
  {
    value: 'CIE',
    label: 'S026 melanopic standard',
    href: 'https://cie.co.at/publications/cie-systems/cie-s026-e2018-melanopic-action-spectrum',
    cite: 'S026:2018',
    image: PITCH_IMAGES.biomarker.cie,
    imageAlt: 'CIE S026 melanopic action spectrum',
  },
  {
    value: 'MLux',
    label: 'Smartphone-measurable biomarker',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
    cite: 'PNAS',
    image: PITCH_IMAGES.biomarker.mlux,
    imageAlt: 'Smartphone measuring melanopic lux from the front camera',
  },
] as const

export const PITCH_SPECTRUM_PAGE = '/evidence#spectrum' as const

export const PITCH_CONFIDENCE_LAYERS = [
  { key: 'ESTIMATED', title: 'L1 · DIOS Coach', body: 'Camera session' },
  { key: 'PRECISION', title: 'L2 · Bloods', body: 'Gominak panel' },
  { key: 'CONFIRMED', title: 'L3 · TipTraQ', body: 'Sleep + ANS' },
] as const

export const PITCH_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'DIOS Coach',
    body: 'Measures melanopic lux — your clock signal.',
    image: PITCH_IMAGES.steps.mel,
    imageAlt: 'Glowing voice orb for DIOS Coach',
  },
  {
    step: '02',
    title: 'Camera',
    body: '60 seconds. No wearable.',
    image: PITCH_IMAGES.steps.camera,
    imageAlt: 'Smartphone front camera light session',
  },
  {
    step: '03',
    title: 'Protocol',
    body: 'Timed doses and zeitgebers.',
    image: PITCH_IMAGES.steps.protocol,
    imageAlt: 'Personalised chronotherapy protocol',
  },
] as const

export const PITCH_FOUR_SIDES = [
  {
    audience: 'Patients',
    line: 'Free DIOS Coach sessions and protocols.',
    emphasis: 'Free',
    image: PITCH_IMAGES.sides.Patients,
    imageAlt: 'Patient using phone for health session',
  },
  {
    audience: 'Clinicians',
    line: 'Spectrum review and exports.',
    emphasis: 'Free',
    image: PITCH_IMAGES.sides.Clinicians,
    imageAlt: 'Clinician reviewing patient data',
  },
  {
    audience: 'NHS',
    line: 'Population dose-timing infrastructure.',
    emphasis: 'Partnership',
    image: PITCH_IMAGES.sides.NHS,
    imageAlt: 'NHS hospital architecture at dusk',
  },
  {
    audience: 'Pharma',
    line: 'Governed anonymised research data.',
    emphasis: 'Licensing',
    image: PITCH_IMAGES.sides.Pharma,
    imageAlt: 'Research laboratory abstract',
  },
] as const

export const PITCH_CHRONOBIOBANK_STEPS = [
  'Clinical consent for DIOS Coach and DIOS.',
  'Optional anonymised research — revocable.',
  'Confidence: ESTIMATED → PRECISION → CONFIRMED.',
] as const

export const RESEARCH_ENQUIRIES_EMAIL = 'research@dios.health'

export const PITCH_CONTACT_PAGE = '/contact' as const
