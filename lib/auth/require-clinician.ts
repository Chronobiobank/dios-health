import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'
import { getProfileAvatarUrl } from '@/lib/profile/avatar'
import { createClient } from '@/lib/supabase/server'

export type ClinicianUserProfileRow = {
  full_name: string | null
  role: 'clinician'
  avatar_path: string | null
  avatar_url: string | null
}

export async function requireClinicianSession() {
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

  if (profileRow?.role !== 'clinician') {
    redirect('/dashboard')
  }

  const avatar_url = await getProfileAvatarUrl(supabase, profileRow?.avatar_path)
  const profile: ClinicianUserProfileRow = {
    full_name: profileRow?.full_name ?? 'Clinician',
    role: 'clinician',
    avatar_path: profileRow?.avatar_path ?? null,
    avatar_url,
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
    profile,
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
