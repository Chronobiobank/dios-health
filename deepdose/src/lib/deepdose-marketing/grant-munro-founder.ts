import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Founder profile: About page and clinician context. */
export const GRANT_MUNRO_PROFILE = {
  name: 'Grant Munro',
  role: `Founder, DIOS Health`,
  product: DEEPDOSE_NAME,
  image: '/authors/grant-munro.jpeg',
  imageAlt: 'Grant Munro, founder of DIOS Health',
  affiliation: 'NIHI Fellow, University of Auckland',
  nihiUrl: 'https://www.nihi.org.nz/',
  paragraphs: [
    "Life didn't just appear on Earth. It was engineered by its rhythms. From the earliest single-celled organisms more than three billion years ago, primitive metabolic systems, essentially ancient guts, evolved to anticipate the daily cycle of light and dark. Over hundreds of millions of years, those rhythms became hardwired into every level of biology. As complex animals emerged, the same timing system scaled up: a master clock in the brain, peripheral clocks in nearly every organ and cell, and finely tuned responses to the 24-hour solar day and longer lunar cycles.",
    'The result is a body that is exquisitely time-sensitive. Cortisol peaks at dawn to mobilise energy. Blood pressure, heart rate, and platelet activity rise in the morning. Digestive enzymes and gut motility follow predictable daily patterns. Melatonin, growth hormone, and cellular repair dominate at night. These are not minor fluctuations. They decide when medicines are most effective, and when they are more likely to cause side effects.',
    'Yet everyday clinical practice still largely treats the body as if it were timeless. That disconnect was my turning point.',
    `${DEEPDOSE_NAME} was built to close that gap. By combining circadian biology with simple, at-home sleep monitoring, it identifies each patient's own internal timing. The same dose, taken at the biologically optimal window, can deliver better efficacy, smoother tolerability, and more predictable results.`,
  ],
} as const
