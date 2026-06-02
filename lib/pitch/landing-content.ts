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
    imageAlt: 'Abstract evening medication and cardiovascular rhythm',
    finding: 'Bedtime antihypertensives cut major cardiovascular events.',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
    label: 'EHJ · Hygia',
    caveat: 'Replication debated.',
    caveatHref: 'https://doi.org/10.1016/j.eclinm.2024.102633',
    caveatLabel: 'TIME study',
  },
  {
    id: 'biobank-mortality',
    image: PITCH_IMAGES.problem['biobank-mortality'],
    imageAlt: 'Wrist-worn light sensor in soft amber glow',
    finding: 'Brighter nights, darker days — higher mortality.',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    label: 'PNAS 2024',
  },
  {
    id: 'biobank-t2dm',
    image: PITCH_IMAGES.problem['biobank-t2dm'],
    imageAlt: 'Circadian light and metabolic health',
    finding: 'Light exposure predicts type 2 diabetes.',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    label: 'Lancet 2024',
  },
  {
    id: 'elliott',
    image: PITCH_IMAGES.problem.elliott,
    imageAlt: 'Medication safety in primary care',
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
    image: PITCH_IMAGES.biomarker,
    imageAlt: 'Melanopic lux light field',
  },
  {
    value: '13M',
    label: 'Hours of sensor data',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    cite: 'Lancet',
    image: PITCH_IMAGES.biomarker,
    imageAlt: 'Population light exposure study',
  },
  {
    value: 'CIE',
    label: 'S026 melanopic standard',
    href: 'https://cie.co.at/publications/cie-systems/cie-s026-e2018-melanopic-action-spectrum',
    cite: 'S026:2018',
    image: PITCH_IMAGES.biomarker,
    imageAlt: 'Photometric standard spectrum',
  },
  {
    value: 'MLux',
    label: 'Smartphone-measurable biomarker',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
    cite: 'PNAS',
    image: PITCH_IMAGES.biomarker,
    imageAlt: 'Phone camera circadian capture',
  },
] as const

export const PITCH_VALIDATION_GAP =
  'Population evidence is strong. Smartphone MLux phase time still needs prospective DLMO validation in diverse UK cohorts.'

export const PITCH_SPECTRUM_NODE_CITATIONS: Record<string, PitchCitation> = {
  'body-clock': { label: 'PNAS', href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120' },
  'sleep-quality': {
    label: 'PLOS',
    href: 'https://doi.org/10.1371/journal.pbio.3001571',
  },
  'blood-sugar': {
    label: 'Lancet',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
  },
  'blood-pressure': { label: 'EHJ', href: 'https://doi.org/10.1093/eurheartj/ehz754' },
  'immune-flare': { label: 'Coimbra', href: 'https://doi.org/10.1007/s40263-014-0176-2' },
  'brain-health': { label: 'Gominak', href: 'https://doi.org/10.1016/j.mehy.2012.07.031' },
  'cancer-risk': { label: 'IARC', href: 'https://monographs.iarc.who.int/list-of-classifications' },
}

export const PITCH_CONFIDENCE_LAYERS = [
  { key: 'ESTIMATED', title: 'L1 · Mel', body: 'Camera session' },
  { key: 'PRECISION', title: 'L2 · Bloods', body: 'Gominak panel' },
  { key: 'CONFIRMED', title: 'L3 · TipTraQ', body: 'Sleep + ANS' },
] as const

export const PITCH_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Mel',
    body: 'Measures melanopic lux — your clock signal.',
    image: PITCH_IMAGES.steps.mel,
    imageAlt: 'Glowing voice orb for Mel assistant',
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

export const PITCH_CLINICAL_DISCLAIMER =
  'Clinical decision support only — not a diagnosis. Shared decision-making with your clinician.'

export const PITCH_FOUR_SIDES = [
  {
    audience: 'Patients',
    line: 'Free Mel sessions and protocols.',
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
  'Clinical consent for Mel and DIOS.',
  'Optional anonymised research — revocable.',
  'Confidence: ESTIMATED → PRECISION → CONFIRMED.',
] as const

export const RESEARCH_ENQUIRIES_EMAIL = 'research@dios.health'
