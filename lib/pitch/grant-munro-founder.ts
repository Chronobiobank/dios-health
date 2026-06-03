/** Shared founder profile — contact page, problem paper byline, etc. */

export const GRANT_MUNRO_PAPER_TITLE = 'Precision Chronotherapy (2026)' as const

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
  overview: [
    'Grant Munro is the founder of DIOS Health, building dose intelligence infrastructure that connects circadian biology to everyday prescribing and medicines optimisation.',
    'He is an Honorary Fellow at the National Institute for Health Innovation (NIHI), University of Auckland — a research institute focused on prevention, chronic disease management, and health technology translation.',
    `His founder position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the clinical and system case for personalised medicine timing. The full text is on the problem page, with a downloadable PDF.`,
  ],
  links: [
    { label: 'Read the founder paper', href: '/pitch/problem' },
    { label: 'NIHI, University of Auckland', href: 'https://www.nihi.org.nz/', external: true },
  ],
} as const
