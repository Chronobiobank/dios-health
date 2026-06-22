/** Science & trust — concise scan heads; detail in page folds where needed. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { BODY_CLOCK_LAYERS, PROXY_DLMO_METHODOLOGY } from '@/lib/circadian/body-clock-measurement'
import { DEEPDOSE_LANDING_EVIDENCE } from '@/lib/deepdose-marketing/landing-content'
import { CHRONOBIOBANK_RESEARCH_HREF } from '@/lib/deepdose-marketing/site-nav-links'
import { WEARABLE_PROVIDERS_ORDERED } from '@/lib/wearables/tiers'

export const SCIENCE_TRUST_META = {
  title: `Science & trust · ${DEEPDOSE_NAME}`,
  description:
    'How DeepDose estimates body-clock timing, what we measure, and what we do not claim.',
} as const

export const SCIENCE_TRUST_INTRO = {
  eyebrow: 'Science & trust',
  title: 'How timing support works',
  lede: 'Decision support for dose timing — not a prescriber or diagnosis.',
} as const

export const SCIENCE_TRUST_CLAIMS = {
  title: 'What we do not claim',
  teaser: 'Honest limits on timing support.',
  body: `${DEEPDOSE_NAME} is not a MedTech accelerator or prescriber. We do not publish DeepDose-specific outcome trials here yet.`,
} as const

export const SCIENCE_TRUST_MEASUREMENT = {
  title: 'How we measure your clock',
  teaser: 'Proxy DLMO → chrono test fusion → TipTraQ validation.',
  badge: 'Measure',
  layers: BODY_CLOCK_LAYERS.map((layer) => ({
    ...layer,
    teaser:
      layer.id === 'estimate'
        ? 'DLMO ≈ sleep onset − 2 h from wearables.'
        : layer.id === 'chrono'
          ? 'DLMO ≈ MCTQ mid-sleep − 2.5 h, fused with sleep data.'
          : 'Three nights replaces the proxy with clinical staging.',
  })),
  proxyDlmo: PROXY_DLMO_METHODOLOGY,
  limits: {
    title: 'Limits',
    points: [
      'Free tier estimates proxy DLMO — not salivary or lab DLMO.',
      'Wearable sleep staging varies by device and algorithm.',
      'Dosing windows are phase-adjusted; we do not model drug PK.',
    ],
    goldStandard: 'Salivary DLMO and lab PSG remain the reference. TipTraQ is the validated upgrade.',
  },
} as const

export const SCIENCE_TRUST_ENGINE = {
  title: 'Dashboard outputs',
  teaser: 'Structured timing payloads only.',
  badge: 'Compute',
  outputs: [
    {
      id: 'bti',
      term: 'Biological Time Index',
      teaser: 'Window open, closed, or drifting.',
      body: 'Clock-relative timing plus plain-language take-now guidance.',
    },
    {
      id: 'bca',
      term: 'Body clock alignment',
      teaser: 'Sleep timing vs habits.',
      body: 'Drift from lights-out and regularity. A triage hint, not a diagnosis.',
    },
    {
      id: 'chi',
      term: 'Circadian Health Index',
      teaser: 'Composite 0–100 score.',
      body: 'Phase offset, social jet lag, and signal quality. Capped when data are stale.',
    },
    {
      id: 'windows',
      term: 'Dosing windows',
      teaser: 'Shifted by your phase.',
      body: 'Medication-specific windows. Evidence-graded where literature supports timing.',
    },
  ],
} as const

export const SCIENCE_TRUST_WEARABLES = {
  title: 'Connected devices',
  teaser: 'You authorise each sync.',
  badge: 'Sources',
  providers: WEARABLE_PROVIDERS_ORDERED.map((p) => ({
    name: p.displayName,
    tier: p.eyebrow,
    streams: p.streams,
  })),
} as const

export const SCIENCE_TRUST_EVIDENCE = {
  ...DEEPDOSE_LANDING_EVIDENCE,
  caveat:
    'Chronotherapy is promising but not universal standard-of-care. We cite published trials.',
} as const

export const SCIENCE_TRUST_STUDY = {
  title: 'Pilot metrics',
  teaser: 'Early cohorts. Public data when mature.',
  badge: 'Outcomes',
  endpoints: [
    'Doses inside vs outside suggested windows',
    'BCA/CHI drift and device sync gaps',
    'Clinician triage time and recommendation uptake',
    'TipTraQ completion and safety posture',
  ],
  note: 'Chronobiobank telemetry is anonymised. Model weights stay out of patient UI.',
} as const

export const SCIENCE_TRUST_PRIVACY = {
  title: 'Your data',
  teaser: 'UK GDPR and HIPAA-shaped workflows.',
  badge: 'Privacy',
  pillars: [
    {
      title: 'Dynamic consent',
      body: 'Separate care, research, and analytics. Withdraw any time.',
    },
    {
      title: 'Minimum necessary',
      body: 'No raw model weights in the UI — timing payloads only.',
    },
    {
      title: 'Decision support only',
      body: `${DEEPDOSE_NAME} suggests windows; it does not prescribe.`,
    },
    {
      title: 'Security by design',
      body: 'RLS, encrypted transport, separate TipTraQ clinical paths.',
    },
  ],
  links: [
    { label: 'Chronobiobank architecture', href: '/chronobiobank' },
    { label: 'Terms & clinical boundary', href: '/terms' },
    { label: 'Full research library', href: CHRONOBIOBANK_RESEARCH_HREF },
  ],
} as const

export const SCIENCE_TRUST_CLINICIAN = {
  title: 'For clinicians',
  teaser: 'Triage-first, not another portal.',
  badge: 'Clinicians',
  points: [
    'Device sync failures surface first (36-hour rule)',
    'Verified clinical-grade badge on TipTraQ records',
    'Prescribe timing; patient accepts in-app',
    'Invite codes link your panel',
  ],
  cta: { label: 'Clinician sign in', href: '/login?next=/clinical/dashboard' },
  landing: { label: 'Clinician overview', href: '/clinician-landing' },
} as const
