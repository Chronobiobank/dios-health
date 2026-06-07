export type PatientStatus = 'Act now' | 'Earlier dose' | 'Need bloods' | 'On track'

export type DemoSpectrumNode = {
  label: string
  risk: 'low' | 'moderate' | 'elevated' | 'high'
}

export type DemoClinicPatient = {
  id: string
  displayName: string
  name: string
  age: number
  drug: string
  finding: string
  bodyClock: string
  data: string
  status: PatientStatus
  action: string
  needsAction: boolean
  urgency: number
  mluxScore: number
  mluxTrend: 'improving' | 'declining' | 'stable'
  adherenceRate: number
  vayaSessionsLast30: number
  lastSessionHoursAgo: number
  chronotype: string
  topRiskNodes: DemoSpectrumNode[]
  layerConfidence: 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'
  alertReason: string | null
}

export const DEMO_CLINIC_PATIENTS: DemoClinicPatient[] = [
  {
    id: 'demo-margaret-t',
    displayName: 'Margaret T, 58',
    name: 'Margaret T',
    age: 58,
    drug: 'Ramipril 5mg',
    finding: 'Blood pressure not dipping overnight on current morning dosing',
    bodyClock: 'Evening type · Running 1.2h delayed',
    data: 'TipTraQ · 14 nights · Confirmed',
    status: 'Act now',
    action: 'Move ramipril to bedtime — optimal window 23:15',
    needsAction: true,
    urgency: 1,
    mluxScore: 87,
    mluxTrend: 'declining',
    adherenceRate: 71,
    vayaSessionsLast30: 26,
    lastSessionHoursAgo: 3,
    chronotype: 'Evening type',
    layerConfidence: 'CONFIRMED',
    alertReason:
      'Non-dipping pattern confirmed on 6 of last 7 nights. Ramipril taken 07:00 — optimal window is 23:15.',
    topRiskNodes: [
      { label: 'Blood pressure', risk: 'high' },
      { label: 'Body clock', risk: 'elevated' },
      { label: 'Brain health', risk: 'moderate' },
    ],
  },
  {
    id: 'demo-james-o',
    displayName: 'James O., 44',
    name: 'James O.',
    age: 44,
    drug: 'Simvastatin 20mg',
    finding: 'Statin taken too early for his liver clock — sub-optimal cholesterol reduction',
    bodyClock: 'Intermediate type · Aligned',
    data: 'TipTraQ · 9 nights · Precision',
    status: 'Earlier dose',
    action: 'Shift simvastatin to 22:30 — DLMO confirmed at 21:10',
    needsAction: true,
    urgency: 2,
    mluxScore: 203,
    mluxTrend: 'stable',
    adherenceRate: 88,
    vayaSessionsLast30: 28,
    lastSessionHoursAgo: 1,
    chronotype: 'Intermediate type',
    layerConfidence: 'PRECISION',
    alertReason:
      'Simvastatin taken at 19:00. Liver clock phase puts optimal window at 22:30. Missing 3.5h of peak hepatic activity.',
    topRiskNodes: [
      { label: 'Blood sugar', risk: 'moderate' },
      { label: 'Body clock', risk: 'low' },
      { label: 'Sleep quality', risk: 'low' },
    ],
  },
  {
    id: 'demo-priya-n',
    displayName: 'Priya N., 61',
    name: 'Priya N.',
    age: 61,
    drug: 'Prednisolone 5mg',
    finding: 'Vitamin D below Gominak optimal — VDR resistance likely affecting immune timing',
    bodyClock: 'Morning type · Chronotype estimated',
    data: 'Blood panel pending · DINA only',
    status: 'Need bloods',
    action: 'Order Gominak panel — vitamin D and co-factors needed before dose timing',
    needsAction: true,
    urgency: 3,
    mluxScore: 312,
    mluxTrend: 'improving',
    adherenceRate: 94,
    vayaSessionsLast30: 29,
    lastSessionHoursAgo: 5,
    chronotype: 'Morning type',
    layerConfidence: 'ESTIMATED',
    alertReason:
      'Prednisolone timing cannot be confirmed without vitamin D status. Blood panel needed before chronodosing adjustment.',
    topRiskNodes: [
      { label: 'Immune flare risk', risk: 'elevated' },
      { label: 'Blood sugar', risk: 'moderate' },
      { label: 'Blood pressure', risk: 'moderate' },
    ],
  },
  {
    id: 'demo-david-k',
    displayName: 'David K., 52',
    name: 'David K.',
    age: 52,
    drug: 'Simvastatin 10mg',
    finding: 'Medication timing aligned with body clock — no action needed',
    bodyClock: 'Intermediate type · Stable',
    data: 'TipTraQ · 21 nights · Confirmed',
    status: 'On track',
    action: 'No dose timing change needed — review in 30 days',
    needsAction: false,
    urgency: 4,
    mluxScore: 267,
    mluxTrend: 'stable',
    adherenceRate: 97,
    vayaSessionsLast30: 30,
    lastSessionHoursAgo: 2,
    chronotype: 'Intermediate type',
    layerConfidence: 'CONFIRMED',
    alertReason: null,
    topRiskNodes: [
      { label: 'Body clock', risk: 'low' },
      { label: 'Sleep quality', risk: 'low' },
      { label: 'Blood pressure', risk: 'low' },
    ],
  },
  {
    id: 'demo-sarah-b',
    displayName: 'Sarah B., 67',
    name: 'Sarah B.',
    age: 67,
    drug: 'Metformin 500mg',
    finding: 'Morning light score critically low — T2DM risk elevated per UK Biobank profile',
    bodyClock: 'Evening type · Running 2.1h delayed',
    data: 'DINA only · 23 sessions',
    status: 'Act now',
    action: 'Prescribe morning light protocol — 30 min outdoor exposure before 09:00',
    needsAction: true,
    urgency: 1,
    mluxScore: 54,
    mluxTrend: 'declining',
    adherenceRate: 79,
    vayaSessionsLast30: 23,
    lastSessionHoursAgo: 6,
    chronotype: 'Evening type',
    layerConfidence: 'ESTIMATED',
    alertReason:
      'MLux score 54 m-EDI — critically below 250 target for 11 consecutive days. UK Biobank data links this pattern to elevated T2DM risk independent of other factors.',
    topRiskNodes: [
      { label: 'Blood sugar', risk: 'high' },
      { label: 'Body clock', risk: 'elevated' },
      { label: 'Sleep quality', risk: 'elevated' },
    ],
  },
]

export function getNeedsActionCount(patients: DemoClinicPatient[]): number {
  return patients.filter((patient) => patient.needsAction).length
}

export function getNeedsActionPatients(patients: DemoClinicPatient[]): DemoClinicPatient[] {
  return patients
    .filter((patient) => patient.needsAction)
    .sort((a, b) => a.urgency - b.urgency)
}
