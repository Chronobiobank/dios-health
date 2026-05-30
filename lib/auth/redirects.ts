import type { SupabaseClient } from '@supabase/supabase-js'

import { AUTH_ROUTES, CLINIC_ROUTES, PATIENT_ROUTES } from './routes'

type ProfileRow = {
  role: 'patient' | 'clinician'
}

type ClinicianRow = {
  verified: boolean
}

export async function getPostAuthPath(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single<ProfileRow>()

  if (!profile) return PATIENT_ROUTES.dashboard

  if (profile.role === 'patient') {
    return PATIENT_ROUTES.dashboard
  }

  const { data: clinician } = await supabase
    .from('clinician_profiles')
    .select('verified')
    .eq('id', userId)
    .single<ClinicianRow>()

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
  return pathname === '/signin' || pathname.startsWith('/signup')
}

export function isSignupRoleChoicePath(pathname: string): boolean {
  return pathname === '/signup'
}

export function isPatientOnboardingPath(pathname: string): boolean {
  return pathname.startsWith('/signup/patient')
}

export function isClinicianOnboardingPath(pathname: string): boolean {
  return pathname.startsWith('/signup/clinician')
}

export async function hasPatientProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('patient_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  return Boolean(data)
}

export async function hasCompletedClinicianOnboarding(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('clinician_profiles')
    .select('onboarding_complete')
    .eq('id', userId)
    .maybeSingle<{ onboarding_complete: boolean }>()

  return Boolean(data?.onboarding_complete)
}
