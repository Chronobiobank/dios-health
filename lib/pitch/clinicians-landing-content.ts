/** Clinician acquisition — Precision Immunology / Make Time Count. */

import {
  PRGC_CADENCE_LINE,
  TIPTRAQ_CALIBRATION,
  TIPTRAQ_POSITIONING,
} from '@/lib/product/intelligence-cadence'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CLINICIANS_LANDING_META = {
  title: 'For clinicians — DIOS',
  description:
    'Map each patient’s meds to their body clock. See who needs attention this week.',
} as const

export const CLINICIANS_HERO = {
  eyebrow: 'For clinicians',
  headline: 'Same script.',
  headlineEmphasis: 'Wrong time for most patients.',
  subheadline:
    'DIOS maps each patient’s meds to their body clock and shows who needs attention this week — before outcomes slip.',
  primaryCta: { label: 'Enrol your cohort', href: MARKETING_ROUTES.signupClinician },
  secondaryCta: { label: 'See triage demo', href: MARKETING_ROUTES.cliniciansTriage },
} as const

export const CLINICIANS_GAP = {
  eyebrow: 'The problem',
  headline: 'Clock time on the label. Biology on another clock entirely.',
  before: {
    label: 'What medicine does today',
    body: 'Take your statin at 8pm. Take metformin with breakfast. One schedule on every label — built for population averages, not your patient’s phase.',
  },
  after: {
    label: 'What DIOS does',
    body: 'Monthly phone light scans maintain your estimate between TipTraQ blocks. Each medicine gets a personal time — reset every six months when TipTraQ runs, adjusted when bloods or light shift your clock.',
  },
} as const

export const CLINICIANS_TIPTRAQ_VD3 = {
  eyebrow: 'For Coimbra and Gominak practitioners',
  headline: 'TipTraQ sets the clock. DINA proves adherence.',
  body: `${TIPTRAQ_POSITIONING} ${TIPTRAQ_CALIBRATION.summary} PTH every 90 days confirms biological response. Daily DINA dose confirmations show whether patients hit the windows that last TipTraQ block defined.`,
  metrics: [
    'Sleep efficiency — from last TipTraQ block, target above 85%',
    'REM latency — under 90 minutes when D3 and cofactors are working',
    'PTH — suppressed below 20 pg/mL on 90-day draw',
    'D3 timing — daily DINA confirmations in morning window',
  ],
} as const

export const CLINICIANS_STEPS = {
  eyebrow: 'How it works',
  headline: 'Scan. Time. Triage.',
  steps: [
    {
      num: '01',
      name: 'Scan the body clock',
      desc: 'Monthly MLux camera proxy. TipTraQ three nights every six months. PTH every 90 days from bloods.',
      mono: 'Four numbers — one clinical question',
    },
    {
      num: '02',
      name: 'Time the protocol',
      desc: 'Every med and supplement mapped to today’s biological window — not wall-clock defaults.',
      mono: 'Window open — take it now',
    },
    {
      num: '03',
      name: 'Triage the cohort',
      desc: 'Red, amber, green by adherence, safety gates, and trajectory. You review flagged patients first.',
      mono: 'Who needs attention this week',
    },
  ],
} as const

export const CLINICIANS_USERS = {
  eyebrow: 'Two jobs. Two surfaces.',
  headline: 'Built for you. Simple for them.',
  clinician: {
    who: 'Clinician',
    cvp: 'Is the pRGC system working?',
    points: [
      'Four numbers per patient — sleep, REM latency, PTH, D3 timing',
      PRGC_CADENCE_LINE,
      'Clinical read when sleep and PTH disagree or agree',
      'DINA timing education — not dose escalation by default',
      'Exportable summary for the EHR',
    ],
  },
  patient: {
    who: 'Patient',
    cvp: 'Take it now. Your window is open.',
    points: [
      'One notification at the right biological moment',
      'DINA — plain English, three sentences',
      'Today’s med and supplement timing guidance',
      'Progress tracked with exploratory metrics',
      'Share profile with GP or pharmacist',
    ],
  },
} as const

export const CLINICIANS_MOAT = {
  eyebrow: 'Why no one else can do this',
  headline: 'Timing outcomes indexed by biology — from day one.',
  sub: 'Adherence apps log clock time. DIOS logs biological time at dose — and that dual index cannot be retrofitted.',
  competitors: [
    {
      name: 'Medisafe',
      stat: '13M users',
      what: 'Billions of dose logs indexed by clock time — adherence taps, not biology.',
      gap: 'Biological phase at dose time was never collected. Cannot be reconstructed.',
    },
    {
      name: 'Huma',
      stat: '35M screened',
      what: 'Disease monitoring at scale — vitals and wearables without circadian phase.',
      gap: 'They know a patient deteriorated. Not whether timing caused it.',
    },
    {
      name: 'TimeTeller',
      stat: 'Saliva phenotyping',
      what: 'Strong circadian profiling — report in hand, then nothing.',
      gap: 'No dose-timing OS, no longitudinal bank, no practitioner triage.',
    },
  ],
  verdict:
    'Retrofitting biological time onto clock-time records is architecturally non-viable. DIOS indexes every dose event by body clock and wall clock together — and that compounds with every patient-month in the Chronobiobank.',
} as const

export const CLINICIANS_EVIDENCE = {
  eyebrow: 'The science is published',
  headline: 'Same drug. Different moment. Outcomes change.',
  cards: [
    {
      source: 'Hermida · Hygia Trial · n=19,084',
      finding:
        'Bedtime antihypertensive dosing reduced cardiovascular events versus morning dosing — same drug, different biological window.',
    },
    {
      source: 'Levi · The Lancet · n=186',
      finding: 'Timed chemotherapy cut toxicity fivefold. Response nearly doubled.',
    },
    {
      source: 'Pigazzani · TIME chronotype sub-study',
      finding: 'Individual chronotype modulates drug response — population-average timing is insufficient.',
    },
    {
      source: 'UK Biobank · melanopic light cohorts',
      finding:
        'Light–dark patterns predict cardiovascular and metabolic risk — the daily signal DIOS measures before timing guidance.',
    },
  ],
} as const

export const CLINICIANS_CTA = {
  headline: 'Optimise scripts across your cohort.',
  sub: 'Primary care, pharmacy, and specialist practices — free patient entry, clinician triage from day one.',
  primary: { label: 'Enrol your cohort', href: MARKETING_ROUTES.signupClinician },
  secondary: { label: 'See triage demo', href: MARKETING_ROUTES.cliniciansTriage },
} as const

/** Live product mockups — clinician, patient, and evidence surfaces */
export const CLINICIANS_PRODUCT_DEMOS = {
  eyebrow: 'See it working',
  headline: 'Three surfaces. One platform.',
  items: [
    {
      label: 'Triage demo',
      detail: 'Cohort queue plus pRGC drill-down — who needs attention, then four columns that explain why.',
      href: MARKETING_ROUTES.cliniciansTriage,
    },
    {
      label: 'DINA companion',
      detail: 'Morning sequencing, caught conflicts, missed-dose nuance — ask DINA yourself.',
      href: MARKETING_ROUTES.dina,
    },
    {
      label: 'Circadian model',
      detail: 'Timing matrix plus published trial evidence — Hygia, Lévi, Biobank, TIME.',
      href: '/circadian-digital-twin',
    },
  ],
} as const

/** How common drug classes relate to biological time — clinician skim only */
export const CHRONOMEDICINE_CLUSTERS = [
  { id: 'architect', label: 'Clock setters', examples: 'Melatonin, light exposure — anchor phase first' },
  { id: 'sensitiser', label: 'Window-sensitive', examples: 'Statins, BP meds, metformin — efficacy gated by phase' },
  { id: 'modulator', label: 'Bidirectional', examples: 'SSRIs, steroids — drug and clock affect each other' },
  { id: 'opportunist', label: 'Narrow window', examples: 'Chemotherapy — window opens and closes fast' },
  { id: 'restorer', label: 'Rhythm repair', examples: 'Morning scan, chronobiotics — restore amplitude' },
] as const
