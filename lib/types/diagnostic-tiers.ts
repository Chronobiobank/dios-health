/** DIOS diagnostic tier architecture — aligned to intelligence cadence model. */

import {
  BLOOD_PANEL_CADENCE,
  INTELLIGENCE_CADENCES,
  TIPTRAQ_CALIBRATION,
} from '@/lib/product/intelligence-cadence'

export type DiagnosticTier = 'L1' | 'L2' | 'L3'

export interface TierConfig {
  tier: DiagnosticTier
  name: string
  device: string
  cadence: string
  intelligenceRole: string
  dlmoConfidencePct: number
  windowPrecisionMins: number
  description: string
  outputs: string[]
  entryPoint: boolean
  ukExclusive: boolean
}

export const DIAGNOSTIC_TIERS: Record<DiagnosticTier, TierConfig> = {
  L1: {
    tier: 'L1',
    name: 'TipTraQ sleep sensor',
    device: 'TipTraQ by PranaQ',
    cadence: `Every ${TIPTRAQ_CALIBRATION.intervalMonths} months · ${TIPTRAQ_CALIBRATION.nightsPerBlock} nights`,
    intelligenceRole: INTELLIGENCE_CADENCES.tiptraq.roleLabel,
    dlmoConfidencePct: 90,
    windowPrecisionMins: 18,
    description:
      'Periodic clinical assessment — not a continuous monitor. Three nights every six months delivers a high-confidence DLMO snapshot and sleep architecture read that resets personalised dose windows until the next block. UK via DIOS.',
    outputs: [...TIPTRAQ_CALIBRATION.outputs],
    entryPoint: false,
    ukExclusive: true,
  },
  L2: {
    tier: 'L2',
    name: '90-day blood panel',
    device: 'GP or City Labs draw',
    cadence: `Every ${BLOOD_PANEL_CADENCE.intervalDays} days`,
    intelligenceRole: INTELLIGENCE_CADENCES.blood_panel.roleLabel,
    dlmoConfidencePct: 65,
    windowPrecisionMins: 60,
    description:
      'PTH, 25-OH Vitamin D, B12, ferritin, and serum calcium — the Coimbra safety gate and VDR activation marker. Clinician reviews protocol progress and decides whether to escalate, hold, or bridge cofactors.',
    outputs: BLOOD_PANEL_CADENCE.markers.map((m) => m.id),
    entryPoint: true,
    ukExclusive: false,
  },
  L3: {
    tier: 'L3',
    name: 'MLux camera proxy',
    device: 'Patient smartphone',
    cadence: INTELLIGENCE_CADENCES.mlux_camera.interval,
    intelligenceRole: INTELLIGENCE_CADENCES.mlux_camera.roleLabel,
    dlmoConfidencePct: 40,
    windowPrecisionMins: 90,
    description:
      'Monthly smartphone light capture refreshes the provisional DLMO estimate between TipTraQ blocks — adjusted for seasonal light and reported wake and sleep times. Entry point for all patients; explicitly provisional until blood or TipTraQ calibration.',
    outputs: [
      'melanopic_lux_estimate',
      'chronotype_proxy',
      'wake_time',
      'sleep_time',
      'provisional_dlmo',
    ],
    entryPoint: true,
    ukExclusive: false,
  },
}

export function getActiveTier(profile: {
  has_tipraq: boolean
  has_blood_panel: boolean
}): DiagnosticTier {
  if (profile.has_tipraq) return 'L1'
  if (profile.has_blood_panel) return 'L2'
  return 'L3'
}

export function getTierLabel(tier: DiagnosticTier): string {
  const labels: Record<DiagnosticTier, string> = {
    L1: 'Clinical grade',
    L2: 'Inferred',
    L3: 'Provisional',
  }
  return labels[tier]
}
