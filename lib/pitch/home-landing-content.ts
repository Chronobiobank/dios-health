/** Clinician-first home landing — high-dose D practitioners, US + Commonwealth public health. */

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOME_LANDING_META = {
  title: 'DIOS — Cohort intelligence for high-dose D practice',
  description:
    'Supervised vitamin D3 titration needs biological timing, PTH surveillance, and calcium gates. DIOS triages your cohort before labs slip or doses escalate.',
  openGraphTitle: 'DIOS — Cohort intelligence for high-dose D practice',
  openGraphDescription:
    'For Coimbra- and Gominak-class practitioners across the US and Commonwealth health systems — red, amber, green triage from day one.',
} as const

export const HOME_HERO = {
  eyebrow: 'For high-dose D practitioners',
  tagline: ['Triage the cohort.', 'Before PTH slips.'] as const,
  subline:
    'Supervised D3 practice runs on biological time — not wall-clock reminders. DIOS gives US integrative clinics and Commonwealth PCNs the same Monday-morning view: who needs review, who is on track, and which safety gates are open.',
  video: '/optimise-your-script.mp4',
  poster: '/your-light-dose.jpg',
  primaryCta: { label: 'See cohort triage demo', href: MARKETING_ROUTES.cliniciansTriage },
  secondaryCta: { label: 'Enrol your practice', href: '/signup/clinician' },
} as const

export const HOME_PROBLEM = {
  eyebrow: 'The practice problem',
  headline: ['High-dose D3 works.', 'Your ops stack does not.'] as const,
  emphasisLine: 1,
  lede:
    'Coimbra- and Gominak-class protocols demand PTH lower-third tracking, calcium cascade review, morning light gates, and timing that shifts when sleep or labs move. Most practices still run this on spreadsheets, portal messages, and memory.',
  primaryCta: { label: 'See how triage works', href: MARKETING_ROUTES.cliniciansTriage },
  evidenceCta: { label: 'Clinical evidence', href: MARKETING_ROUTES.evidence },
} as const

export const HOME_INSIGHT = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Biological time',
  headlineEmphasis: 'indexed at every dose and lab draw.',
  statement:
    'DIOS reads MLux phase, TipTraQ nights, and City Labs panels — then maps every high-dose D3 titration step to today’s body clock. Patients get DINA timing guidance. You get red–amber–green cohort triage with safety gates that lock escalation until you review.',
  ctaLabel: 'See the circadian model',
  ctaHref: '/circadian-digital-twin',
} as const

export const HOME_MARKETS = {
  eyebrow: 'Built for your market',
  headline: 'US private practice. Commonwealth public health.',
  lanes: [
    {
      id: 'us',
      label: 'United States',
      line: 'Integrative & functional medicine practices running supervised high-dose D3.',
      bullets: [
        'PTH + 25(OH)D + calcium cascade on one timeline',
        'Morning MLux gate before dose escalation',
        'FDA-cleared TipTraQ nights where premium tier is enabled',
      ],
    },
    {
      id: 'commonwealth',
      label: 'Commonwealth health',
      line: 'ICS, trust, and PCN evaluation cohorts — governance-first deployment.',
      bullets: [
        'UK GDPR · clinician review before dose changes',
        'ICS / PCN pilot pack via clinical briefing',
        'Async patient measure → practitioner triage pathway',
      ],
    },
  ],
  cta: { label: 'Request ICS / PCN briefing', href: '/contact?intent=ics-pilot' },
} as const

export const HOME_CASE_STUDY = {
  eyebrow: 'Case study',
  headline: 'Summit Immune & Light Medicine',
  subhead: '38 patients · Coimbra-class D3 · Denver US + NHS PCN evaluation arm',
  lede:
    'Before DIOS, the practice tracked PTH in shared spreadsheets and caught calcium risk on ad-hoc portal threads. Monday review took ninety minutes and still missed phase drift.',
  metrics: [
    { label: 'Needs review', value: '3', tone: 'red' as const },
    { label: 'Watch', value: '4', tone: 'amber' as const },
    { label: 'On track', value: '31', tone: 'green' as const },
  ],
  spotlight: {
    patient: 'Elena R.',
    ref: 'RED-001',
    issue: 'PTH 6 pg/mL · calcium cascade WARNING',
    withoutDios:
      'Default workflow: increase D3 dose. Risk: hypercalcaemia pathway with no morning scan compliance data.',
    withDios:
      'Triage locked titration. DINA paused evening D3. Clinician review flagged before next escalation. PTH floor alert surfaced on Monday queue — not at quarterly labs.',
    outcome: 'Dose held. Calcium cascade cleared in 11 days. No ED presentation.',
  },
  onTrack: {
    patient: 'Sean James',
    ref: 'SEAN-001',
    line: 'Zone 2 psoriasis / early insulin resistance — 22k IU/day, PTH trending to lower third, First Light streak 12 days. No action required.',
  },
  quote: {
    attribution: 'Dr. Amara Okonkwo · Medical director',
    text: 'I open DIOS on Monday morning and know which three patients need me before coffee. The PTH chart is no longer a forensic exercise.',
  },
  cta: { label: 'Open the triage demo', href: MARKETING_ROUTES.cliniciansTriage },
  chronobiobankCta: { label: 'Chronobiobank governance', href: MARKETING_ROUTES.chronobiobank },
} as const

export const HOME_AUDIENCE = {
  eyebrow: 'One platform',
  headline: ['You triage.', 'They stay on time.'] as const,
  clinician: {
    who: 'For practitioners',
    line: 'Red · amber · green — who needs you this week',
    href: MARKETING_ROUTES.cliniciansTriage,
  },
  patient: {
    who: 'For patients',
    line: 'DINA — plain-English timing for their stack',
    href: MARKETING_ROUTES.dina,
  },
} as const

export const HOME_STEPS = {
  eyebrow: 'How it works',
  headline: 'Scan. Time. Triage.',
  steps: [
    {
      n: '01',
      line: 'First Light scan + optional TipTraQ — biological phase and confidence tier.',
    },
    {
      n: '02',
      line: 'High-dose D3, cofactors, and concomitant meds mapped to today’s windows — not label defaults.',
    },
    {
      n: '03',
      line: 'Cohort board: PTH trajectory, calcium gates, adherence — you review flagged patients first.',
    },
  ],
  walkthroughCta: { label: 'Full clinician walkthrough', href: MARKETING_ROUTES.clinicians },
  demoCta: { label: 'Patient DINA demo', href: MARKETING_ROUTES.dina },
} as const

export const HOME_GOVERNANCE_LINE =
  'Clinician review before dose changes · UK GDPR & Commonwealth IG packs · US HIPAA-aligned deployment path · FDA-cleared TipTraQ where stated · Evaluation cohorts open to PCNs and integrative practices' as const

export const HOME_CLINICAL_DISCLAIMER =
  'Clinical decision support only. Does not replace your prescribing judgement. Patients use DINA for timing education — you retain escalation authority.' as const

export const HOME_PROOF = {
  headline: ['The science', 'your patients already cite.'] as const,
  ctaLabel: 'Full evidence library',
  ctaHref: MARKETING_ROUTES.science,
  soundbites: [
    'PTH lower-third — primary endpoint in supervised high-dose D3 series.',
    'VDR activation is circadian — morning light gates safe titration.',
    'UK Biobank light rhythms predict metabolic and cardiovascular risk.',
    'Bedtime antihypertensives — 45% fewer events. Timing changes outcomes.',
  ] as const,
  cards: [
    {
      ref: 'Coimbra et al. — CNS Drugs · autoimmune series',
      finding: 'High-dose vitamin D3 protocols require structured PTH and calcium surveillance — timing and cofactors change response.',
      emphasis: 'PTH',
      doi: 'https://pubmed.ncbi.nlm.nih.gov/24804229/',
    },
    {
      ref: 'Gominak — RightSleep · vitamin D and sleep architecture',
      finding: 'Vitamin D and B-vitamin repletion restores sleep-state switching when photic timing is corrected.',
      emphasis: 'sleep-state switching',
      doi: 'https://pubmed.ncbi.nlm.nih.gov/27164492/',
    },
    {
      ref: 'UK Biobank — n≈89,000',
      finding: 'Personal light–dark rhythm predicts type 2 diabetes, cardiovascular risk, and mortality.',
      emphasis: '89,000',
      doi: 'https://doi.org/10.1073/pnas.2405924121',
    },
    {
      ref: 'Hermida et al. — Hygia · n=19,084',
      finding: 'Bedtime antihypertensives cut cardiovascular events by 45% — same drug, biological window.',
      emphasis: '45%',
      doi: 'https://doi.org/10.1093/eurheartj/ehz754',
    },
  ],
} as const

export const HOME_CTA_MEDIA = {
  video: '/first-light.mp4',
  poster: '/your-light-dose.jpg',
} as const

export const HOME_CTA = {
  headline: 'Enrol your cohort.',
  clinician: {
    who: 'Practitioner',
    line: 'Start with the triage demo',
    detail: 'US practice · NHS PCN pilot · integrative clinic',
    href: MARKETING_ROUTES.cliniciansTriage,
  },
  patient: {
    who: 'Patient',
    line: 'Meet DINA',
    detail: 'Timing companion — invited by your clinic',
    href: MARKETING_ROUTES.dina,
  },
  briefing: {
    label: 'Commonwealth ICS briefing',
    href: '/contact?intent=clinical-briefing',
  },
} as const
