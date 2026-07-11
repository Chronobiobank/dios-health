/** Deepdose marketing landing — same section model as dios.health CloqLanding */

export const LANDING_NAV = {
  links: [
    { label: 'Mechanism', href: '#mechanism' },
    { label: 'Product', href: '#product' },
    { label: 'Proof', href: '#proof' },
  ],
  cta: { label: 'Sign in', href: '/' },
} as const

export const LANDING_FOOTER = {
  descriptor: 'Precision chronotherapy · Patient-owned chronobiobank',
  copyrightYear: 2026,
  brandName: 'Deepdose · DIOS Health',
  linkColumns: [
    {
      title: 'Explore',
      links: [
        { label: 'Mechanism', href: '/#mechanism' },
        { label: 'Product', href: '/#product' },
        { label: 'Proof', href: '/#proof' },
        { label: 'Sign in', href: '/' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'Why Medmaxxing?', href: '/how' },
        { label: 'Patient onboarding', href: '/' },
        { label: 'Dosage', href: '/dosage' },
      ],
    },
  ],
} as const

export const LANDING_HERO = {
  id: 'hero',
  eyebrow: 'Precision chronotherapy',
  headlineHtml: 'Your medications miss the <em>biological window</em>',
  support:
    'Fixed pill times ignore circadian phase. Deepdose maps each dose to your DLMO, chronotype, and evidence-graded timing windows.',
  cta: { label: 'Start onboarding', href: '/' },
} as const

export const LANDING_MECHANISM = {
  id: 'mechanism',
  eyebrow: 'The mechanism',
  headlineHtml: 'Clock time is not <em>biological time</em>',
  support:
    'DLMO sets when drugs peak in your system. Standard apps remind you at 8am. Chronotherapy adjusts for your phase.',
  stats: [
    { value: '8', label: 'BNF-aligned medications' },
    { value: '100', label: 'CHI points' },
    { value: 'MCTQ', label: 'Chronotype assessment' },
    { value: '4', label: 'Consent purposes' },
  ],
} as const

export const LANDING_PRODUCT = {
  id: 'product',
  eyebrow: 'Meet Deepdose',
  headlineHtml: 'Personalised dosing in <em>three steps</em>',
  support:
    'Patient-owned consent, validated sleep rhythm mapping, and phase-adjusted medication windows — built for UK clinical care.',
  steps: [
    {
      symbol: '◌',
      title: 'Consent',
      body: 'Dynamic GDPR framework — you control care, research, and analytics use.',
    },
    {
      symbol: '◎',
      title: 'Rhythm',
      body: 'MCTQ chronotype profile estimates DLMO and circadian alignment score.',
    },
    {
      symbol: '◆',
      title: 'Dosing',
      body: 'Eight chronotherapy medications with phase-adjusted recommended windows.',
    },
  ],
} as const

export const LANDING_PROOF = {
  id: 'proof',
  eyebrow: 'The proof',
  headlineHtml: 'Evidence-graded <em>timing windows</em>',
  support:
    'Chronopharmacology trials show outcome differences by time of day. Deepdose operationalises that evidence per patient.',
  peak: {
    title: 'Hygia chronotherapy trial',
    stat: 'Bedtime dosing superior for cardiovascular outcomes vs morning dosing.',
  },
  results: {
    total: 'Grade A',
    sub: 'Evidence-backed timing for core antihypertensive and statin protocols.',
  },
  recovery: [
    { label: 'Medications', value: '8' },
    { label: 'Phase offset', value: '±min' },
    { label: 'Window', value: '24h' },
  ],
  citations: [
    {
      source: 'Hermida et al. · EHJ 2020',
      quote: 'Bedtime dosing of antihypertensives reduced cardiovascular risk vs morning dosing.',
    },
    {
      source: 'Roenneberg · MCTQ',
      quote: 'Social jet lag quantifies misalignment between biological and social time.',
    },
    {
      source: 'BNF · Chronotherapy',
      quote: 'Timing affects efficacy for statins, ACE inhibitors, and corticosteroids.',
    },
  ],
  methodology: 'Evidence grades A/B/C per medication · Not a substitute for clinical advice.',
  cta: { label: 'View your windows', href: '/' },
} as const

export const LANDING_CLOSE = {
  id: 'close',
  eyebrow: 'Patient-owned chronobiobank',
  headlineHtml: 'Your rhythm. <em>Your data.</em>',
  support:
    'Deepdose is the dosing layer of the DIOS platform — you declare your meds and supps first, then everything else follows.',
  sectors: [
    { title: 'Patients', body: 'See when each medication works best for your body — not a generic alarm.' },
    { title: 'Clinicians', body: 'Triage-aligned windows, device sync alerts, and premium-tier verification.' },
    { title: 'Researchers', body: 'Pseudonymised chronobiobank access under explicit patient licence.' },
  ],
  programme: [
    { label: 'Onboarding', value: 'Meds & supps → Consent → Rhythm' },
    { label: 'Data', value: 'Oura · Whoop · Apple Health' },
    { label: 'Compliance', value: 'UK GDPR · RLS enforced' },
    { label: 'Entry', value: 'Sign in to begin' },
  ],
  cta: { label: 'Start onboarding', href: '/' },
} as const
