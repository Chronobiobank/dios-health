/** Technology — investor, CMO, and clinical diligence content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { BODY_CLOCK_LAYERS, PROXY_DLMO_METHODOLOGY } from '@/lib/circadian/body-clock-measurement'
import { DLMO_PROXY_VERSION } from '@/lib/circadian/dlmo'
import {
  CHRONOBIOBANK_SCIENCE_HREF,
  TECHNOLOGY_DLMO_PROXY_HREF,
} from '@/lib/deepdose-marketing/site-nav-links'

export const TECHNOLOGY_HUB_META = {
  title: `Technology · ${DEEPDOSE_NAME}`,
  description:
    'Phase-aware precision dosing: ingest, compute, and govern — decision support for clinicians, not a black-box prescriber.',
} as const

export const TECHNOLOGY_HUB_INTRO = {
  eyebrow: 'Technology',
  titleWhite: 'AI precision dosing,',
  titleAccent: 'clinically bounded.',
  lede:
    `${DEEPDOSE_NAME} turns passive circadian data into structured timing windows — versioned engines, explicit uncertainty, and a validation ladder your CMO can audit.`,
} as const

export const TECHNOLOGY_HERO = {
  label: 'The stack',
  cue: '#8b9cf8',
  title: 'Phase anchor → BTI windows → clinician triage',
  body:
    'Pull-sync wearables and questionnaires on dashboard load. Fuse a proxy DLMO, shift medication windows, surface drift — upgrade to TipTraQ when clinical grade matters.',
} as const

export const TECHNOLOGY_STACK = {
  eyebrow: 'Platform',
  title: 'Four layers, one decision-support loop',
  support: 'Modular services — algorithmic math never mixed with UI controllers.',
  layers: [
    {
      id: 'ingest',
      label: 'Ingest',
      cue: '#acd3de',
      title: 'Authorised device pull-sync',
      body: 'Oura, Whoop, Apple HealthKit, MCTQ, and TipTraQ — triggered on dashboard load, not continuous streaming.',
    },
    {
      id: 'phase',
      label: 'Phase',
      cue: '#c9b6f2',
      title: 'DLMO fusion ladder',
      body: 'Proxy DLMO from published behavioural markers; three-tier resolution elevates TipTraQ clinical blocks when present.',
    },
    {
      id: 'compute',
      label: 'Compute',
      cue: '#f2b8a2',
      title: 'Isolated BTI engine',
      body: 'Biological Time Index, CHI, and dosing windows — structured JSON payloads only. Evidence-graded phase offsets, not opaque ML scores.',
    },
    {
      id: 'govern',
      label: 'Govern',
      cue: '#8b9cf8',
      title: 'Chronobiobank isolation',
      body: 'Model weights and demographic baselines stay server-side. UI receives timing outputs; telemetry is anonymised.',
    },
  ],
} as const

export const TECHNOLOGY_VALIDATION = {
  eyebrow: 'Validation',
  title: 'Estimate first. Prove when it counts.',
  support: 'Every patient starts free; clinical grade is an upgrade path, not a gate.',
  tiers: [
    {
      id: 'l3',
      rank: 1,
      badge: 'L3 · Free',
      cue: '#acd3de',
      title: 'Smartphone proxy',
      body: 'Sleep onset − 2 h fused with MCTQ mid-sleep − 2.5 h. Confidence capped at 0.55.',
      href: TECHNOLOGY_DLMO_PROXY_HREF,
      linkLabel: 'Proxy DLMO methodology',
    },
    {
      id: 'l2',
      rank: 2,
      badge: 'L2 · Panel',
      cue: '#c9b6f2',
      title: 'Blood-panel phase',
      body: 'Optional melatonin or metabolite panels when ordered — resolves above proxy when confidence threshold met.',
    },
    {
      id: 'l1',
      rank: 3,
      badge: 'L1 · Clinical',
      cue: '#f2b8a2',
      title: 'TipTraQ three nights',
      body: 'Home sleep staging, SpO₂, and respiratory events replace the proxy. Verified clinical-grade badge on record.',
      href: '/home-test',
      linkLabel: 'Home test overview',
    },
  ],
} as const

export const TECHNOLOGY_BOUNDARY = {
  eyebrow: 'Clinical boundary',
  title: 'What we are — and what we are not',
  contrasts: [
    {
      id: 'support',
      label: 'Decision support',
      cue: '#acd3de',
      variant: 'hero' as const,
      title: 'Timing recommendations you approve',
      body:
        'Clinicians prescribe; patients accept in-app. BTI surfaces window open, closed, or critical drift — never autonomous dose changes.',
    },
    {
      id: 'limits',
      label: 'Not a prescriber',
      cue: '#6b7280',
      variant: 'muted' as const,
      title: 'No diagnosis. No PK modelling.',
      body:
        'Not a MedTech accelerator or autonomous prescriber. Windows are phase-adjusted from published chronotherapy offsets — not drug-specific PK/PD simulation.',
    },
  ],
} as const

export const TECHNOLOGY_AI = {
  eyebrow: 'AI transparency',
  title: 'Rules you can read. Learning you can govern.',
  contrasts: [
    {
      id: 'rules',
      label: 'Rules-first',
      cue: '#c9b6f2',
      variant: 'hero' as const,
      title: 'Versioned, auditable engines',
      body: `DLMO proxy (${DLMO_PROXY_VERSION}), CHI v1, and BTI payloads ship as documented formulas — inspectable, not a black box.`,
    },
    {
      id: 'federated',
      label: 'Federated edge',
      cue: '#8b9cf8',
      variant: 'default' as const,
      title: 'Patterns, not patient warehouses',
      body:
        'Chronobiobank ingests anonymised telemetry — consent-gated, pseudonymised. Population models improve without centralising raw nights.',
    },
  ],
} as const

export const TECHNOLOGY_CMO_FLOW = {
  eyebrow: 'CMO workflow',
  title: 'Built for triage, not another portal',
  support: 'Device gaps and drift rise to the top — validated records earn the clinical badge.',
  steps: [
    {
      label: 'Queue',
      cue: '#f2b8a2',
      title: 'Drift & device alerts first',
      body: '36-hour sync rule flags empty tokens and stale telemetry. BTI misalignment prioritises the panel.',
    },
    {
      label: 'Validate',
      cue: '#acd3de',
      title: 'TipTraQ when grade matters',
      body: 'Three-night home kits set a clinical baseline — sleep staging replaces the proxy anchor.',
    },
    {
      label: 'Retime',
      cue: '#c9b6f2',
      title: 'Evidence-graded windows',
      body: 'Medication-specific offsets shifted by phase. Clinician approves; patient sees plain-language take-now cues.',
    },
    {
      label: 'Audit',
      cue: '#8b9cf8',
      title: 'Consent & access trail',
      body: 'Dynamic consent per purpose — care, research, analytics. Withdraw any time; RLS on every patient row.',
    },
  ],
} as const

export const TECHNOLOGY_OUTPUTS = {
  eyebrow: 'Outputs',
  title: 'Structured payloads only',
  support: 'Every dashboard metric maps to a defined schema — suitable for integration and diligence.',
  metrics: [
    {
      id: 'bti',
      cue: '#f2b8a2',
      label: 'BTI',
      title: 'Biological Time Index',
      body: 'Window open · closed · critical drift — plus clock-relative biological time and dosing window ISO timestamps.',
    },
    {
      id: 'chi',
      cue: '#acd3de',
      label: 'CHI',
      title: 'Circadian Health Index',
      body: '0–100 composite: phase offset, social jet lag, vitamin D band, and signal quality — capped when data are stale.',
    },
    {
      id: 'bca',
      cue: '#c9b6f2',
      label: 'BCA',
      title: 'Body clock alignment',
      body: 'Melatonin readiness vs lights-out habit — triage hint for adherence drift, not a diagnosis.',
    },
    {
      id: 'windows',
      cue: '#8b9cf8',
      label: 'Windows',
      title: 'Phase-shifted dosing',
      body: 'Per-medication windows adjusted by DLMO phase offset — evidence-graded where literature supports timing.',
    },
  ],
} as const

export const TECHNOLOGY_DILIGENCE = {
  eyebrow: 'Due diligence',
  title: 'What investors and CMOs ask first',
  items: [
    { id: 'versioned', stat: 'Versioned', label: 'Engines ship with explicit version tags in every payload.' },
    { id: 'isolation', stat: 'Isolated', label: 'BTI math decoupled from UI — Chronobiobank weights never in patient UI.' },
    { id: 'alert', stat: '36 h', label: 'Device interruption rule auto-flags stale sync for triage queue.' },
    { id: 'badge', stat: 'Verified', label: 'Premium tier renders clinical-grade badge on validated TipTraQ records.' },
    { id: 'gdpr', stat: 'GDPR', label: 'UK GDPR and HIPAA-shaped workflows — dynamic consent, minimum necessary.' },
    { id: 'pilot', stat: 'Pilot', label: 'Endpoints: in-window dosing, drift, triage time, TipTraQ completion.' },
  ],
} as const

export const TECHNOLOGY_DEEP_DIVES = {
  eyebrow: 'Methodology',
  title: 'Go deeper',
  topics: [
    {
      id: 'dlmo-proxy',
      href: TECHNOLOGY_DLMO_PROXY_HREF,
      badge: 'Core',
      cue: '#acd3de',
      title: 'Proxy DLMO',
      teaser: 'Fusion algorithm, confidence caps, and primary references — line by line.',
      audience: 'CMOs · Clinical leads',
    },
    {
      id: 'science-trust',
      href: CHRONOBIOBANK_SCIENCE_HREF,
      badge: 'Full stack',
      cue: '#c9b6f2',
      title: 'Science & trust',
      teaser: 'Wearables, privacy pillars, evidence library, and clinician controls.',
      audience: 'Investors · DPOs',
    },
    {
      id: 'clinician',
      href: '/clinician-landing',
      badge: 'Workflow',
      cue: '#f2b8a2',
      title: 'Clinician panel',
      teaser: 'Triage queue, invite codes, timing recommendations, and TipTraQ validation path.',
      audience: 'CMOs · Practice leads',
    },
    {
      id: 'chronobiobank',
      href: '/chronobiobank',
      badge: 'Data plane',
      cue: '#8b9cf8',
      title: 'Chronobiobank',
      teaser: 'Distributed intelligence, federated learning, and licensed enterprise analytics.',
      audience: 'Investors · Enterprise',
    },
  ],
} as const

export const TECHNOLOGY_CTA = {
  headline: 'Review the clinical workflow',
  support: 'Sign in to the triage panel or read the proxy DLMO methodology before your diligence call.',
  primary: { label: 'Clinician sign in', href: '/login?next=/clinical/dashboard' },
  secondary: { label: 'Proxy DLMO methodology', href: TECHNOLOGY_DLMO_PROXY_HREF },
} as const

/* ── Proxy DLMO sub-page ── */

export const DLMO_PROXY_PAGE_META = {
  title: `Proxy DLMO methodology · ${DEEPDOSE_NAME}`,
  description:
    'Published behavioural proxies, weighted fusion, confidence caps — the free-tier phase anchor your CMO can audit.',
} as const

export const DLMO_PROXY_PAGE_INTRO = {
  eyebrow: 'Technology · Proxy DLMO',
  titleWhite: 'Dim-light melatonin onset,',
  titleAccent: 'estimated without a laboratory.',
  lede:
    'Salivary DLMO under controlled dim light remains the clinical reference. Our free tier estimates the same phase marker from two population-validated behavioural signals — fused with explicit uncertainty bands.',
  versionLabel: `Engine ${DLMO_PROXY_VERSION}`,
} as const

export const DLMO_PROXY_CONTRAST = {
  eyebrow: 'Reference vs proxy',
  contrasts: [
    {
      id: 'lab',
      label: 'Gold standard',
      cue: '#6b7280',
      variant: 'muted' as const,
      title: 'Salivary DLMO',
      body: 'Repeated samples under controlled dim light — clinical reference, high burden, not scalable at population entry.',
    },
    {
      id: 'proxy',
      label: 'L3 · Free tier',
      cue: '#acd3de',
      variant: 'hero' as const,
      title: 'Behavioural proxy',
      body: 'Sleep onset − 2 h and MCTQ mid-sleep − 2.5 h — published offsets, circular fusion, confidence capped at 0.55.',
    },
  ],
} as const

export const DLMO_PROXY_SIGNALS = PROXY_DLMO_METHODOLOGY

export const DLMO_PROXY_FUSION = {
  eyebrow: 'Algorithm',
  title: 'Four-step fusion',
  support: 'Live in estimateDlmoProxy() — same logic on every dashboard load.',
  steps: [
    {
      label: 'Extract',
      cue: '#acd3de',
      title: 'Circular mean sleep onset',
      body: 'Up to 14 nights in a 21-day window. Local wall-clock preserved — no server timezone conversion.',
    },
    {
      label: 'Anchor',
      cue: '#c9b6f2',
      title: 'MCTQ MSFsc offset',
      body: 'Latest chronotype profile. DLMO ≈ sleep-corrected mid-sleep on free days − 2.5 h.',
    },
    {
      label: 'Fuse',
      cue: '#f2b8a2',
      title: 'Weighted blend',
      body: 'Behavioural weight = min(14, nights); questionnaire weight = 2. Disagreement widens the uncertainty band.',
    },
    {
      label: 'Report',
      cue: '#8b9cf8',
      title: 'Phase offset minutes',
      body: 'Deviation from population mean DLMO (21:00) — drives medication window shifts in the BTI engine.',
    },
  ],
} as const

export const DLMO_PROXY_CONFIDENCE = {
  eyebrow: 'Uncertainty',
  title: 'Confidence is capped — by design',
  support: 'A proxy never claims clinical certainty. Bands narrow as evidence accumulates.',
  bands: [
    { label: 'Low', range: '±90 min', threshold: '< 0.30 confidence' },
    { label: 'Moderate', range: '±75 min', threshold: '0.30 – 0.44' },
    { label: 'Strong proxy', range: '±60 min', threshold: '≥ 0.45 (max 0.55)' },
  ],
  rules: [
    'Behavioural: +0.10 base, +0.03 per synced night (max +0.35).',
    'Questionnaire present: +0.12.',
    'Agreement ≤30 min: +0.10 · ≤60 min: +0.05 · >120 min: −0.05.',
  ],
} as const

export const DLMO_PROXY_TIERS = {
  eyebrow: 'Upgrade path',
  title: 'Three-tier DLMO resolution',
  lede: 'tiptraq_l1 dominates above 0.4 confidence; blood_panel_l2 above 0.3; else smartphone_l3.',
  layers: BODY_CLOCK_LAYERS,
} as const

export const DLMO_PROXY_LIMITS = {
  eyebrow: 'Honest limits',
  title: 'What this is not',
  points: [
    'Not salivary or plasma DLMO under controlled dim light.',
    'Wearable staging varies — we use onset timestamps, not device staging labels.',
    'No drug PK/PD simulation; windows are phase-adjusted chronotherapy offsets.',
    'Model weights stay server-side — UI receives timing payloads only.',
  ],
  upgrade:
    'TipTraQ three-night validation replaces the proxy and unlocks the verified clinical-grade badge.',
} as const

export const DLMO_PROXY_REFERENCES = {
  title: 'Primary references',
  papers: [
    {
      id: 'burgess-2016',
      title: 'Relationship between melatonin onset and sleep onset',
      authors: 'Burgess, H.J. et al.',
      year: '2016',
      meta: 'Sleep Medicine · Sleep onset ≈ 2 h after DLMO',
      href: 'https://doi.org/10.1016/j.sleep.2015.10.020',
      cue: '#f2b8a2',
    },
    {
      id: 'roenneberg-2007',
      title: 'Epidemiology of the human circadian clock',
      authors: 'Roenneberg, T. et al.',
      year: '2007',
      meta: 'Sleep Medicine Reviews · MCTQ / MSFsc',
      href: 'https://doi.org/10.1016/j.sleep.2007.05.001',
      cue: '#acd3de',
    },
  ],
} as const

export const DLMO_PROXY_CLINICIAN_CTA = {
  headline: 'Ready for clinical review?',
  support: 'Walk the triage panel or return to the full technology overview.',
  links: [
    { label: 'Technology overview', href: '/technology' },
    { label: 'Clinician sign in', href: '/login?next=/clinical/dashboard' },
    { label: 'TipTraQ home test', href: '/home-test' },
  ],
} as const
