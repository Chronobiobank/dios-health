export type BiologicalSex = 'female' | 'male' | 'intersex' | 'prefer_not_to_say'

export type PatientSignupDraft = {
  firstName: string
  familyName: string
  age: string
  email: string
  password: string
  locationCity: string
  locationCountry: string
  biologicalSex?: BiologicalSex | ''
  clinicalConsent: boolean
  researchConsent: boolean
}

export const INITIAL_PATIENT_SIGNUP_DRAFT: PatientSignupDraft = {
  firstName: '',
  familyName: '',
  age: '',
  email: '',
  password: '',
  locationCity: '',
  locationCountry: 'United Kingdom',
  biologicalSex: '',
  clinicalConsent: true,
  researchConsent: false,
}

export function patientProfileToDraft(
  row: Record<string, unknown>
): Partial<PatientSignupDraft> {
  return {
    firstName: typeof row.first_name === 'string' ? row.first_name : '',
    familyName: typeof row.family_name === 'string' ? row.family_name : '',
    age: typeof row.age === 'number' ? String(row.age) : '',
    biologicalSex: (row.biological_sex as PatientSignupDraft['biologicalSex']) ?? '',
    locationCity: typeof row.location_city === 'string' ? row.location_city : '',
    locationCountry: typeof row.location_country === 'string' ? row.location_country : 'United Kingdom',
    clinicalConsent: true,
    researchConsent: false,
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
    location_city: draft.locationCity.trim(),
    location_country: draft.locationCountry,
    onboarding_complete: true,
  }
}
