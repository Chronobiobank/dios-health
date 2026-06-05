import type { SupabaseClient } from '@supabase/supabase-js'

import { AUTH_ROUTES, CLINIC_ROUTES, PATIENT_ROUTES } from './routes'

type ProfileRow = {
  role: 'patient' | 'clinician'
}

type ClinicianRow = {
  verified: boolean
}

type PatientCompletionRow = {
  id: string
  onboarding_complete: boolean
  fitzpatrick_type: number | null
  chronotype_q1: string | null
}

export async function getPatientOnboardingPath(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const hasAccount = await hasPatientAccount(supabase, userId)
  if (!hasAccount) return AUTH_ROUTES.signUpPatient

  const completed = await hasPatientProfile(supabase, userId)
  return completed ? PATIENT_ROUTES.dashboard : AUTH_ROUTES.patientChronoprofile
}

export async function getPostAuthPath(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle<ProfileRow>()

  if (!profile) return AUTH_ROUTES.signUpPatient

  if (profile.role === 'patient') {
    return getPatientOnboardingPath(supabase, userId)
  }

  const onboardingComplete = await hasCompletedClinicianOnboarding(supabase, userId)
  if (!onboardingComplete) {
    return AUTH_ROUTES.signUpClinician
  }

  const { data: clinician } = await supabase
    .from('clinician_profiles')
    .select('verified')
    .eq('id', userId)
    .maybeSingle<ClinicianRow>()

  if (clinician?.verified) {
    return CLINIC_ROUTES.panel
  }

  return AUTH_ROUTES.pendingVerification
}

export function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/clinic') ||
    pathname === '/pending-verification'
  )
}

export function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === '/signin' ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth/')
  )
}

export function isRetinomicAuthPath(pathname: string): boolean {
  return pathname === '/auth/signin' || pathname === '/auth/signup'
}

export function isSignupRoleChoicePath(pathname: string): boolean {
  return pathname === '/signup' || pathname === '/signup/'
}

export function isPatientAccountSignupPath(pathname: string): boolean {
  return (
    pathname === AUTH_ROUTES.authSignUp ||
    pathname === `${AUTH_ROUTES.authSignUp}/` ||
    pathname === AUTH_ROUTES.legacySignUpPatient ||
    pathname === `${AUTH_ROUTES.legacySignUpPatient}/`
  )
}

export function isPatientChronoprofilePath(pathname: string): boolean {
  return (
    pathname === AUTH_ROUTES.patientChronoprofile ||
    pathname === `${AUTH_ROUTES.patientChronoprofile}/`
  )
}

export function isPatientOnboardingPath(pathname: string): boolean {
  return isPatientAccountSignupPath(pathname) || isPatientChronoprofilePath(pathname)
}

export function isClinicianOnboardingPath(pathname: string): boolean {
  return pathname.startsWith('/signup/clinician')
}

export async function hasPatientAccount(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('patient_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle<{ id: string }>()

  return Boolean(data?.id)
}

export async function hasPatientProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('patient_profiles')
    .select('id, onboarding_complete, fitzpatrick_type, chronotype_q1')
    .eq('id', userId)
    .maybeSingle<PatientCompletionRow>()

  return Boolean(
    data?.id &&
      data.onboarding_complete &&
      data.fitzpatrick_type != null &&
      data.chronotype_q1
  )
}

export async function hasCompletedClinicianOnboarding(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('clinician_profiles')
    .select('onboarding_complete, first_name')
    .eq('id', userId)
    .maybeSingle<{ onboarding_complete: boolean; first_name: string | null }>()

  return Boolean(data?.onboarding_complete && data.first_name)
}

/** Avoid ERR_TOO_MANY_REDIRECTS when destination is already the current path */
export function shouldRedirectTo(pathname: string, destination: string): boolean {
  const normalize = (path: string) =>
    path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path

  return normalize(pathname) !== normalize(destination)
}
