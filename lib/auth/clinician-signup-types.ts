import type { RegistrationBody } from './clinician-signup-data'

export type ClinicianSignupDraft = {
  fullName: string
  email: string
  password: string
  practiceName: string
  practiceCity: string
  practiceCountry: string
  registrationBody: RegistrationBody | ''
  registrationNumber: string
  inviteEmail: string
}

export const INITIAL_CLINICIAN_SIGNUP_DRAFT: ClinicianSignupDraft = {
  fullName: '',
  email: '',
  password: '',
  practiceName: '',
  practiceCity: '',
  practiceCountry: 'United Kingdom',
  registrationBody: '',
  registrationNumber: '',
  inviteEmail: '',
}

export function draftToClinicianProfileStep1(userId: string, draft: ClinicianSignupDraft) {
  return {
    id: userId,
    practice_name: draft.practiceName.trim(),
    practice_address: `${draft.practiceCity.trim()}, ${draft.practiceCountry}`,
    verified: false,
    onboarding_complete: false,
  }
}

export function draftToClinicianCredentials(draft: ClinicianSignupDraft) {
  return {
    registration_body: draft.registrationBody,
    registration_number: draft.registrationNumber.trim(),
  }
}
