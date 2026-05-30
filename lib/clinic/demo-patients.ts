export type PatientStatus = 'Act now' | 'Earlier dose' | 'Need bloods' | 'On track'

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
}

export const DEMO_CLINIC_PATIENTS: DemoClinicPatient[] = [
  {
    id: 'demo-margaret-t',
    displayName: 'Margaret T, 58',
    name: 'Margaret T',
    age: 58,
    drug: 'Ramipril 5mg',
    finding: 'Blood pressure is not dipping overnight on current morning dosing',
    bodyClock: 'Night owl chronotype running 1.2 hours late',
    data: 'Wearable shows non-dipping on six of seven nights',
    status: 'Act now',
    action: 'Move ramipril to bedtime tonight',
    needsAction: true,
    urgency: 1,
  },
  {
    id: 'demo-james-o',
    displayName: 'James O., 44',
    name: 'James O.',
    age: 44,
    drug: 'Simvastatin 20mg',
    finding: 'Statin is being taken too early for his liver clock',
    bodyClock: 'Standard chronotype and on track otherwise',
    data: 'Wearable stream complete and current',
    status: 'Earlier dose',
    action: 'Shift simvastatin to evening dosing',
    needsAction: true,
    urgency: 2,
  },
  {
    id: 'demo-priya-n',
    displayName: 'Priya N., 61',
    name: 'Priya N.',
    age: 61,
    drug: 'Prednisolone 5mg',
    finding: 'Vitamin D result is missing before timing can be confirmed',
    bodyClock: 'Chronotype unknown until blood panel returns',
    data: 'City Labs blood panel still pending',
    status: 'Need bloods',
    action: 'Order City Labs panel before next review',
    needsAction: true,
    urgency: 3,
  },
  {
    id: 'demo-david-k',
    displayName: 'David K., 52',
    name: 'David K.',
    age: 52,
    drug: 'Simvastatin 10mg',
    finding: 'Current medicine timing matches his body clock',
    bodyClock: 'Aligned chronotype and stable drift index',
    data: 'All data streams live and complete',
    status: 'On track',
    action: 'No dose timing change needed today',
    needsAction: false,
    urgency: 4,
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
