import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'
import { getProfileAvatarUrl } from '@/lib/profile/avatar'
import { createClient } from '@/lib/supabase/server'

export type UserProfileRow = {
  full_name: string | null
  role: 'patient' | 'clinician'
  avatar_path: string | null
  avatar_url: string | null
}

export type PatientProfileRow = {
  id: string
  first_name: string | null
  family_name: string | null
  age: number | null
  biological_sex: string | null
  fitzpatrick_type: number | null
  location_city: string | null
  location_country: string | null
  shift_worker: boolean
  shift_pattern: string | null
  chronotype_q1: string | null
  chronotype_q2: string | null
  chronotype_q3: string | null
  current_supplements: string[] | null
  wearable_connected: string | null
  data_share_gp: boolean
  data_share_research: boolean
  data_share_policy: boolean
  onboarding_complete: boolean
}

export async function requirePatientSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(AUTH_ROUTES.signIn)
  }

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_path')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null; role: 'patient' | 'clinician'; avatar_path: string | null }>()

  if (profileRow?.role === 'clinician') {
    redirect('/clinic')
  }

  const avatar_url = await getProfileAvatarUrl(supabase, profileRow?.avatar_path)
  const profile: UserProfileRow = {
    full_name: profileRow?.full_name ?? user.email?.split('@')[0] ?? 'Patient',
    role: 'patient',
    avatar_path: profileRow?.avatar_path ?? null,
    avatar_url,
  }

  const { data: patient } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<PatientProfileRow>()

  if (!patient) {
    redirect(AUTH_ROUTES.signUpPatient)
  }

  if (!patient.onboarding_complete) {
    redirect(AUTH_ROUTES.signUpPatient)
  }

  return {
    user,
    profile,
    patient,
  }
}
