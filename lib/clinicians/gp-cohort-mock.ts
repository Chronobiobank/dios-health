/** GP cohort triage mock — Monday morning review, 12 patients, red → amber → green. */

export type GpTriageBand = 'needs_review' | 'watch' | 'on_track'

export type GpTimingConflict = {
  drugs: string
  averageSeparationMinutes: number
  requiredSeparationMinutes: number
  detail: string
}

export type GpCohortPatient = {
  id: string
  ref: string
  name: string
  age: number
  band: GpTriageBand
  /** One-line reason visible in the queue */
  headline: string
  medications: string[]
  dlmo: string | null
  chronopenicBurden: string | null
  labs: { label: string; value: string; trend?: string }[]
  timingConflict: GpTimingConflict | null
  clinicalInsight: string
  recommendedAction: string
  /** Clinician–DINA handoff — what DINA has already done */
  dinaNote: string
  /** Draft for Message via DINA — plain English, one specific action */
  dinaDraftMessage: string
  exportSummary: string
  labsToOrder: string[]
}

const BAND_ORDER: Record<GpTriageBand, number> = {
  needs_review: 0,
  watch: 1,
  on_track: 2,
}

export const GP_COHORT_MOCK: readonly GpCohortPatient[] = [
  {
    id: 'patricia-hennessy',
    ref: 'GP-014',
    name: 'Patricia Hennessy',
    age: 58,
    band: 'needs_review',
    headline: 'Rising TSH — thyroid tablet and iron taken too close together',
    medications: ['Levothyroxine 75 mcg', 'Ferrous sulphate 200 mg', 'Ramipril 5 mg'],
    dlmo: '22:14',
    chronopenicBurden: '+1.8 y',
    labs: [
      { label: 'TSH', value: '6.2 mIU/L', trend: 'up from 4.8 (12 wk)' },
      { label: 'Free T4', value: '14 pmol/L', trend: 'flat' },
    ],
    timingConflict: {
      drugs: 'Levothyroxine · iron',
      averageSeparationMinutes: 12,
      requiredSeparationMinutes: 240,
      detail:
        'Iron and thyroid tablet compete in the gut — twelve minutes average separation against four hours required.',
    },
    clinicalInsight:
      'Rising TSH is almost certainly absorption failure, not under-dosing. Without DIOS, the likely action is dose escalation. With DIOS, separate timings and educate via DINA — no prescription change.',
    recommendedAction: 'Timing education via DINA. Hold dose change. Repeat thyroid panel in six weeks.',
    dinaNote:
      'DINA flagged the iron conflict on 2 Jun and asked Patricia to move iron to lunch. She confirmed the change yesterday. Awaiting separation window to widen.',
    dinaDraftMessage:
      'Patricia, keep your thyroid tablet at 7am on an empty stomach. Take your iron tablet at lunch — at least four hours later. They compete in the gut and this is likely why your thyroid results are drifting. Keep the same thyroid dose for now.',
    exportSummary: `Patricia Hennessy (58) — GP-014
Triage: Needs review
Issue: Rising TSH (4.8 → 6.2) with levothyroxine–iron separation 12 min vs 240 min required.
DIOS action: DINA timing education sent — iron moved to lunch 3 Jun.
Clinician recommendation: No dose change. Repeat TSH + Free T4 in 6 weeks.`,
    labsToOrder: ['TSH', 'Free T4'],
  },
  {
    id: 'david-okafor',
    ref: 'GP-022',
    name: 'David Okafor',
    age: 64,
    band: 'needs_review',
    headline: 'Non-dipping pattern — blood pressure tablet still at breakfast',
    medications: ['Ramipril 10 mg', 'Amlodipine 5 mg', 'Atorvastatin 20 mg'],
    dlmo: '23:02',
    chronopenicBurden: '+2.4 y',
    labs: [
      { label: 'Clinic BP', value: '148/92', trend: 'stable' },
      { label: 'Night dip', value: '4%', trend: 'non-dipper' },
    ],
    timingConflict: null,
    clinicalInsight:
      'TipTraQ shows non-dipping overnight. Morning ramipril misses the nocturnal window — Hygia-class bedtime dosing not yet adopted.',
    recommendedAction: 'Review bedtime antihypertensive timing with patient via DINA.',
    dinaNote:
      'DINA proposed moving ramipril to 21:30 based on DLMO+1h. Patient has not confirmed the change.',
    dinaDraftMessage:
      'David, your blood pressure tablet works best in the evening for your body clock — around 9:30pm, not breakfast. This helps overnight dipping. Try this for two weeks and we will review your readings.',
    exportSummary: `David Okafor (64) — GP-022
Triage: Needs review
Issue: Non-dipping BP pattern; ramipril at 08:00 vs DLMO+1h window 21:30.
DIOS action: Bedtime timing proposed — awaiting patient confirmation.`,
    labsToOrder: ['U&E', 'eGFR'],
  },
  {
    id: 'margaret-walsh',
    ref: 'GP-031',
    name: 'Margaret Walsh',
    age: 71,
    band: 'needs_review',
    headline: 'PPI taken at evening default — morning acid surge missed',
    medications: ['Omeprazole 20 mg', 'Aspirin 75 mg', 'Metformin 500 mg'],
    dlmo: '21:48',
    chronopenicBurden: '+1.2 y',
    labs: [{ label: 'HbA1c', value: '52 mmol/mol', trend: 'up 3' }],
    timingConflict: {
      drugs: 'Omeprazole · breakfast',
      averageSeparationMinutes: 0,
      requiredSeparationMinutes: 60,
      detail: 'PPI taken at 20:00 label default — pre-dawn acid window opens 06:30 for her phase.',
    },
    clinicalInsight:
      'Reflux symptoms worsening despite compliant PPI use. Window error estimated 30–50% efficacy loss.',
    recommendedAction: 'Move omeprazole to 06:15 via DINA. Review symptoms in 4 weeks.',
    dinaNote: 'DINA identified PPI window mismatch on 1 Jun. Sent morning timing instruction — not yet logged as taken.',
    dinaDraftMessage:
      'Margaret, take your omeprazole around 6:15am — before your acid surge — not in the evening. Take it half an hour before breakfast with water.',
    exportSummary: `Margaret Walsh (71) — GP-031
Triage: Needs review
Issue: PPI at 20:00 vs biological pre-acid window 06:15.
DIOS action: Morning timing instruction sent 1 Jun.`,
    labsToOrder: ['FBC', 'HbA1c'],
  },
  {
    id: 'tomas-v',
    ref: 'GP-008',
    name: 'Tomás V.',
    age: 52,
    band: 'watch',
    headline: 'Statin window slipping — two late doses this week',
    medications: ['Atorvastatin 40 mg', 'Sertraline 50 mg'],
    dlmo: '22:36',
    chronopenicBurden: '+0.9 y',
    labs: [{ label: 'LDL', value: '2.8 mmol/L', trend: 'stable' }],
    timingConflict: null,
    clinicalInsight: 'Adherence within window at 71% over 7 days — liver synthesis peak missed twice.',
    recommendedAction: 'Reinforce 21:45 statin window via DINA.',
    dinaNote: 'DINA sent two evening reminders. Patient acknowledged one missed dose — advised skip, not catch-up.',
    dinaDraftMessage:
      'Tomás, take your statin around 9:45pm when your liver timing window opens. If you miss it, skip until tonight — do not take it in the morning.',
    exportSummary: `Tomás V. (52) — GP-008\nTriage: Watch\nIssue: Statin window adherence 71% (7d).`,
    labsToOrder: ['Lipid panel'],
  },
  {
    id: 'marcus-h',
    ref: 'GP-019',
    name: 'Marcus H.',
    age: 49,
    band: 'watch',
    headline: 'Metformin before breakfast — peripheral clock still delayed',
    medications: ['Metformin 500 mg BD', 'Vitamin D3 2000 IU'],
    dlmo: '22:15',
    chronopenicBurden: '+1.1 y',
    labs: [{ label: 'HbA1c', value: '48 mmol/mol', trend: 'flat' }],
    timingConflict: null,
    clinicalInsight: 'Morning metformin taken at 07:00 wall clock — biological breakfast window 08:20.',
    recommendedAction: 'Nudge breakfast dose to 08:15 via DINA.',
    dinaNote: 'DINA adjusted breakfast reminder to 08:15 on 30 May. Patient followed 4 of 7 days.',
    dinaDraftMessage:
      'Marcus, take your morning metformin around 8:15am with breakfast — that matches when your body handles glucose best.',
    exportSummary: `Marcus H. (49) — GP-019\nTriage: Watch\nIssue: Metformin 55 min early vs biological breakfast window.`,
    labsToOrder: ['HbA1c'],
  },
  {
    id: 'claire-m',
    ref: 'GP-006',
    name: 'Claire M.',
    age: 44,
    band: 'watch',
    headline: 'Evening light exposure pushing DLMO later',
    medications: ['Atorvastatin 20 mg'],
    dlmo: '23:18',
    chronopenicBurden: '+0.7 y',
    labs: [],
    timingConflict: null,
    clinicalInsight: 'MLux shows 45 min phase delay over 14 days — statin window drifting later.',
    recommendedAction: 'Evening light curfew coaching via DINA.',
    dinaNote: 'DINA recommended screens-off at 21:00. Patient logged curfew 3 of 7 nights.',
    dinaDraftMessage:
      'Claire, dim your lights and screens by 9pm this week. Your medication windows shift later when your body clock drifts — this helps keep your statin timing steady.',
    exportSummary: `Claire M. (44) — GP-006\nTriage: Watch\nIssue: Phase delay +45 min; statin window drift.`,
    labsToOrder: [],
  },
  {
    id: 'david-kim',
    ref: 'GP-011',
    name: 'David Kim',
    age: 55,
    band: 'watch',
    headline: 'Morning D3 below MLux gate — titration paused',
    medications: ['Vitamin D3 4000 IU', 'Ramipril 2.5 mg'],
    dlmo: '22:02',
    chronopenicBurden: '+1.0 y',
    labs: [{ label: '25(OH)D', value: '62 nmol/L', trend: 'stable' }],
    timingConflict: null,
    clinicalInsight: 'Morning melanopic score below target 3 of 5 days — D3 absorption window suboptimal.',
    recommendedAction: 'First Light scan adherence via DINA before dose increase.',
    dinaNote: 'DINA paused D3 escalation reminder until morning scan streak returns.',
    dinaDraftMessage:
      'David, complete your First Light scan before 9am for the next five days. Your D3 window depends on morning light — we will review your dose after that.',
    exportSummary: `David Kim (55) — GP-011\nTriage: Watch\nIssue: Morning MLux gate — D3 titration paused.`,
    labsToOrder: ['25(OH)D'],
  },
  {
    id: 'sean-james',
    ref: 'SEAN-001',
    name: 'Sean James',
    age: 47,
    band: 'on_track',
    headline: 'All windows aligned — First Light streak 12 days',
    medications: ['Metformin 500 mg', 'Atorvastatin 20 mg', 'Vitamin D3 22k IU'],
    dlmo: '22:57',
    chronopenicBurden: '+1.4 y',
    labs: [{ label: 'HbA1c', value: '46 mmol/mol', trend: 'down' }],
    timingConflict: null,
    clinicalInsight: 'Chronotherapy windows confirmed. Chronoimmune Zone 2 — PTH trending to lower third.',
    recommendedAction: 'No action required. Next routine review 15 Jul.',
    dinaNote:
      'DINA sequenced thyroid-before-D3 pattern for demo stack. Magnesium moved to evening. Last check-in 4 Jun — all windows confirmed.',
    dinaDraftMessage:
      'Sean, your windows are all on track this week. Keep your evening statin at 9:45pm and morning D3 after your scan.',
    exportSummary: `Sean James (47) — SEAN-001\nTriage: On track\nAll medication windows aligned. Next review 15 Jul.`,
    labsToOrder: [],
  },
  {
    id: 'amara-singh',
    ref: 'GP-003',
    name: 'Amara Singh',
    age: 39,
    band: 'on_track',
    headline: 'Bedtime ramipril confirmed — dipping restored',
    medications: ['Ramipril 5 mg', 'Metformin 500 mg'],
    dlmo: '22:08',
    chronopenicBurden: '+0.4 y',
    labs: [{ label: 'Night dip', value: '12%', trend: 'improved' }],
    timingConflict: null,
    clinicalInsight: 'Moved ramipril to DLMO+1h six weeks ago — dipping pattern normalised.',
    recommendedAction: 'Continue current timing. Annual review.',
    dinaNote: 'DINA confirmed bedtime ramipril adherence 94% over 30 days.',
    dinaDraftMessage:
      'Amara, your blood pressure timing is working well — keep taking ramipril at 9:15pm.',
    exportSummary: `Amara Singh (39) — GP-003\nTriage: On track\nBedtime ramipril — dipping restored.`,
    labsToOrder: [],
  },
  {
    id: 'helena-costa',
    ref: 'GP-005',
    name: 'Helena Costa',
    age: 61,
    band: 'on_track',
    headline: 'PPI morning window — reflux settled',
    medications: ['Lansoprazole 15 mg', 'Amlodipine 5 mg'],
    dlmo: '21:55',
    chronopenicBurden: '+0.6 y',
    labs: [],
    timingConflict: null,
    clinicalInsight: 'PPI moved to pre-acid window 8 weeks ago — symptom diary clear.',
    recommendedAction: 'Continue. Review PPI step-down in 3 months.',
    dinaNote: 'DINA logged PPI at 06:20 daily for 28 consecutive days.',
    dinaDraftMessage:
      'Helena, keep taking your stomach tablet at 6:20am — your reflux diary looks clear this month.',
    exportSummary: `Helena Costa (61) — GP-005\nTriage: On track\nPPI morning window — symptoms settled.`,
    labsToOrder: [],
  },
  {
    id: 'fatima-al-rashid',
    ref: 'GP-007',
    name: 'Fatima Al-Rashid',
    age: 43,
    band: 'on_track',
    headline: 'GLP-1 and metformin sequenced correctly',
    medications: ['Metformin 1 g', 'Semaglutide 0.5 mg'],
    dlmo: '22:22',
    chronopenicBurden: '+0.5 y',
    labs: [{ label: 'HbA1c', value: '44 mmol/mol', trend: 'down' }],
    timingConflict: null,
    clinicalInsight: 'Metformin at biological breakfast; GLP-1 weekly — no conflicts flagged.',
    recommendedAction: 'No action required.',
    dinaNote: 'DINA confirmed metformin window and weekly GLP-1 reminder on schedule.',
    dinaDraftMessage:
      'Fatima, your diabetes tablets are timed correctly — no changes needed this week.',
    exportSummary: `Fatima Al-Rashid (43) — GP-007\nTriage: On track\nMetformin + GLP-1 windows aligned.`,
    labsToOrder: [],
  },
  {
    id: 'yuki-tanaka',
    ref: 'GP-009',
    name: 'Yuki Tanaka',
    age: 36,
    band: 'on_track',
    headline: 'SSRI at DLMO+2h — sleep and mood stable',
    medications: ['Escitalopram 10 mg'],
    dlmo: '23:05',
    chronopenicBurden: '+0.3 y',
    labs: [],
    timingConflict: null,
    clinicalInsight: 'Evening-type SSRI timing at 22:40 — patient-reported activation resolved.',
    recommendedAction: 'Continue. Routine PHQ review at next appointment.',
    dinaNote: 'DINA placed SSRI at DLMO+2h on onboarding. Patient reports improved sleep onset.',
    dinaDraftMessage:
      'Yuki, keep taking your mood tablet around 10:40pm — it matches your body clock and is working well.',
    exportSummary: `Yuki Tanaka (36) — GP-009\nTriage: On track\nSSRI at DLMO+2h — stable.`,
    labsToOrder: [],
  },
] as const

export const GP_COHORT_DEFAULT_PATIENT_ID = 'patricia-hennessy'

export function getSortedGpCohort(): GpCohortPatient[] {
  return [...GP_COHORT_MOCK].sort((a, b) => {
    const bandDelta = BAND_ORDER[a.band] - BAND_ORDER[b.band]
    if (bandDelta !== 0) return bandDelta
    return a.name.localeCompare(b.name)
  })
}

export function getGpCohortPatient(id: string): GpCohortPatient | undefined {
  return GP_COHORT_MOCK.find((p) => p.id === id)
}

export function getGpCohortSummary(cohort: readonly GpCohortPatient[] = GP_COHORT_MOCK) {
  return {
    needsReview: cohort.filter((p) => p.band === 'needs_review').length,
    watch: cohort.filter((p) => p.band === 'watch').length,
    onTrack: cohort.filter((p) => p.band === 'on_track').length,
    total: cohort.length,
  }
}

export const GP_TRIAGE_BAND_LABEL: Record<GpTriageBand, string> = {
  needs_review: 'Needs review',
  watch: 'Watch',
  on_track: 'On track',
}
