/** Technology hub — four-layer stack for patients and clinicians. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { BODY_CLOCK_LAYERS, PROXY_DLMO_METHODOLOGY } from '@/lib/circadian/body-clock-measurement'
import { DLMO_PROXY_VERSION } from '@/lib/circadian/dlmo'
import {
  CHRONOBIOBANK_SCIENCE_HREF,
} from '@/lib/deepdose-marketing/site-nav-links'

export const TECHNOLOGY_HUB_META = {
  title: `Technology · ${DEEPDOSE_NAME}`,
  description:
    'Four layers that compound: passive signals, proxy DLMO, TipTraQ validation, and six personalised daily dose cues.',
} as const

export const TECHNOLOGY_HUB_INTRO = {
  eyebrow: 'The Stack',
  titleWhite: 'Layers that',
  titleAccent: 'compound.',
  lede:
    'Passive signals, proxy DLMO, TipTraQ validation, daily dose cues — four layers, each sharpening the estimate.',
} as const

export const TECHNOLOGY_LAYERS = [
  {
    id: 'signals',
      rank: 1,
      label: 'Layer 1',
      cue: '#acd3de',
      title: 'Passive signal capture',
      body:
        'Smartphone sensors run continuously in the background — light exposure, screen-on patterns, movement, social rhythm irregularity, and sleep/wake timing from the accelerometer. No active input required. Social jet lag score is computed here: the surface metric that maps to Ersche\u2019s clinical framework.',
    },
    {
      id: 'proxy',
      rank: 2,
      label: 'Layer 2',
      cue: '#c9b6f2',
      title: 'Proxy DLMO estimation',
      body:
        'The algorithm takes the passive signal stream and estimates where dim-light melatonin onset currently sits — without a saliva test or a lab. Actigraphy-derived phase estimates correlate with DLMO at r\u22480.8 in published studies. Our contribution is doing it continuously, on-device, from consumer hardware.',
    },
    {
      id: 'tiptraq',
      rank: 3,
      label: 'Layer 3',
      cue: '#f2b8a2',
      title: 'Physiological validation (TipTraQ)',
      body:
        'For users who opt into clinical-grade validation. TipTraQ adds skin temperature, heart rate variability, and peripheral vasoconstriction — physiological markers that confirm the proxy estimate is tracking real circadian phase. This is what turns the platform from a wellness app into a research instrument.',
    },
    {
      id: 'doses',
      rank: 4,
      label: 'Layer 4',
      cue: '#8b9cf8',
      title: 'Personalised dose prompts',
      body:
        'The output — six daily dose prompts (light, meals, meds, movement, wind-down, blackout) timed to your phase anchor from the layers below. When drift shifts your clock, every cue moves with it — not fixed alarms. Take-now and wait windows for medicines sit inside the same plan on the patient dashboard.',
    },
] as const

export const TECHNOLOGY_RESEARCH = {
  label: 'Research',
  cue: '#8b9cf8',
  title: 'Chronobiology',
  beats: [
    'Population phase insight without centralising intimate sleep traces.',
    'Consent-gated cohorts and pseudonymised outcomes for chronobiology labs and clinical teams.',
    'A path from on-device proxy DLMO to TipTraQ clinical-grade validation when it matters.',
    'Governed partnership for cohort access — detailed methodology under research agreement.',
  ],
  cta: { label: 'Science & trust', href: CHRONOBIOBANK_SCIENCE_HREF },
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
