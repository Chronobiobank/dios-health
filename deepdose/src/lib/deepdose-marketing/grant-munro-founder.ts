import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Founder profile: About page and clinician context. */
export const GRANT_MUNRO_PROFILE = {
  name: 'Grant Munro',
  role: `Founder of ${DEEPDOSE_NAME}`,
  product: DEEPDOSE_NAME,
  image: '/authors/grant-munro.jpeg',
  imageAlt: `Grant Munro, founder of ${DEEPDOSE_NAME}`,
  affiliation: 'NIHI Fellow, University of Auckland',
  nihiUrl: 'https://www.nihi.org.nz/',
  paragraphs: [
    'Most of us have taken a medicine at the wrong moment — too early, too late, on a body that was already out of sync — and wondered why it did not land the way we were promised. The label said once a day. Life said otherwise.',
    'Patients deserve better than a fixed alarm. Clinicians deserve better than guessing whether someone\'s rhythm has slipped since the last visit. I kept meeting both sides with the same quiet frustration: everyone sensed that timing mattered, but nobody had a simple, trustworthy way to act on it.',
    `That is why I built ${DEEPDOSE_NAME} — not to add another dashboard, but to give everyday care a sense of timing again. Your body already knows when it is ready. We built something that listens, and something that lets the right clinician step in when it counts.`,
    'Whether you are sorting your own meds at the kitchen table, reviewing a panel before clinic, or deciding whether timing belongs in your product roadmap — the aim is the same: the right dose, at the right moment, with a human still in charge of every decision.',
  ],
} as const
