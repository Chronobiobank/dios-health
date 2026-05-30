export type BiologicalSex = 'female' | 'male' | 'intersex' | 'prefer_not_to_say'

export type PatientSignupDraft = {
  firstName: string
  familyName: string
  age: string
  biologicalSex: BiologicalSex | ''
  email: string
  password: string
  fitzpatrickType: number | null
  locationCity: string
  locationCountry: string
  shiftWorker: boolean
  shiftPattern: string
  chronotypeQ1: string
  chronotypeQ2: string
  chronotypeQ3: string
  wearableConnected: string | null
  dataShareGp: boolean
  dataShareResearch: boolean
  dataSharePolicy: boolean
}

export const INITIAL_PATIENT_SIGNUP_DRAFT: PatientSignupDraft = {
  firstName: '',
  familyName: '',
  age: '',
  biologicalSex: '',
  email: '',
  password: '',
  fitzpatrickType: null,
  locationCity: '',
  locationCountry: 'United Kingdom',
  shiftWorker: false,
  shiftPattern: '',
  chronotypeQ1: '',
  chronotypeQ2: '',
  chronotypeQ3: '',
  wearableConnected: null,
  dataShareGp: false,
  dataShareResearch: false,
  dataSharePolicy: false,
}

export function buildFullName(firstName: string, familyName: string): string {
  return [firstName.trim(), familyName.trim()].filter(Boolean).join(' ')
}

export function patientProfileToDraft(
  row: Record<string, unknown>
): Partial<PatientSignupDraft> {
  return {
    firstName: typeof row.first_name === 'string' ? row.first_name : '',
    familyName: typeof row.family_name === 'string' ? row.family_name : '',
    age: typeof row.age === 'number' ? String(row.age) : '',
    biologicalSex: (row.biological_sex as PatientSignupDraft['biologicalSex']) ?? '',
    fitzpatrickType: typeof row.fitzpatrick_type === 'number' ? row.fitzpatrick_type : null,
    locationCity: typeof row.location_city === 'string' ? row.location_city : '',
    locationCountry: typeof row.location_country === 'string' ? row.location_country : 'United Kingdom',
    shiftWorker: Boolean(row.shift_worker),
    shiftPattern: typeof row.shift_pattern === 'string' ? row.shift_pattern : '',
    chronotypeQ1: typeof row.chronotype_q1 === 'string' ? row.chronotype_q1 : '',
    chronotypeQ2: typeof row.chronotype_q2 === 'string' ? row.chronotype_q2 : '',
    chronotypeQ3: typeof row.chronotype_q3 === 'string' ? row.chronotype_q3 : '',
    wearableConnected: typeof row.wearable_connected === 'string' ? row.wearable_connected : null,
    dataShareGp: Boolean(row.data_share_gp),
    dataShareResearch: Boolean(row.data_share_research),
    dataSharePolicy: Boolean(row.data_share_policy),
  }
}

export function draftToPatientProfile(userId: string, draft: PatientSignupDraft) {
  const age = Number.parseInt(draft.age, 10)

  return {
    id: userId,
    first_name: draft.firstName.trim(),
    family_name: draft.familyName.trim(),
    age: Number.isFinite(age) ? age : null,
    biological_sex: draft.biologicalSex || null,
    fitzpatrick_type: draft.fitzpatrickType,
    location_city: draft.locationCity.trim(),
    location_country: draft.locationCountry,
    shift_worker: draft.shiftWorker,
    shift_pattern: draft.shiftWorker ? draft.shiftPattern : null,
    chronotype_q1: draft.chronotypeQ1,
    chronotype_q2: draft.chronotypeQ2,
    chronotype_q3: draft.chronotypeQ3,
    wearable_connected: draft.wearableConnected,
    data_share_gp: draft.dataShareGp,
    data_share_research: draft.dataShareResearch,
    data_share_policy: draft.dataSharePolicy,
  }
}
