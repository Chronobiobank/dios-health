/**
 * DIOS · Dose Intelligence OS — canonical product model (June 2026 memo).
 * Cadence definitions live in intelligence-cadence.ts; this file holds protocol thresholds.
 */

import {
  BLOOD_PANEL_CADENCE,
  INTELLIGENCE_CADENCES,
  INTELLIGENCE_LAYER_SUMMARY,
  TIPTRAQ_CALIBRATION,
} from '@/lib/product/intelligence-cadence'

export {
  BLOOD_PANEL_CADENCE,
  INTELLIGENCE_CADENCES,
  INTELLIGENCE_LAYER_SUMMARY,
  TIPTRAQ_CALIBRATION,
} from '@/lib/product/intelligence-cadence'

export const PRODUCT_NAME = 'DIOS' as const
export const PRODUCT_TAGLINE = 'Dose Intelligence OS' as const

export const AGE_LABELS = {
  calendar: 'Calendar Age',
  chronopathic: 'Chronopathic Age',
  burdenYears: 'chronopenic burden',
} as const

/** Daily — DINA dose confirmations (adherence to TipTraQ windows) */
export const LAYER_DAILY = {
  id: INTELLIGENCE_CADENCES.dose_adherence.id,
  label: 'Daily — DINA dose confirmations',
  description: INTELLIGENCE_CADENCES.dose_adherence.description,
} as const

/** Monthly — MLux camera proxy between TipTraQ blocks */
export const LAYER_MONTHLY = {
  id: INTELLIGENCE_CADENCES.mlux_camera.id,
  label: 'Monthly — MLux camera proxy',
  description: INTELLIGENCE_CADENCES.mlux_camera.description,
} as const

/** Every 90 days — blood panel (Coimbra safety gate) */
export const LAYER_BLOOD = {
  id: INTELLIGENCE_CADENCES.blood_panel.id,
  label: 'Every 90 days — blood panel',
  panel: BLOOD_PANEL_CADENCE.markers.map((m) => m.label).join(', '),
  description: INTELLIGENCE_CADENCES.blood_panel.description,
} as const

/** Every 6 months — TipTraQ three-night calibration */
export const LAYER_TIPTRAQ = {
  id: INTELLIGENCE_CADENCES.tiptraq.id,
  label: 'Every 6 months — TipTraQ',
  description: TIPTRAQ_CALIBRATION.summary,
} as const

/** @deprecated Use LAYER_DAILY — kept for imports that expected numbered layers */
export const LAYER_1 = LAYER_MONTHLY
/** @deprecated Use LAYER_BLOOD */
export const LAYER_2 = LAYER_BLOOD
/** @deprecated Use LAYER_TIPTRAQ */
export const LAYER_3 = LAYER_TIPTRAQ

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
    id: 'medication-timing',
    name: 'Medication timing',
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
  /** Score 0 = Chronopathic Age equals Calendar Age; 100 = maximum measurable gap */
  min: 0,
  max: 100,
  /** Years of chronopathic–calendar gap that maps to score 100 at Layer 1 only */
  maxGapYearsLayer1: 15,
} as const
