/** Chronobiobank , distributed intelligence, hybrid learning, licensing plane. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  CHRONOBIOBANK_SCIENCE_HREF,
} from '@/lib/deepdose-marketing/site-nav-links'

export const CHRONOBIOBANK_META = {
  title: `Mission · ${DEEPDOSE_NAME}`,
  description:
    'For people who do not live on a 9-to-5 clock. Score your nights. Plan what you take. Find people on your rhythm.',
} as const

export const CHRONOBIOBANK_INTRO = {
  eyebrow: 'Mission',
  titleWhite: 'For',
  titleAccent: 'people off the clock.',
  lede:
    `${DEEPDOSE_NAME} is home of Medmaxxing. Score how you sleep. Plan your meds and supplements. Boost your chemistry. Find people whose rhythm fits yours.`,
  quote:
    'The age of highlight reels is ending. The age of one real night, logged, has begun.',
} as const

/**
 * Evolution story as a 2×2 tile matrix.
 * Each body is exactly 50 characters so tiles stay equal height.
 */
export const CHRONOBIOBANK_LETTER_TILES = [
  {
    id: 'then',
    label: 'Then',
    body: 'For years we matched on profiles and photos alone.',
  },
  {
    id: 'now',
    label: 'Now',
    body: 'Now we share the night we lived, score and photo.',
  },
  {
    id: 'how',
    label: 'How',
    body: 'Built on sleep score, locked nights, and doses you share.',
  },
  {
    id: 'who',
    label: 'Who',
    body: 'Not the perfect match. The rhythm that fits yours.',
  },
] as const

export const CHRONOBIOBANK_MISSION_CTA = {
  label: 'Log a dose',
  href: '/dose',
} as const

export const CHRONOBIOBANK_TRUST = {
  eyebrow: 'Why now',
  title: 'When institutional trust is tested',
  lede:
    'UK Biobank showed what a national cohort can do for science. It also showed what happens when half a million people are asked to trust a single institution with samples, genomes, and linked health records , and that trust is questioned again and again.',
  quote:
    'UK Biobank asked half a million people to trust an institution with their most intimate biological data. That trust has been tested. We\u2019re building something different \u2014 where the data never leaves you.',
  contrasts: [
    {
      id: 'central',
      label: 'Central biobank',
      cue: '#6b7280',
      title: 'The asset moves to the institution',
      body:
        'Participants contribute samples and records to a warehouse model. Research scales , but so does the trust surface every time access rules, commercial reuse, or data partnerships come under scrutiny.',
    },
    {
      id: 'distributed',
      label: 'Chronobiobank',
      cue: '#acd3de',
      title: 'The asset stays on your edge',
      body:
        'Raw sleep and timing data remain patient-owned. Federated learning and privacy-preserving summaries improve models without centralising the intimate trace. Licensed research sees pseudonymised outcomes , not your nights.',
    },
  ],
  closing:
    'A generation primed by Cambridge Analytica and NHS data-sale rows does not need another citizen-science biobank that quietly ships the asset to a server. Chronobiobank is research infrastructure built for people who want population insight without surrendering personal biology.',
} as const

export const CHRONOBIOBANK_PLANE = {
  label: 'Why Deepdose?',
  cue: '#8b9cf8',
  title: 'Smarter profiles, deeper matches.',
  /** Keep each beat exactly 54 chars so two-line clamp stays legible. */
  beats: [
    'Add your chemical body clock as your living signature.',
    'We match you by chemical and social body clocks alike.',
    'Connect, chat, and share your chemical profile freely.',
    'Meet in person or share with labs to drive innovation.',
  ],
} as const

/** Plain-language steps , used in the “Together” mission tile. */
export const CHRONOBIOBANK_MISSION_STEPS = [
  {
    id: 'phone',
    label: 'Understand',
    cue: '#acd3de',
    title: 'Your chemistry stays with you',
    body:
      'Rhythm, sleep, and chemistry details live on your phone. Matching reads a signature, not a warehouse of your nights.',
  },
  {
    id: 'learn',
    label: 'Connect',
    cue: '#8b9cf8',
    title: 'People on your chemistry',
    body:
      'We pair you on rhythm, chemistry, and journey. Share details for connection and correction. No endless scroll.',
  },
  {
    id: 'share',
    label: 'If you say yes',
    cue: '#f2b8a2',
    title: 'Research sees groups, not you',
    body:
      'Approved studies may use grouped timing outcomes. They never open your personal sleep chart or chat.',
  },
] as const

/**
 * Four tiles under “How matching works”.
 * Distinct outcomes (not a restatement of the beats).
 * Titles exactly 18 chars · teasers ~47–51 chars.
 */
export const CHRONOBIOBANK_MISSION_FEATURES = [
  {
    id: 'yours',
    badge: 'Quiet',
    title: 'No scroll. People.',
    teaser: 'Connection without a feed, ads, or attention trap.',
    cue: '#f2b8a2',
  },
  {
    id: 'together',
    badge: 'Peers',
    title: 'Peers on your clock',
    teaser: 'Share details and correct nights with similar chemistry.',
    cue: '#8b9cf8',
  },
  {
    id: 'timing',
    badge: 'Wins',
    title: 'What others shared',
    teaser: 'Copy rhythm fixes that worked for your chemical kin.',
    cue: '#acd3de',
  },
  {
    id: 'join',
    badge: 'Free',
    title: 'Free Commons match',
    teaser: 'Chat and share. Deeper TipTraQ reads stay optional.',
    cue: '#c9b6f2',
  },
] as const

export const CHRONOBIOBANK_MISSION_YOURS = {
  intro:
    'Soul-matching needs a signature, not a surveillance feed. Your intimate nights stay close. What others see is the chemistry that helps them find you.',
  contrasts: [
    {
      id: 'central',
      label: 'Attention apps',
      cue: '#6b7280',
      title: 'They sell the scroll',
      body:
        'Most social products keep you watching. Your data fuels ads. Connection is a side effect of the feed.',
    },
    {
      id: 'distributed',
      label: 'Deepdose',
      cue: '#acd3de',
      title: 'We sell the match',
      body:
        'Sleep and timing stay on your phone. Matching uses a shared signature. Research, if you opt in, works from anonymised patterns, not a copy of your nights.',
    },
  ],
  closing:
    'Consent should feel like a door you control. Match when you want. Leave when you want.',
} as const

export const CHRONOBIOBANK_MISSION_TOGETHER = {
  intro:
    'Chemical soul-matching means finding people whose clocks and scripts look like yours. Compute locally. Meet globally. Never turn your biology into an attention trap.',
} as const

export const CHRONOBIOBANK_MISSION_TIMING = {
  intro:
    'Your body runs on a roughly 24-hour rhythm. Matches form when sleep, light, meals, and medicines line up the same way. Timing is how we know two chemistries fit.',
  points: [
    {
      cue: '#f2b8a2',
      title: 'Medicines',
      body: 'Blood pressure pills, statins, and many others work differently by hour. Shared stacks are a strong match signal.',
    },
    {
      cue: '#acd3de',
      title: 'Light & sleep',
      body: 'Late clocks find late clocks. Regular blackout and wake windows are part of your chemical signature.',
    },
    {
      cue: '#8b9cf8',
      title: 'Meals & movement',
      body: 'When you eat and move nudges the same rhythm. Matching sees the whole day, not one pill in isolation.',
    },
  ],
  footnote:
    'Curious about the studies behind timing? The research library and measurement notes are linked from science pages. No PhD required to start matching.',
} as const

export const CHRONOBIOBANK_MISSION_JOIN = {
  intro:
    'Deepdose is built for everyday chemistry: match people on your phone, support from a clinician if you want it, and research only with clear consent.',
  audiences: [
    {
      id: 'patient',
      label: 'Members',
      cue: '#acd3de',
      title: 'Find your match',
      body: 'Add your medicines and rhythm. See people on a similar clock. Chat about what timing actually worked.',
      cta: { label: 'Create profile', href: '/' },
    },
    {
      id: 'researcher',
      label: 'Clinicians',
      cue: '#8b9cf8',
      title: 'Support people you already see',
      body: 'View timing insight and adherence with consent, not a raw dump of someone\u2019s nights.',
      cta: { label: 'Clinician tools', href: '/clinician-landing' },
    },
    {
      id: 'funder',
      label: 'Researchers',
      cue: '#f2b8a2',
      title: 'Study with consent',
      body: 'Work from anonymised cohort patterns and audited access, built for ethics boards, not shadow databases.',
      cta: { label: 'Research & science', href: CHRONOBIOBANK_SCIENCE_HREF },
    },
  ],
} as const

/** Bottom-of-page deep dives , descriptive badges for research & measurement detail. */
export const CHRONOBIOBANK_DEEP_DIVE = {
  research: {
    badge: 'Evidence',
    title: 'Research library',
    teaser: 'Peer-reviewed studies on timing, sleep, and health outcomes',
  },
  science: {
    badge: 'Measurement',
    title: 'Science & trust',
    teaser: 'How we read your rhythm · wearables · what we can and can\u2019t claim',
  },
} as const

export const CHRONOBIOBANK_APPLE = {
  eyebrow: 'Privacy as architecture',
  title: 'What Apple proved , and what it costs',
  lede:
    'Apple made on-device federated learning a competitive advantage, not a compliance checkbox. The model trains locally; only learned weight updates aggregate centrally. Your photos, typing patterns, and health metrics never leave the phone.',
  costTitle: 'Why that collapses the cost structure',
  costBody:
    'Apple\u2019s servers do not process your intimate traces , compute is distributed across a billion devices they do not pay to run. A traditional biobank pulls every sleep log to a central server, cleans it, stores it, and queries it. Participant count scales storage and compute brutally.',
  federatedPoints: [
    {
      title: 'Body-clock state on the edge',
      body: `${DEEPDOSE_NAME} computes BTI, proxy DLMO, and dosing windows on the participant\u2019s phone or wearable path , not in a central warehouse.`,
    },
    {
      title: 'Population patterns from model updates',
      body: 'Chronotype and timing\u2013outcome relationships are learned by aggregating federated weight deltas or privacy-preserving summaries , not raw longitudinal sleep JSON.',
    },
    {
      title: 'Researchers query the model',
      body: 'Licensed partners interrogate population-level inference and pseudonymised outcome aggregates , not a queryable lake of individual nights.',
    },
    {
      title: 'Central infra is coordination',
      body: 'The Chronobiobank runs consent governance, secure aggregation, and audit , not petabyte storage and batch ETL on intimate biology.',
    },
  ],
  consentLine:
    'Participants can see what lives on their device and delete it. Consent stops being abstract policy and becomes something tangible.',
} as const

export const CHRONOBIOBANK_PRECEDENTS = {
  title: 'Technical precedent',
  teaser: 'The stack exists , chronobiology is the novel layer.',
  badge: 'Precedent',
  items: [
    {
      title: 'Apple HealthKit + Core ML',
      body: 'On-device health metrics with local inference , the consumer proof that federated health learning works at scale.',
    },
    {
      title: 'Federated cohort learning',
      body: 'Google\u2019s FLoC was abandoned for ads, but secure population-level inference without centralised behavioural lakes survived in the research stack.',
    },
    {
      title: 'OpenMined / PySyft',
      body: 'Open-source privacy-preserving ML infrastructure built for health research , production-grade federated training and secure aggregation.',
    },
    {
      title: 'HDRUK Trusted Research Environments',
      body: 'Not fully federated yet , but the UK\u2019s national move toward governed research access without shipping raw NHS data to every analyst.',
    },
  ],
} as const

export const CHRONOBIOBANK_SCIENCE = {
  eyebrow: 'Novel science',
  title: 'Longitudinal rhythm, not static snapshots',
  lede:
    'Most federated health learning has used cross-sectional signals , a blood result, a diagnosis code. Circadian data is rhythmic and continuous: sleep timing, light exposure, medication adherence, activity phase.',
  body:
    'A federated chronotype model must learn phase relationships over weeks and months, not single timepoints. That is a genuinely novel research problem , publishable, partnerable, and potentially patentable: a population chronotype inference model that improves with scale without centralising intimate traces.',
  note: 'Hybrid Tier B/C paths exist because polypharmacy cohorts skew older and less connected , federated where capable, privacy-preserving upload elsewhere. Designed from day one, not bolted on later.',
} as const

export const CHRONOBIOBANK_ECOSYSTEM = {
  eyebrow: 'London ecosystem',
  title: 'Who gets this off the ground',
  lede:
    `${DEEPDOSE_NAME} is the working prototype , patient app, wearable ingest, BTI engine, consent-gated Chronobiobank ingest, and enterprise licensing dashboard. The partners below are the credible London stack to scale federated rounds, not claimed relationships.`,
  partners: [
    {
      id: 'openmined',
      label: 'Federated infra',
      cue: '#acd3de',
      title: 'OpenMined / PySyft',
      body:
        'UK-rooted privacy-preserving ML. Natural technical partner for secure aggregation, differential privacy, and federated coordinator implementation.',
    },
    {
      id: 'hdruk',
      label: 'Governance',
      cue: '#8b9cf8',
      title: 'HDRUK',
      body:
        'National health-data research governance and Trusted Research Environment direction. Bridge from federated learning to NHS-trustable population research.',
    },
    {
      id: 'academic',
      label: 'Chronobiology',
      cue: '#c9b6f2',
      title: 'Academic validation',
      body:
        'Oxford Sleep & Circadian Neuroscience (Foster), Roenneberg chronotype methods, and London chronotherapy groups , credibility for longitudinal phase modelling and trial design.',
    },
    {
      id: 'nhs',
      label: 'Adoption',
      cue: '#f2b8a2',
      title: 'London ICB + NIHR',
      body:
        'An Integrated Care Board pilot for polypharmacy timing in older adults; NIHR or digital-health infrastructure grants for federated evaluation , the path from prototype to governed cohort.',
    },
  ],
  prototype: {
    title: `The prototype is ${DEEPDOSE_NAME}`,
    body:
      'Wearable pull-sync, proxy DLMO fusion, clinician triage, pseudonymised Chronobiobank ingest, and licensed enterprise analytics already ship in the codebase. Federated rounds are the next layer on architecture that is live today.',
    cta: { label: `See ${DEEPDOSE_NAME} science`, href: CHRONOBIOBANK_SCIENCE_HREF },
  },
} as const

export const CHRONOBIOBANK_TIERS = [
  {
    id: 'federated',
    label: 'Tier A',
    cue: '#acd3de',
    title: 'Federated',
    audience: 'Modern phone · Oura / Whoop · reliable Wi\u2011Fi',
    body:
      'On-device training in the background. Only encrypted weight updates leave the phone , never raw sleep JSON.',
    leaves: 'Gradient contribution per learning round',
  },
  {
    id: 'upload',
    label: 'Tier B',
    cue: '#c9b6f2',
    title: 'Privacy upload',
    audience: 'Older smartphone · patchy charging · intermittent sync',
    body:
      'When federated training isn\u2019t viable, we queue minimum sufficient statistics , phase features, timing shift, outcome label , with differential-privacy noise before upload.',
    leaves: 'DP-noised feature bundle when online',
  },
  {
    id: 'assisted',
    label: 'Tier C',
    cue: '#f2b8a2',
    title: 'Assisted',
    audience: 'Care home · carer proxy · questionnaire-only',
    body:
      'Human-mediated entry still improves population models. Pseudonymised prescribing outcomes join the same coordinator as federated rounds , via coarse bands, never names.',
    leaves: 'Pseudonymised outcome record only',
  },
] as const

export const CHRONOBIOBANK_CAPTURE = {
  title: 'What we capture',
  teaser: 'Clinical signals on the edge; learning features derived locally.',
  badge: 'Capture',
  points: [
    {
      title: 'Sleep & phase',
      body: 'Sleep onset, wake, deep/REM duration, proxy DLMO, social jet lag, and circadian score , from wearables, phone, or TipTraQ validation.',
    },
    {
      title: 'Medication context',
      body: 'Medication code, prior vs recommended timing, adherence proxy, and whether the clinician accepted or modified the window.',
    },
    {
      title: 'Outcomes',
      body: 'Blood pressure, HbA1c, symptom scores, and adverse events , linked to timing shifts when patients and clinicians record them.',
    },
  ],
} as const

export const CHRONOBIOBANK_STORE = {
  title: 'How we store it',
  teaser: 'Three trust boundaries that never collapse.',
  badge: 'Store',
  stores: [
    {
      title: 'Patient clinical store',
      body: 'Raw sleep logs, DLMO estimates, and prescribing data , Supabase RLS; readable only by the patient and consented clinicians.',
    },
    {
      title: 'Learning coordinator',
      body: 'Round metadata, aggregated contributions, and global model versions , internal only; no patient_id; never licensed to third parties.',
    },
    {
      title: 'Chronobiobank licensing store',
      body: 'Pseudonymised outcome rows and population aggregates , readable only under active data license with full audit trail.',
    },
  ],
} as const

export const CHRONOBIOBANK_RETRIEVE = {
  title: 'Who retrieves what',
  teaser: 'Strict separation between care, learning, and licensing.',
  badge: 'Retrieve',
  rows: [
    {
      role: 'Patient app',
      gets: 'BTI payload, dosing windows, own clinical data',
      never: 'Global model weights or other participants\u2019 data',
    },
    {
      role: 'Clinician triage',
      gets: 'Patient BTI, device sync status, recommendation history',
      never: 'Chronobiobank aggregates or training internals',
    },
    {
      role: 'Learning coordinator',
      gets: 'Aggregated contributions per round',
      never: 'Individual gradients before secure aggregation',
    },
    {
      role: 'Enterprise licensee',
      gets: 'Filtered pseudonymised records and cohort statistics',
      never: 'Raw sleep, re-identification bridge, or model checkpoints',
    },
  ],
} as const

export const CHRONOBIOBANK_LEARNING = {
  title: 'Federated learning loop',
  teaser: 'One task first: does shifting dose timing improve outcomes?',
  badge: 'Learn',
  body:
    'Version one trains a small timing\u2013outcome model across chronotype band, social jet lag, timing shift minutes, medication cluster, and adherence. Capable devices train locally; the coordinator merges; the BTI engine deploys a new model version tag. Patients still see only plain-language window guidance.',
  phases: [
    { label: 'Now', detail: 'Consent-gated pseudonymised outcome ingest and enterprise licensing' },
    { label: 'Next', detail: 'Capability routing and anonymous BTI telemetry' },
    { label: 'Then', detail: 'Privacy upload path for intermittent devices' },
    { label: 'Scale', detail: 'On-device federated rounds for timing\u2013outcome v1' },
  ],
} as const

export const CHRONOBIOBANK_CONSENT = {
  title: 'Consent you control',
  teaser: 'Care, research licensing, and model improvement are separate choices.',
  badge: 'Consent',
  pillars: [
    {
      title: 'Clinical care',
      body: 'Share BTI and device status with your linked clinician. Required for prescribing workflows.',
    },
    {
      title: 'Model improvement',
      body: 'Help train privacy-preserving timing models. Raw sleep never leaves Tier A devices; withdraw any time.',
    },
    {
      title: 'Research licensing',
      body: 'Contribute pseudonymised outcomes to NHS population analytics, pharma R&D, or academic studies , each purpose is explicit.',
    },
  ],
  note: 'UK GDPR-shaped workflows · immutable consent audit log · Chronobiobank isolation: UI never exposes model weights.',
} as const

export const CHRONOBIOBANK_AUDIENCES = [
  {
    id: 'patient',
    label: 'Patients',
    cue: '#acd3de',
    title: 'Your clock stays yours',
    body:
      'Start free with phone and wearable data. Choose what to share. Tier A, B, or C , we route you to the path your device can support.',
    cta: { label: 'Start free', href: '/' },
  },
  {
    id: 'researcher',
    label: 'Researchers & ICBs',
    cue: '#8b9cf8',
    title: 'Licensed population insight',
    body:
      'Filter by age band, chronotype, medication, and consent purpose. Pseudonymised tokens only , full access audit trail.',
    cta: { label: 'Enterprise overview', href: '/enterprise-landing' },
  },
  {
    id: 'funder',
    label: 'Funders & partners',
    cue: '#f2b8a2',
    title: 'A new category of infrastructure',
    body:
      'AI safety, privacy tech, and digital-health infrastructure grants , fundable as distributed intelligence, not another central biobank replay. Apple\u2019s on-device health playbook applied to chronotherapy.',
    cta: { label: 'Science & trust', href: CHRONOBIOBANK_SCIENCE_HREF },
  },
] as const

