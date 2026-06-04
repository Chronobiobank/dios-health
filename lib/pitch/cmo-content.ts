/** CMO / NHS system leader narrative — copy, citations, image keys */

import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

export type PitchCmoCitation = {
  label: string
  href: string
}

export type PitchCmoOutcome = {
  id: string
  headline: string
  line: string
  image: string
  imageAlt: string
  href: string
  cite: string
}

/** 1 — NHS outcomes hook (beyond medicines waste) */
export const PITCH_NHS_OUTCOMES_INTRO = {
  eyebrow: 'System outcomes',
  title: 'Timing supports medicines optimisation, prevention, and patient safety.',
  subtitle:
    'DIOS links chronobiology evidence to NHS-owned decisions: cardiovascular risk, metabolic risk, and safer medicines use.',
} as const

export const PITCH_NHS_OUTCOMES: readonly PitchCmoOutcome[] = [
  {
    id: 'waste',
    headline: 'Medicines waste & optimisation',
    line: 'Avoidable waste is a national issue; standardising “when” complements adherence and medication review.',
    image: PITCH_IMAGES.outcomes.waste,
    imageAlt: 'Unused prescription medicines',
    href: 'https://www.england.nhs.uk/wp-content/uploads/2015/06/pharmaceutical-waste-reduction.pdf',
    cite: 'NHS England · Waste reduction',
  },
  {
    id: 'cvd',
    headline: 'Cardiovascular prevention',
    line: 'Dose timing may change outcomes for some patients — alongside drug choice and dose, not instead of them.',
    image: PITCH_IMAGES.outcomes.cardiovascular,
    imageAlt: 'Bedtime antihypertensive medication',
    href: 'https://doi.org/10.1093/eurheartj/ehz754',
    cite: 'EHJ · Hygia',
  },
  {
    id: 'diabetes',
    headline: 'Type 2 diabetes & metabolic risk',
    line: 'Light–dark rhythm is associated with metabolic risk at population scale — a timing signal you can measure.',
    image: PITCH_IMAGES.outcomes.metabolic,
    imageAlt: 'Light exposure and metabolic health',
    href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00110-8/fulltext',
    cite: 'Lancet 2024',
  },
  {
    id: 'med-safety',
    headline: 'Medicines safety',
    line: 'Medication errors are a national patient safety priority; clearer timing reduces variation and confusion.',
    image: PITCH_IMAGES.outcomes.safety,
    imageAlt: 'Primary care medicines safety',
    href: 'https://doi.org/10.1136/bmjqs-2019-010206',
    cite: 'BMJ Quality & Safety · Elliott',
  },
] as const

/** 2 — For NHS leaders */
export const PITCH_NHS_LEADERS = {
  eyebrow: 'NHS pilot pathway',
  title: 'Pilot-ready pathway without re-platforming NHS systems.',
  subtitle:
    'Patient-led measurement, clinician review, and exportable outputs designed to sit alongside existing prescribing and prevention programmes.',
  heroImage: PITCH_IMAGES.sides.NHS,
  heroAlt: 'NHS hospital and community care setting',
  pathway: [
    {
      step: '01',
      title: 'Patient initiates (async)',
      body: '60-second session on phone to estimate a timing signal (melanopic lux / rhythm). No wearable required.',
      image: PITCH_IMAGES.steps.mel,
      imageAlt: 'DIOS Coach session',
    },
    {
      step: '02',
      title: 'Clinician reviews (in the loop)',
      body: 'Dashboard shows spectrum + confidence. Export supports shared decision-making and documentation.',
      image: PITCH_IMAGES.sides.Clinicians,
      imageAlt: 'Clinician dashboard review',
    },
    {
      step: '03',
      title: 'Optional population learning',
      body: 'Chronobiobank is optional, governed and revocable — separating care from research by consent.',
      image: PITCH_IMAGES.model,
      imageAlt: 'Chronobiobank governance',
    },
  ],
  pilotOffer: {
    line: 'ICS or PCN pilots include a 20-minute clinical briefing, governance overview, DPIA starter pack, and evaluation template.',
    href: '/contact?intent=ics-pilot',
    label: 'Request an ICS/PCN pilot discussion →',
  },
  pilotPack: {
    eyebrow: 'Pilot pack (what you get)',
    bullets: [
      'Clinical briefing deck (pathway + responsibility)',
      'IG summary + DPIA starter template',
      'Evaluation template (outcomes + safety monitoring)',
      'Implementation plan for a limited pilot cohort',
    ],
  },
  links: [
    {
      label: 'NHS medicines optimisation',
      href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
    },
    {
      label: 'Structured medication reviews (PCN pharmacists)',
      href: 'https://www.england.nhs.uk/publication/network-contract-directed-enhanced-service/',
    },
    {
      label: 'NHS cardiovascular disease prevention',
      href: 'https://www.england.nhs.uk/ourwork/clinical-policy/cvd/',
    },
  ] as const satisfies readonly PitchCmoCitation[],
} as const

export type PitchGovernanceItem = {
  id: string
  title: string
  body: string
  href: string
  label: string
  image: string
  imageAlt: string
  external?: boolean
}

/** 3 — Governance & assurance */
export const PITCH_GOVERNANCE = {
  eyebrow: 'Governance and assurance',
  title: 'Clinical oversight by design, not autonomous prescribing.',
  subtitle:
    'DIOS is clinical decision support with layered confidence labels, clinician accountability, UK GDPR-aligned controls, and consent that separates care from optional research.',
  heroImage: PITCH_IMAGES.model,
  heroAlt: 'Clinical governance and data controls',
  heroCta: {
    line: 'Request the clinical briefing and governance pack for your ICS or trust.',
    href: '/contact?intent=clinical-briefing',
    label: 'Request the briefing and governance pack →',
  },
  assurancePack: {
    eyebrow: 'Assurance pack (what reviewers ask for)',
    bullets: [
      'Intended use statement (CDS, primary care, UK)',
      'Layered confidence: ESTIMATED → PRECISION → CONFIRMED',
      'Consent model: clinical use vs optional research (revocable)',
      'DPIA starter + subprocessors list for IG review',
      'Pilot safety monitoring and escalation principles',
    ],
  },
  items: [
    {
      id: 'cds',
      title: 'Clinical decision support',
      body: 'Outputs support shared decisions with published chronotherapy evidence — they do not diagnose or change prescriptions without clinician agreement.',
      href: '/evidence',
      label: 'Evidence overview →',
      image: PITCH_IMAGES.steps.protocol,
      imageAlt: 'Personalised protocol output',
    },
    {
      id: 'confidence',
      title: 'Layered confidence',
      body: 'Every score is labelled by data layer so clinicians see what is estimated versus confirmed before acting.',
      href: '/evidence#spectrum',
      label: 'Spectrum & confidence layers →',
      image: PITCH_IMAGES.spectrum,
      imageAlt: 'Circadian spectrum with confidence layers',
    },
    {
      id: 'oversight',
      title: 'Clinician in the loop',
      body: 'Protocols are reviewed in consultation; prescribing authority and accountability stay with the licensed clinician.',
      href: '/#pitch-how',
      label: 'Care pathway →',
      image: PITCH_IMAGES.sides.Clinicians,
      imageAlt: 'Clinician oversight',
    },
    {
      id: 'ig',
      title: 'Information governance',
      body: 'Privacy policy, patient data controls, and DPIA support for NHS IG teams — lawful basis documented for deployment discussions.',
      href: '/privacy',
      label: 'Privacy policy →',
      image: PITCH_IMAGES.model,
      imageAlt: 'Data governance',
    },
    {
      id: 'research',
      title: 'Research vs care firewall',
      body: 'Consent for DIOS Coach and clinical DIOS is separate from optional, revocable anonymised Chronobiobank research.',
      href: '/#pitch-model',
      label: 'Chronobiobank model →',
      image: PITCH_IMAGES.governance.consentFirewall,
      imageAlt: 'Clinical care data separated from optional anonymised research consent',
    },
    {
      id: 'regulatory',
      title: 'Regulatory framing',
      body: 'Intended use should be classified under local SaMD / CDS frameworks before deployment beyond research demos.',
      href: 'https://www.gov.uk/government/collections/software-and-ai-as-a-medical-device',
      label: 'MHRA · SaMD guidance →',
      image: PITCH_IMAGES.governance.regulatory,
      imageAlt: 'Clinical software governance and regulatory review',
      external: true,
    },
  ] as const satisfies readonly PitchGovernanceItem[],
  standards: [
    {
      label: 'NHS DCB0129 · Clinical risk management for health IT',
      href: 'https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-development-and-deployment-of-health-it-systems',
    },
    {
      label: 'ICO · UK GDPR guidance',
      href: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/',
    },
    {
      label: 'NHS England · Medicines optimisation',
      href: 'https://www.england.nhs.uk/medicines-2/medicines-optimisation/',
    },
  ] as const satisfies readonly PitchCmoCitation[],
} as const

/** 4 — Clinical vignette */
export const PITCH_CLINICAL_VIGNETTE = {
  eyebrow: 'Clinical vignette',
  title: 'Illustrative review of an evening-type hypertensive patient.',
  subtitle: 'Composite example for pathway design, not an individual patient record.',
  image: PITCH_IMAGES.spectrum,
  imageAlt: 'Circadian desynchrony spectrum',
  patient: {
    label: 'Baseline',
    summary:
      '58-year-old on community BP treatment. Reports evening chronotype and inconsistent morning adherence before work.',
  },
  findings: [
    {
      node: 'Body clock',
      score: '32',
      note: 'Estimated evening phase; current dose window likely misaligned.',
    },
    {
      node: 'Blood pressure',
      score: '38',
      note: 'Node flagged for timing review with clinician oversight.',
    },
  ],
  action:
    'Clinician reviews spectrum and confidence layer, discusses timing options through shared decision-making, and agrees a supervised timing adjustment with follow-up.',
  documentation: [
    'Record baseline regimen and adherence context.',
    'Record rationale and evidence link used in discussion.',
    'Record agreed timing plan and review date.',
  ],
  citations: [
    { label: 'Interactive spectrum framework', href: '/evidence#spectrum' },
    { label: 'EHJ chronotherapy evidence', href: 'https://doi.org/10.1093/eurheartj/ehz754' },
    {
      label: 'Clinical infrastructure statement',
      href: '/evidence',
    },
  ] as const satisfies readonly PitchCmoCitation[],
} as const

/** 5 — CMO ask */
export const PITCH_CMO_CTA = {
  eyebrow: 'Executive next step',
  title: 'Request a clinical briefing and governance pack.',
  subtitle:
    'Focused session for CMOs, medical directors, and ICS clinical leads: what DIOS is, how it fits NHS pathways, and what a safe pilot can look like.',
  image: PITCH_IMAGES.sides.NHS,
  imageAlt: 'NHS leadership briefing',
  briefingAgenda: {
    eyebrow: '20-minute briefing agenda',
    items: [
      'Intended use: CDS boundaries and clinician accountability',
      'Care pathway: patient async measure → clinician review → documented plan',
      'Governance: consent model, IG/DPIA starter, research firewall',
      'Pilot design: cohort size, outcomes, safety monitoring, evaluation template',
    ],
  },
  deliverables: {
    eyebrow: 'What you receive after the call',
    items: [
      'Clinical briefing deck (PDF)',
      'Governance & assurance summary',
      'DPIA starter template + subprocessor list',
      'ICS/PCN pilot scope and evaluation one-pager',
    ],
  },
  primary: {
    label: 'Request clinical briefing',
    href: '/contact?intent=clinical-briefing',
  },
  secondary: {
    label: 'Evidence overview',
    href: '/evidence',
  },
  supportingLinks: [
    { label: 'Governance section', href: '/#pitch-governance' },
    { label: 'NHS leaders pathway', href: '/#pitch-nhs-leaders' },
    { label: 'Clinical vignette', href: '/#pitch-vignette' },
  ] as const satisfies readonly PitchCmoCitation[],
} as const
