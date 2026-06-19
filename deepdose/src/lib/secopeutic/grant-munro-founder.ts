import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Founder profile: About page and clinician context. */
export const GRANT_MUNRO_PROFILE = {
  name: 'Grant Munro',
  role: `Founder, DIOS Health`,
  product: DEEPDOSE_NAME,
  image: '/authors/grant-munro.jpeg',
  imageAlt: 'Grant Munro, founder of DIOS Health',
  affiliation: 'Honorary Fellow, NIHI, University of Auckland',
  nihiUrl: 'https://www.nihi.org.nz/',
  headline: 'Prevention research, built for real prescribing.',
  paragraphs: [
    `I built ${DEEPDOSE_NAME} because timing is the missing piece in everyday care. People are told what to take, rarely when their body is ready to use it.`,
    'I am an Honorary Fellow at the National Institute for Health Innovation (NIHI), University of Auckland. My work sits where prevention, chronic disease, and health technology meet, and where that meets the GP surgery.',
    `For clinicians: ${DEEPDOSE_NAME} is decision support, not prescribing. You can order a home sleep kit, review TipTraQ nights on your dashboard, and patients see a simple dose dash: dose windows and metabolic risk in plain language. You keep every treatment decision.`,
  ],
} as const
