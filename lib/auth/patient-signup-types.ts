export type PatientSignupDraft = {
  fullName: string
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
  fullName: '',
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

export function draftToPatientProfile(userId: string, draft: PatientSignupDraft) {
  return {
    id: userId,
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
