/** Clinician acquisition landing — mobile-first narrative (BTI / spectrum / moat). */

export const CLINICIANS_LANDING_META = {
  title: 'For clinicians — DIOS Dose Intelligence OS',
  description:
    'Biological time, not clock time. Cohort triage, Chronomedicine Spectrum sequencing, and Chronobiobank outcomes indexed by BTI.',
} as const

export const CLINICIANS_HERO = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Every drug was developed for clock time.',
  headlineEmphasis: 'Your patients run on biological time.',
  subheadline:
    'DIOS measures each patient’s Biological Time Index, maps every drug and micronutrient on the Chronomedicine Spectrum, and tells you who needs attention this week.',
  primaryCta: { label: 'Enrol your cohort', href: 'mailto:grant@dios.health' },
  secondaryCta: { label: 'See triage demo', href: '/clinic' },
} as const

export const CLINICIANS_GAP = {
  eyebrow: 'The problem',
  headline: 'Clock time on the label. Biology on another clock entirely.',
  before: {
    label: 'What medicine does today',
    body: 'Take your statin at 8pm. Take D3 in the morning. Take your antidepressant with breakfast.',
  },
  after: {
    label: 'What DIOS does',
    body: 'BTI estimates your patient’s phase. Each drug gets a biological-time window — updated when sleep, light, or labs shift the clock.',
  },
} as const

export const CLINICIANS_STEPS = {
  eyebrow: 'How it works',
  headline: 'Measure. Align. Track.',
  steps: [
    {
      num: '01',
      name: 'Measure biological time',
      desc: '60-second First Light scan. TipTraQ when linked. Labs when due. Three layers triangulate the Biological Time Index.',
      mono: 'BTI — clock position + confidence tier',
    },
    {
      num: '02',
      name: 'Align the Chronomedicine Spectrum',
      desc: 'Architects, sensitisers, modulators, opportunists, restorers — every substance in the protocol plotted on BTI with conflict detection.',
      mono: 'Window open — sequence surfaced',
    },
    {
      num: '03',
      name: 'Track Chronopathic Age',
      desc: 'PTH trajectory for supervised protocols. Sleep and inflammatory markers for all patients. One outcome line — is biological time moving the right way?',
      mono: 'Clinician and patient see the same signal',
    },
  ],
} as const

export const CLINICIANS_USERS = {
  eyebrow: 'Two jobs. Two surfaces.',
  headline: 'Built for you. Simple for them.',
  clinician: {
    who: 'Clinician',
    cvp: 'Who needs attention this week?',
    points: [
      'Cohort triage — red, amber, green by protocol risk',
      'PTH trajectory and calcium cascade gates',
      'Titration lock until you review',
      'Next lab due — automated',
      'Chronobiobank depth per patient',
    ],
  },
  patient: {
    who: 'Patient',
    cvp: 'Take it now. Your window is open.',
    points: [
      'One notification at the right biological moment',
      'Voice coach — plain English, three sentences',
      'Lab reminder when the panel is due',
      'Chronopathic Age — one progress number',
      'No jargon required',
    ],
  },
} as const

export const CLINICIANS_MOAT = {
  eyebrow: 'Why no one else can do this',
  headline: 'The Chronobiobank — indexed by biological time from day one.',
  sub: 'Every competitor has members. None has circadian-indexed, protocol-specific outcomes.',
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
      gap: 'No protocol OS, no longitudinal bank, no practitioner triage.',
    },
  ],
  verdict:
    'Retrofitting biological time onto clock-time records is architecturally non-viable. DIOS indexes every outcome by BTI and wall-clock together — and that dual index compounds with every patient-month.',
} as const

export const CLINICIANS_EVIDENCE = {
  eyebrow: 'The science is settled',
  headline: 'Thirty years of evidence. No clinical OS — until now.',
  cards: [
    {
      source: 'Hermida · Hygia Trial · n=19,084',
      finding: 'Bedtime antihypertensive dosing reduced cardiovascular events versus morning dosing — same drug, different biological window.',
    },
    {
      source: 'UK Biobank · melanopic light cohorts',
      finding: 'Light patterns independently predict metabolic, cardiovascular, and psychiatric risk — the input DIOS measures daily.',
    },
    {
      source: 'Pigazzani · TIME chronotype sub-study',
      finding: 'Individual chronotype modulates drug response — population-average timing is insufficient.',
    },
    {
      source: 'Coimbra supervised cohort · n=319',
      finding: 'High-dose D3 protocols with monitoring — evidence that toxicity narratives ignore supervised longitudinal data.',
    },
  ],
} as const

export const CLINICIANS_CTA = {
  headline: 'Close the loop your protocol leaves open.',
  sub: 'Coimbra, Gominak, and chronotherapy practitioners — enrol your first cohort. Free for patients at entry.',
  primary: { label: 'Enrol your cohort', href: 'mailto:grant@dios.health' },
  secondary: { label: 'Clinician dashboard', href: '/clinic' },
} as const

export const CHRONOMEDICINE_CLUSTERS = [
  { id: 'architect', label: 'Architects', examples: 'D3, melatonin, B5 — they set the clock' },
  { id: 'sensitiser', label: 'Sensitisers', examples: 'Statins, BP meds, metformin — efficacy gated by BTI' },
  { id: 'modulator', label: 'Modulators', examples: 'SSRIs, steroids — bidirectional clock effect' },
  { id: 'opportunist', label: 'Opportunists', examples: 'Chemotherapy — narrow window opens and closes' },
  { id: 'restorer', label: 'Restorers', examples: 'First Light, chronobiotics — repair the clock' },
] as const
