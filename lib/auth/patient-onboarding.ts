export type PatientProfileResumeRow = {
  first_name: string | null
  fitzpatrick_type: number | null
  chronotype_q1: string | null
  onboarding_complete: boolean
}

export function getPatientResumeStep(
  patient: PatientProfileResumeRow | null,
  signedUpWithOAuth: boolean
): number {
  if (!patient?.first_name) {
    return signedUpWithOAuth ? 2 : 1
  }

  if (!patient.fitzpatrick_type) {
    return 3
  }

  if (!patient.chronotype_q1) {
    return 4
  }

  if (!patient.onboarding_complete) {
    return 5
  }

  return 1
}

export function isPatientOnboardingComplete(
  patient: PatientProfileResumeRow | null | undefined
): boolean {
  return Boolean(patient?.onboarding_complete)
}
