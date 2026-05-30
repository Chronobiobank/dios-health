import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

export async function requireClinicianSession() {
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

  if (profile?.role !== 'clinician') {
    redirect('/dashboard')
  }

  const { data: clinician } = await supabase
    .from('clinician_profiles')
    .select('verified, onboarding_complete, family_name')
    .eq('id', user.id)
    .maybeSingle<{ verified: boolean; onboarding_complete: boolean; family_name: string | null }>()

  if (!clinician?.onboarding_complete) {
    redirect(AUTH_ROUTES.signUpClinician)
  }

  if (!clinician.verified) {
    redirect(AUTH_ROUTES.pendingVerification)
  }

  return {
    user,
    profile: profile ?? { full_name: 'Clinician', role: 'clinician' as const },
    clinician,
  }
}

export function getClinicianSurname(fullName: string, familyName?: string | null): string {
  const direct = familyName?.trim()
  if (direct) return direct

  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Clinician'
  return parts[parts.length - 1] ?? 'Clinician'
}
