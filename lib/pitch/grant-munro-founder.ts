/** Shared founder profile — contact page, problem paper byline, pitch detail, etc. */

export const GRANT_MUNRO_PAPER_TITLE = 'Precision Chronotherapy (2026)' as const

export const GRANT_MUNRO_FOUNDER_ORIGIN = {
  eyebrow: 'Founder',
  headline: 'Prevention research, built for prescribing.',
  paragraphs: [
    'Grant Munro is the founder of DIOS Health and an Honorary Fellow at the National Institute for Health Innovation (NIHI), University of Auckland — working where prevention, chronic disease management, and health technology translation meet.',
    'DIOS layers passive smartphone capture with partner-verified streams: City Labs blood panels for metabolic and circadian cofactors, and PranaQ TipTraQ for FDA-cleared home sleep verification when timing evidence must be clinical-grade.',
    `His position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the medicines optimisation case for personalised dose timing — the system argument behind the platform.`,
  ],
} as const

export const GRANT_MUNRO_FOUNDER = {
  name: 'Grant Munro',
  role: 'Founder, DIOS Health',
  paperTitle: GRANT_MUNRO_PAPER_TITLE,
  profileImage: '/grant-munro.jpeg',
  profileImageAlt: 'Grant Munro, Founder of DIOS Health',
  affiliation:
    'Honorary Fellow, National Institute for Health Innovation (NIHI), University of Auckland',
  affiliationShort: 'Honorary Fellow, NIHI — University of Auckland',
  nihiUrl: 'https://www.nihi.org.nz/',
  origin: GRANT_MUNRO_FOUNDER_ORIGIN,
  overview: [
    'Grant Munro founded DIOS Health to build dose intelligence infrastructure — connecting circadian biology to everyday prescribing and medicines optimisation.',
    'He is an Honorary Fellow at the National Institute for Health Innovation (NIHI), University of Auckland, with a background in prevention-led health technology and chronic disease management.',
    'The platform integrates partner data streams including City Labs panels and PranaQ TipTraQ alongside the Retinomic eye scan and First Light photic baseline.',
    `His founder position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the clinical and system case for personalised medicine timing. The full text is on the problem page, with a downloadable PDF.`,
  ],
  links: [
    { label: 'Read the founder paper', href: '/pitch/problem', external: false as const },
    { label: 'NIHI, University of Auckland', href: 'https://www.nihi.org.nz/', external: true as const },
  ],
} as const
