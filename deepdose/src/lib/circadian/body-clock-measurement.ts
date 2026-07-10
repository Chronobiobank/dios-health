import type { DlmoSource } from '@/lib/patient/dose-dash-types'

/** Where the body-clock anchor sits on the estimate → validation ladder. */
export type BodyClockLayerId = 'estimate' | 'chrono' | 'clinical'

export type BodyClockLayer = {
  id: BodyClockLayerId
  title: string
  badge?: string
  body: string
}

/** Public methodology — mirrors estimateDlmoProxy() in dlmo.ts. */
export const PROXY_DLMO_METHODOLOGY = {
  headline: 'Proxy DLMO (free tier)',
  lede:
    'Dim-Light Melatonin Onset (DLMO) is when melatonin begins rising under dim light — the reference phase marker in chronotherapy. Lab DLMO needs repeated saliva samples. We estimate it from two published behavioural proxies, then fuse them:',
  signals: [
    {
      id: 'behavioural',
      title: 'Sleep timing',
      formula: 'DLMO ≈ habitual sleep onset − 2 h',
      body: 'Circular mean of recent phone or wearable sleep onsets. Habitual sleep onset typically follows DLMO by about two hours (Burgess et al., 2016).',
    },
    {
      id: 'questionnaire',
      title: 'Chrono test (MCTQ)',
      formula: 'DLMO ≈ mid-sleep on free days − 2.5 h',
      body: 'Mid-sleep corrected for sleep debt (MSFsc) from the Munich Chronotype Questionnaire — a population-validated phase marker (Roenneberg).',
    },
  ] as const,
  fusion:
    'When both signals are present, we weight-fuse them: more synced nights increase weight on sleep timing; disagreement widens your uncertainty band (typically ±60–90 min). Confidence is capped well below clinical grade.',
  limits:
    'This is a proxy estimate, not a lab DLMO. TipTraQ three-night validation replaces or calibrates it with clinical-grade sleep staging.',
} as const

export function formatProxyDlmoSourceDetail(input: {
  nightsUsed: number
  hasQuestionnaire: boolean
  confidenceLabel: string
  bandMinutes: number
}): string {
  const parts: string[] = []
  if (input.nightsUsed > 0) {
    parts.push(
      `${input.nightsUsed} night${input.nightsUsed === 1 ? '' : 's'} sleep onset − 2 h`,
    )
  }
  if (input.hasQuestionnaire) {
    parts.push('MCTQ mid-sleep − 2.5 h')
  }
  const signals =
    parts.length > 0 ? parts.join(' + ') : 'chrono test answers until wearable data syncs'
  return `Proxy DLMO from ${signals}. ±${input.bandMinutes} min · ${input.confidenceLabel} confidence — not lab DLMO.`
}

export const BODY_CLOCK_LAYERS: readonly BodyClockLayer[] = [
  {
    id: 'estimate',
    badge: 'Free',
    title: 'Proxy DLMO from sleep',
    body: 'Phone and wearable sleep logs give habitual sleep onset. We apply DLMO ≈ sleep onset − 2 h (Burgess et al., 2016) — a behavioural proxy, not a lab measurement.',
  },
  {
    id: 'chrono',
    title: 'Chrono test refines phase',
    body: 'The Munich Chronotype Questionnaire (MCTQ) adds DLMO ≈ MSFsc − 2.5 h (Roenneberg). We fuse this with sleep timing when both are available.',
  },
  {
    id: 'clinical',
    badge: 'Clinical',
    title: 'TipTraQ validation',
    body: 'Three nights at home with the TipTraQ kit give a clinical-grade read — sleep staging, breathing, and oxygen. That block replaces the proxy and unlocks your verified badge.',
  },
] as const

export const BODY_CLOCK_PRICING_COMPARE = {
  eyebrow: 'How we measure',
  headline: 'Estimate first. Validate when it matters.',
  support:
    'Everyone starts with a free body-clock estimate from passive data. A TipTraQ Testkit upgrades it to a clinical read your clinician can trust.',
  estimate: {
    title: 'Phone & wearable estimate',
    figure: 'Free',
    points: [
      'Proxy DLMO: sleep onset − 2 h (wearable/phone)',
      'Fused with MCTQ mid-sleep − 2.5 h when you complete the chrono test',
      'Dosing windows shift with your phase anchor',
      'Confidence capped — TipTraQ validates when it matters',
    ],
    cta: { label: 'Start free', href: '/' },
  },
  clinical: {
    title: 'TipTraQ validation',
    figure: 'Three nights',
    points: [
      'Clinical-grade sleep staging and SpO₂',
      'Body-clock anchor replaces the proxy',
      'Verified clinical-grade badge on your record',
      'Quarterly re-reads catch drift early',
    ],
    cta: { label: 'Order Testkit', href: '/testkit' },
  },
} as const

export function resolveActiveBodyClockLayer(
  source: DlmoSource | null,
  tiptraqComplete: boolean
): BodyClockLayerId {
  if (tiptraqComplete || source?.label === 'TipTraQ clinical block') {
    return 'clinical'
  }
  if (source?.label === 'Phone & wearable estimate') {
    return 'estimate'
  }
  return 'chrono'
}

export function layerReached(layerId: BodyClockLayerId, active: BodyClockLayerId): boolean {
  const order: BodyClockLayerId[] = ['estimate', 'chrono', 'clinical']
  return order.indexOf(layerId) <= order.indexOf(active)
}

/** Marketing + in-app label for the four BCA bands (matches ScoreGauge). */
export function bcaTierLabel(score: number): string {
  if (score >= 80) return 'On track'
  if (score >= 60) return 'Slipping a little'
  if (score >= 40) return 'Out of sync'
  return 'Far apart'
}

export type BcaEducationTierId = 'high' | 'medium' | 'low'

export type BcaEducationTier = {
  id: BcaEducationTierId
  rangeLabel: string
  min: number
  shortLabel: string
  definitionLines: readonly [string, string]
  caption: string
}

/** Plain-language guide for the /100 BCA score — low, medium, high. */
export const BCA_EDUCATION_TIERS: readonly BcaEducationTier[] = [
  {
    id: 'low',
    rangeLabel: '0–59',
    min: 0,
    shortLabel: 'Drift',
    definitionLines: ['Body and bedtime', 'far apart'],
    caption: 'Sleep time and lights-out are far apart — medicine times may not fit your day.',
  },
  {
    id: 'medium',
    rangeLabel: '60–79',
    min: 60,
    shortLabel: 'Slip',
    definitionLines: ['Small gap', 'between them'],
    caption: 'A small gap between sleep time and lights-out — turn lights off on time to keep medicine times right.',
  },
  {
    id: 'high',
    rangeLabel: '80–100',
    min: 80,
    shortLabel: 'Steady',
    definitionLines: ['Sleep and lights', 'match up'],
    caption: 'Sleep time and lights-out match — your medicine times stay right.',
  },
] as const

export function resolveBcaEducationTier(score: number): BcaEducationTier {
  if (score >= 80) return BCA_EDUCATION_TIERS[2]
  if (score >= 60) return BCA_EDUCATION_TIERS[1]
  return BCA_EDUCATION_TIERS[0]
}

/** Marketing + preview copy for the melatonin vs blackout comparison. */
export const BODY_CLOCK_ANCHOR_COMPARE = {
  brainLabel: 'Melatonin',
  brainHint: 'When your body is ready for sleep',
  habitLabel: 'Blackout dose',
  habitHint: 'When you turned the lights off',
  gapLabel: (minutes: number) => `${minutes} min apart`,
  resultWell: 'Your sleep time and blackout habits align!',
  resultSlip: 'Slipping — sleep time and lights-off are drifting apart.',
  resultDrift: 'Off track — sleep time and lights-off are misaligned.',
} as const

export function bodyClockResultStatement(score: number): string {
  if (score >= 80) return BODY_CLOCK_ANCHOR_COMPARE.resultWell
  if (score >= 60) return BODY_CLOCK_ANCHOR_COMPARE.resultSlip
  return BODY_CLOCK_ANCHOR_COMPARE.resultDrift
}
