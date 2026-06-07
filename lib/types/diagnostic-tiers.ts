/** DIOS diagnostic tier architecture — L1 TipTraQ · L2 bloods · L3 smartphone. */

export type DiagnosticTier = 'L1' | 'L2' | 'L3'

export interface TierConfig {
  tier: DiagnosticTier
  name: string
  device: string
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
    dlmoConfidencePct: 90,
    windowPrecisionMins: 18,
    description:
      'Wearable overnight sensor measuring autonomic nervous system activity, sleep staging, REM latency, AHI, and skin temperature. The only non-invasive direct DLMO proxy available outside a sleep lab. Exclusively available in the UK through DIOS.',
    outputs: [
      'dlmo_proxy',
      'sns_activity',
      'rem_latency_mins',
      'sleep_efficiency',
      'ahi',
      'rdi',
      'waso_mins',
      'mlux_score',
    ],
    entryPoint: false,
    ukExclusive: true,
  },
  L2: {
    tier: 'L2',
    name: 'Gominak blood panel',
    device: 'GP blood test — NHS requestable',
    dlmoConfidencePct: 65,
    windowPrecisionMins: 60,
    description:
      'Four-marker blood panel used as indirect proxies for pRGC system function. Low 25-OH Vitamin D signals pRGC dysfunction. Elevated PTH indicates VDR resistance. B12 deficit correlates with sleep stage 3 failure. Requestable by any UK GP at no cost to patient.',
    outputs: [
      'twenty_five_oh_vit_d_ng_ml',
      'b12_pmol_l',
      'ferritin_ug_l',
      'pth_pg_ml',
      'serum_calcium_mmol_l',
      'twenty_four_hr_urine_calcium_mg',
      'egfr_ml_min',
    ],
    entryPoint: true,
    ukExclusive: false,
  },
  L3: {
    tier: 'L3',
    name: 'Smartphone camera proxy',
    device: 'Patient smartphone',
    dlmoConfidencePct: 40,
    windowPrecisionMins: 90,
    description:
      'Ambient light and screen exposure logged via phone camera at wake and sleep times. Provides a population-average DLMO estimate adjusted for latitude, season, and self-reported chronotype. Entry point for all patients. Explicitly provisional — DINA prompts upgrade to L2 or L1 as confidence builds.',
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
