import type { RegistrationBody } from './clinician-signup-data'
import { buildFullName } from './parse-oauth-names'

export type ClinicianSignupDraft = {
  firstName: string
  familyName: string
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
  firstName: '',
  familyName: '',
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
    first_name: draft.firstName.trim(),
    family_name: draft.familyName.trim(),
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

export function clinicianProfileToDraft(
  row: Record<string, unknown>
): Partial<ClinicianSignupDraft> {
  const address = typeof row.practice_address === 'string' ? row.practice_address : ''
  const [practiceCity = '', practiceCountry = 'United Kingdom'] = address.split(',').map((part) => part.trim())

  return {
    firstName: typeof row.first_name === 'string' ? row.first_name : '',
    familyName: typeof row.family_name === 'string' ? row.family_name : '',
    practiceName: typeof row.practice_name === 'string' ? row.practice_name : '',
    practiceCity,
    practiceCountry: practiceCountry || 'United Kingdom',
    registrationBody: (row.registration_body as ClinicianSignupDraft['registrationBody']) ?? '',
    registrationNumber: typeof row.registration_number === 'string' ? row.registration_number : '',
  }
}

export function getClinicianDisplayName(draft: ClinicianSignupDraft): string {
  return buildFullName(draft.firstName, draft.familyName)
}
