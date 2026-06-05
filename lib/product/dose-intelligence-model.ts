/**
 * DIOS · Dose Intelligence OS — canonical product model (June 2026 memo).
 * Single source for thresholds, layer labels, and protocol module ids.
 */

export const PRODUCT_NAME = 'DIOS' as const
export const PRODUCT_TAGLINE = 'Dose Intelligence OS' as const

export const AGE_LABELS = {
  calendar: 'Calendar Age',
  photonic: 'Photonic Age',
  burdenYears: 'chronopenic burden',
} as const

/** Layer 1 — First Light Protocol (free, daily) */
export const LAYER_1 = {
  id: 'morning-scan',
  label: 'Layer 1 — First Light scan',
  description: 'Daily morning scan — MLux, chronotype, social jet lag, autonomic index.',
} as const

export const LAYER_2 = {
  id: 'biochemical',
  label: 'Layer 2 — Biochemical panel',
  gominakPanel: 'Gominak panel (D3, B12, ferritin, B5)',
  chronoimmunePanel: 'Chronoimmune panel (PTH, calcium, urine calcium, eGFR)',
} as const

export const LAYER_3 = {
  id: 'architectural',
  label: 'Layer 3 — Architectural verification',
  description: 'TipTraQ sleep, optional OCT, optional CGM.',
} as const

export const FIRST_LIGHT_PROTOCOL = {
  name: 'First Light Protocol',
  /** Local entrainment window end (approx 9am) */
  windowEndHour: 9,
  scanDurationSeconds: 60,
  adherenceCheckpoints: [
    'Fluid intake above 2.5L yesterday',
    'Low-calcium diet adherence',
    'Physical activity logged',
  ] as const,
  missedScansAmber: 3,
  missedScansRed: 5,
  eatingWindowOpenHoursAfterFirstLight: 1,
  eatingWindowDurationHoursMin: 10,
  eatingWindowDurationHoursMax: 12,
} as const

export const PROTOCOL_MODULES = [
  {
    id: 'chronoimmune',
    name: 'Chronoimmune',
    feedback: 'PTH position in lab range (target lower third)',
    titration: 'D3 IU per kg body weight',
  },
  {
    id: 'sleep-architecture',
    name: 'Sleep Architecture',
    feedback: 'REM efficiency and deep sleep %',
    titration: 'B5 dose escalation',
  },
  {
    id: 'chronopharmacology',
    name: 'Chronopharmacology',
    feedback: 'MLux and HRV vs chronotype',
    titration: 'Medication timing (not dose quantity)',
  },
  {
    id: 'metabolic-clock',
    name: 'Metabolic Clock',
    feedback: 'Fasting insulin and glucose rhythm amplitude',
    titration: 'Eating window anchored to first light',
  },
] as const

export const CLINICIAN_RISK = {
  red: 'Red — immediate attention',
  amber: 'Amber — review recommended',
  green: 'Green — protocol progressing',
  scanComplianceGreen: 0.85,
  scanComplianceAmber: 0.7,
} as const

export const CHRONOPENIC_BURDEN = {
  /** Score 0 = Photonic Age equals Calendar Age; 100 = maximum measurable gap */
  min: 0,
  max: 100,
  /** Years of photonic–calendar gap that maps to score 100 at Layer 1 only */
  maxGapYearsLayer1: 15,
} as const
