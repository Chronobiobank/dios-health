import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** `/learn` is not a route — curriculum links use science */
export const MARKETING_LEARN_ROUTE = MARKETING_ROUTES.learn

export const MARKETING_LANDING_META = {
  title: 'DIOS — Make Time Count',
  description:
    'DIOS — The Home of Chronoimmunology. The clinical platform that closes the 90-day visibility gap in immunotherapy.',
  openGraphTitle: 'DIOS — Make Time Count',
  openGraphDescription:
    'The clinical platform that closes the 90-day visibility gap in immunotherapy.',
} as const

export const MARKETING_HERO = {
  eyebrow: 'Chronoimmunology platform',
  titleLine1: 'Make Time',
  titleEmphasis: 'Count.',
  sub: "Your patient's immune system has a clock. Most protocols don't.",
  statements: [
    {
      num: '01',
      html: 'Vitamin D is not a vitamin.<br><em>It is a steroid hormone.</em>',
    },
    {
      num: '02',
      html: 'The 90-day visibility gap<br><em>is now closed.</em>',
    },
  ],
  ctas: {
    primary: { label: 'Enrol your first patient →', href: MARKETING_ROUTES.onboarding },
    secondary: { label: 'Learn the Soltriol curriculum', href: MARKETING_LEARN_ROUTE },
    tertiary: { label: 'I am a patient — get DINA ↗', href: MARKETING_ROUTES.dina },
  },
} as const

export const MARKETING_PULL_QUOTE = {
  textHtml: "The time is the medicine your patients <em>aren't getting.</em>",
  attr: 'DIOS · Chronoimmunology platform · dios.health',
} as const

export const MARKETING_BEATS = [
  {
    num: '01',
    headHtml: 'Vitamin D is not a vitamin.',
    textHtml:
      '1,25-dihydroxyvitamin D3 — Soltriol — binds nuclear VDR receptors and regulates over 200 genes including the entire Th17 immune tolerance pathway. Your patients with MS, Hashimoto\'s, rheumatoid arthritis, and lupus are on a protocol that depends on this hormone working precisely. The curriculum you trained under did not teach you this. <strong>The science has moved on.</strong>',
  },
  {
    num: '02',
    headHtml: 'You are flying blind for <em>87 days out of every 90.</em>',
    textHtml:
      'You adjust the dose. You wait for the next blood panel. You hope the protocol is working. Your patient may be taking Soltriol at the wrong time. The cofactors may be inconsistent. The pRGC system may be failing to respond. <strong>None of this is visible until the next blood draw.</strong>',
  },
  {
    num: '03',
    headHtml: 'Sleep architecture is your <em>missing biomarker.</em>',
    textHtml:
      'When Soltriol activates the pRGC system correctly, sleep efficiency exceeds 85% and REM latency falls below 90 minutes. These changes appear weeks before PTH moves on a blood panel. <strong>Your patient\'s sleep is telling you whether the protocol is working.</strong> You have not had a way to hear it. Until now.',
  },
  {
    num: '04',
    headHtml: 'DIOS closes the gap.<br>DINA tells your patient what to do.',
    textHtml:
      'DIOS is your clinical dashboard. TipTraQ measures three nights of sleep architecture every six months. Quarterly blood panels. Daily dose timing confirmed by DINA — the patient agent built into the platform. <strong>Four data cadences. One complete picture of immune response.</strong> Updated continuously. Available before your patient walks through the door.',
  },
  {
    num: '05',
    headHtml: 'Free for patients.<br><em>Evidence-generating for the field.</em>',
    textHtml:
      'Every patient on DIOS contributes de-identified data to the Chronobiobank — the only longitudinal dataset linking Soltriol timing, sleep architecture, and immune markers in a single research instrument. You are not just improving your patient\'s protocol. <strong>You are building the evidence base that will change how the NHS prescribes this hormone.</strong>',
  },
] as const

export const MARKETING_THREE_QUESTIONS = {
  eyebrow: 'Three questions. Answered every day.',
  items: [
    { num: '01', html: 'Did your patient take it at the <em>right time?</em>' },
    { num: '02', html: 'Is their body <em>responding?</em>' },
    { num: '03', html: 'Do <em>you</em> know?' },
  ],
} as const

export const MARKETING_FOR_SECTION = {
  head: 'Built for three kinds of clinician.',
  cards: [
    {
      type: 'Protocol practitioners',
      title:
        'You already use Coimbra or Gominak. DIOS gives you the infrastructure your protocol has never had.',
      text: 'The four-cadence data model. The safety gates. TipTraQ sleep architecture as a real-time immune proxy. The DINA patient agent. All of it built around the protocol you already understand.',
      link: { label: 'See the clinical platform →', href: MARKETING_ROUTES.clinicians },
    },
    {
      type: 'Integrative GPs',
      title:
        'You suspect Vitamin D is more important than the curriculum suggested. DIOS will show you why.',
      text: 'Start with one patient. Eight weeks of data. See what the sleep architecture tells you about whether your protocol is working — before the next blood panel confirms it.',
      link: { label: 'Start with one patient →', href: MARKETING_LEARN_ROUTE },
    },
    {
      type: 'Registrars & students',
      title:
        'Learn Chronoimmunology before it becomes mainstream. Thirteen CPD modules. RCGP accredited.',
      text: 'From the VDR receptor system to clinical protocol management. The Soltriol curriculum starts with why Vitamin D is a hormone and ends with how to monitor it in practice.',
      link: { label: 'Begin the curriculum →', href: MARKETING_LEARN_ROUTE },
    },
  ],
} as const

export const MARKETING_MODEL = {
  headHtml: 'Three tiers of <em>biological clock measurement.</em>',
  sub: 'Every patient starts at L3. DINA prompts the upgrade path as confidence builds.',
  tiers: [
    {
      level: 'l1' as const,
      label: 'L1 · Gold standard',
      name: 'TipTraQ sleep sensor',
      desc: 'Three-night read every six months. DLMO proxy, sleep efficiency, REM latency, AHI, WASO. Exclusively available in the UK through DIOS.',
      conf: '90% DLMO confidence · ±18 min precision',
    },
    {
      level: 'l2' as const,
      label: 'L2 · Clinical inference',
      name: 'Gominak blood panel',
      desc: 'PTH, 25-OH Vitamin D, B12, ferritin, serum calcium. Requestable by any UK GP. The Coimbra safety gate and VDR activation marker.',
      conf: '65% DLMO confidence · ±60 min precision',
    },
    {
      level: 'l3' as const,
      label: 'L3 · Entry point',
      name: 'Smartphone camera proxy',
      desc: 'Ambient light logged at wake and sleep. Provisional DLMO estimate. Free. Available to all patients immediately. Explicitly provisional.',
      conf: '40% DLMO confidence · ±90 min precision',
    },
  ],
} as const

export const MARKETING_CTA_BAND = {
  headHtml: 'Start with <em>one patient.</em>',
  sub: 'Not a demo. Not a procurement process. Enrol one patient on one protocol. Eight weeks of data. Decide from there.',
  divider: 'DIOS · The Home of Chronoimmunology · dios.health',
  ctas: {
    primary: { label: 'Enrol your first patient →', href: MARKETING_ROUTES.onboarding },
    secondary: { label: 'Learn the Soltriol curriculum', href: MARKETING_LEARN_ROUTE },
  },
} as const
