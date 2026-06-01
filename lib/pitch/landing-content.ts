/** Landing pitch deck — copy and primary sources (Calm UI). */

export type PitchCitation = {
  label: string
  href: string
}

export const PITCH_HOOK_CITATIONS: PitchCitation[] = [
  {
    label: 'York & School of Pharmacy (2010)',
    href: 'https://www.gov.uk/government/news/improving-medicine-use-and-cutting-wastage-to-be-tackled',
  },
  {
    label: 'NHS England medicines waste',
    href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
  },
]

export const PITCH_PROBLEM_CARDS = [
  {
    id: 'hygia',
    finding: 'Bedtime antihypertensives reduced major cardiovascular events versus morning dosing.',
    detail:
      'Hygia Chronotherapy Trial (n=19,084). Hermida et al., European Heart Journal 2020.',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
    label: 'EHJ · Hygia trial',
    caveat:
      'Independent replication of Hygia has been questioned. DIOS treats this as supporting evidence alongside the TIME chronotype sub-study (Pigazzani et al., eClinicalMedicine 2024), not as standalone proof.',
    caveatHref: 'https://doi.org/10.1016/j.eclinm.2024.102633',
    caveatLabel: 'TIME chronotype sub-study',
  },
  {
    id: 'biobank-mortality',
    finding: 'Brighter nights and darker days predict higher all-cause and cardiometabolic mortality.',
    detail:
      'UK Biobank — 88,905 participants, ~13 million hours of wrist-worn light sensor data. PNAS 2024.',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    label: 'PNAS · personal light exposure',
  },
  {
    id: 'biobank-t2dm',
    finding: 'Personal light exposure patterns predict incident type 2 diabetes prospectively.',
    detail:
      'UK Biobank — 84,790 participants, 13 million sensor hours, Lancet Regional Health – Europe 2024.',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    label: 'Lancet · light & T2DM',
  },
  {
    id: 'elliott',
    finding: '237 million medication errors occur in England each year — most in primary care.',
    detail:
      'Elliott et al. Economic burden of medication error. BMJ Quality & Safety 2020.',
    href: 'https://doi.org/10.1136/bmjqs-2019-010206',
    label: 'BMJ QS · medication errors',
  },
] as const

export const PITCH_BIOMARKER_STATS = [
  {
    value: '89,000',
    label: 'UK Biobank participants with personal light sensors',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2405924121',
    cite: 'PNAS 2024',
  },
  {
    value: '13M',
    label: 'Hours of melanopic-relevant light data in population studies',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    cite: 'Lancet 2024',
  },
  {
    value: '3',
    label: 'Peer-reviewed outlets validating the biomarker narrative',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
    cite: 'PNAS · Lancet · JAMA Network Open',
  },
  {
    value: 'S026',
    label: 'CIE melanopic action spectrum — international photometric standard',
    href: 'https://cie.co.at/publications/cie-systems/cie-s026-e2018-melanopic-action-spectrum',
    cite: 'CIE S026:2018',
  },
] as const

export const PITCH_VALIDATION_GAP =
  'Population studies validate light–health associations at scale. Prospective validation of smartphone-derived Melanopic Lux phase time against gold-standard DLMO in diverse UK cohorts remains the active evidence gap DIOS is designed to close.'

export const PITCH_SPECTRUM_NODE_CITATIONS: Record<string, PitchCitation> = {
  'body-clock': {
    label: 'PNAS',
    href: 'https://www.pnas.org/doi/10.1073/pnas.2301608120',
  },
  'sleep-quality': {
    label: 'PLOS Biology',
    href: 'https://doi.org/10.1371/journal.pbio.3001571',
  },
  'blood-sugar': {
    label: 'Lancet',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
  },
  'blood-pressure': {
    label: 'EHJ',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
  },
  'immune-flare': {
    label: 'Coimbra',
    href: 'https://doi.org/10.1007/s40263-014-0176-2',
  },
  'brain-health': {
    label: 'Gominak',
    href: 'https://doi.org/10.1016/j.mehy.2012.07.031',
  },
  'cancer-risk': {
    label: 'IARC',
    href: 'https://monographs.iarc.who.int/list-of-classifications',
  },
}

export const PITCH_CONFIDENCE_LAYERS = [
  {
    key: 'ESTIMATED',
    title: 'Layer 1 · Vaya',
    body: 'Smartphone camera Melanopic Lux session — up to ~60% confidence.',
  },
  {
    key: 'PRECISION',
    title: 'Layer 2 · Blood panel',
    body: 'Gominak nutrient panel sharpens metabolic and immune nodes.',
  },
  {
    key: 'CONFIRMED',
    title: 'Layer 3 · TipTraQ',
    body: 'Sleep and autonomic nights confirm phase and dipping patterns.',
  },
] as const

export const PITCH_HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Mel',
    body: 'Vaya measures Melanopic Lux — the melanopsin-weighted signal that entrains your master clock.',
  },
  {
    step: '02',
    title: 'Camera',
    body: 'A 60-second front-camera session with GPS and time-of-day context. No wearable required.',
  },
  {
    step: '03',
    title: 'Protocol',
    body: 'DIOS aligns medication, light, meal, and movement cues to your personal phase — clinician-reviewable.',
  },
] as const

export const PITCH_CLINICAL_DISCLAIMER =
  'DIOS is clinical decision support, not a diagnostic device. It does not replace prescribing judgement. Protocol outputs are informative timing guidance for shared decision-making.'

export const PITCH_FOUR_SIDES = [
  {
    audience: 'Patients',
    line: 'Free Vaya sessions and personal timing protocols via dios.health.',
    emphasis: 'Free',
  },
  {
    audience: 'Clinicians',
    line: 'Review spectrum, adherence, and export-ready consultation summaries.',
    emphasis: 'Free',
  },
  {
    audience: 'NHS',
    line: 'Infrastructure for dose-timing at population scale — built for integration and audit.',
    emphasis: 'Partnership',
  },
  {
    audience: 'Pharma',
    line: 'Governed, anonymised Chronobiobank datasets — licensed for research, never sold as identifiable records.',
    emphasis: 'Data licensing',
  },
] as const

export const PITCH_CHRONOBIOBANK_STEPS = [
  'Clinical use consent — required for Vaya and DIOS timing outputs.',
  'Optional research contribution — revocable; anonymised streams only.',
  'Layered confidence labels — ESTIMATED → PRECISION → CONFIRMED as data accrues.',
] as const

export const RESEARCH_ENQUIRIES_EMAIL = 'research@dios.health'
