/**
 * DIOS intelligence cadence — canonical data model for Dose Intelligence and Chronobiobank.
 *
 * Four read frequencies build layered certainty:
 * - TipTraQ sets the clock (6-month calibration)
 * - Blood panel confirms biological response (90 days)
 * - MLux camera maintains the estimate between TipTraQ blocks (monthly)
 * - DINA dose confirmations show adherence to personalised windows (daily)
 */

export type CadenceId = 'dose_adherence' | 'mlux_camera' | 'blood_panel' | 'tiptraq'

export type IntelligenceRole =
  | 'window_adherence'
  | 'maintains_estimate'
  | 'confirms_response'
  | 'sets_clock'

export interface CadenceDefinition {
  id: CadenceId
  label: string
  /** Patient-facing interval, e.g. "Daily" */
  interval: string
  intervalDays?: number
  intervalMonths?: number
  role: IntelligenceRole
  roleLabel: string
  description: string
  inputs: readonly string[]
  outputs: readonly string[]
}

export const TIPTRAQ_CALIBRATION = {
  nightsPerBlock: 3,
  intervalMonths: 6,
  summary:
    'TipTraQ is not a continuous monitor. Three nights every six months gives a precise, high-confidence DLMO snapshot — like polysomnography: a calibration event that sets the reference frame until the next read.',
  outputs: [
    'dlmo_proxy',
    'sleep_efficiency',
    'rem_latency',
    'ahi',
    'waso',
    'personalised_dose_windows',
  ],
} as const

export const BLOOD_PANEL_CADENCE = {
  intervalDays: 90,
  markers: [
    { id: 'pth', label: 'PTH', unit: 'pg/mL' },
    { id: '25_oh_d', label: '25-OH Vitamin D', unit: 'nmol/L' },
    { id: 'b12', label: 'B12', unit: 'pmol/L' },
    { id: 'ferritin', label: 'Ferritin', unit: 'μg/L' },
    { id: 'serum_calcium', label: 'Serum calcium', unit: 'mmol/L' },
  ],
  role:
    'Coimbra safety gate and VDR activation marker — clinician reviews protocol progress and decides whether to escalate, hold, or bridge cofactors.',
} as const

export const INTELLIGENCE_CADENCES: Record<CadenceId, CadenceDefinition> = {
  dose_adherence: {
    id: 'dose_adherence',
    label: 'DINA dose confirmations',
    interval: 'Daily',
    intervalDays: 1,
    role: 'window_adherence',
    roleLabel: 'Adherence layer',
    description:
      'Each medicine logged when the patient confirms it. Shows if they took it in the window TipTraQ set.',
    inputs: ['dose_confirm_tap', 'medication_window'],
    outputs: ['adherence_pct', 'window_hits', 'missed_doses'],
  },
  mlux_camera: {
    id: 'mlux_camera',
    label: 'MLux camera proxy',
    interval: 'Monthly',
    intervalDays: 30,
    role: 'maintains_estimate',
    roleLabel: 'Provisional DLMO bridge',
    description:
      'Phone light data updates your body-clock estimate each month between TipTraQ blocks.',
    inputs: ['ambient_light', 'screen_exposure', 'wake_sleep_times', 'latitude_season'],
    outputs: ['provisional_dlmo', 'melanopic_lux_estimate', 'light_alignment'],
  },
  blood_panel: {
    id: 'blood_panel',
    label: 'Blood panel',
    interval: 'Every 90 days',
    intervalDays: 90,
    role: 'confirms_response',
    roleLabel: 'Biological response gate',
    description: BLOOD_PANEL_CADENCE.role,
    inputs: BLOOD_PANEL_CADENCE.markers.map((m) => m.id),
    outputs: ['pth_status', 'vdr_activation', 'calcium_safety', 'cofactor_gaps'],
  },
  tiptraq: {
    id: 'tiptraq',
    label: 'TipTraQ three-night read',
    interval: 'Every 6 months',
    intervalMonths: 6,
    role: 'sets_clock',
    roleLabel: 'Clock calibration',
    description: TIPTRAQ_CALIBRATION.summary,
    inputs: ['three_night_sleep_study'],
    outputs: TIPTRAQ_CALIBRATION.outputs,
  },
}

/** Ordered stack — highest authority first */
export const INTELLIGENCE_LAYER_ORDER: readonly CadenceId[] = [
  'tiptraq',
  'blood_panel',
  'mlux_camera',
  'dose_adherence',
]

export const INTELLIGENCE_LAYER_SUMMARY =
  'TipTraQ sets your clock every six months. Bloods confirm response. Monthly phone scans bridge the gap. Daily medicine logs show if you hit your windows.'

export const CADENCE_TAGLINE = 'Four cadences. One intelligence stack.'

export const CADENCE_SUBLINE =
  'DAILY DOSE · MONTHLY MLUX · 90-DAY BLOODS · 6-MONTH TipTraQ'

/** Clinician-facing one-liner for cohort boards */
export const PRGC_CADENCE_LINE =
  'Sleep and REM from the last TipTraQ block. PTH from the 90-day panel. D3 timing from daily DINA confirmations.'

/** TipTraQ positioning — not continuous */
export const TIPTRAQ_POSITIONING =
  'Periodic clinical assessment — three nights every six months. Not a nightly feed.'
