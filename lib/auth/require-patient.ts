import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

export type PatientProfileRow = {
  id: string
  fitzpatrick_type: number | null
  location_city: string | null
  location_country: string | null
  shift_worker: boolean
  shift_pattern: string | null
  chronotype_q1: string | null
  chronotype_q2: string | null
  chronotype_q3: string | null
  wearable_connected: string | null
  data_share_gp: boolean
  data_share_research: boolean
  data_share_policy: boolean
}

export async function requirePatientSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(AUTH_ROUTES.signIn)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null; role: 'patient' | 'clinician' }>()

  if (profile?.role === 'clinician') {
    redirect('/clinic')
  }

  const { data: patient } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<PatientProfileRow>()

  if (!patient) {
    redirect(AUTH_ROUTES.signUpPatient)
  }

  return {
    user,
    profile: profile ?? { full_name: user.email?.split('@')[0] ?? 'Patient', role: 'patient' as const },
    patient,
  }
}
