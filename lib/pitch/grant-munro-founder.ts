/** Shared founder profile — contact page, problem paper byline, pitch detail, etc. */

export const GRANT_MUNRO_PAPER_TITLE = 'Precision Chronotherapy (2026)' as const

/** Personal origin — why preventive dose intelligence, not reactive surgery alone */
export const GRANT_MUNRO_FOUNDER_ORIGIN = {
  eyebrow: 'Founder story',
  headline: 'Vision loss taught him prevention comes first.',
  paragraphs: [
    'Grant Munro founded DIOS after years of personal struggle with vision following several failed vitrectomy operations. Each procedure aimed to save sight; each recovery left more uncertainty about what came next.',
    'That experience exposed a hard truth: reactive surgery after the retina is already in crisis is not the same as measuring biology early and acting before decline becomes irreversible.',
    'Preventive monitoring — light, eye, blood, and sleep read as one clock — could have changed his trajectory. DIOS is built so the next patient does not have to learn that lesson through failed operations alone.',
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
    'Grant Munro is the founder of DIOS Health, building dose intelligence infrastructure that connects circadian biology to everyday prescribing and medicines optimisation.',
    'After several failed vitrectomy operations and a long fight to preserve his vision, he concluded that preventive, biology-led monitoring must come before reactive crisis care — a conviction that shaped the Retinomic eye scan and the wider dose intelligence stack.',
    'He is an Honorary Fellow at the National Institute for Health Innovation (NIHI), University of Auckland — a research institute focused on prevention, chronic disease management, and health technology translation.',
    `His founder position paper, ${GRANT_MUNRO_PAPER_TITLE}, sets out the clinical and system case for personalised medicine timing. The full text is on the problem page, with a downloadable PDF.`,
  ],
  links: [
    { label: 'Read the founder paper', href: '/pitch/problem', external: false as const },
    { label: 'NIHI, University of Auckland', href: 'https://www.nihi.org.nz/', external: true as const },
  ],
} as const
