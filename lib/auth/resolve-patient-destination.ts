import type { SupabaseClient } from '@supabase/supabase-js'

import { getPatientOnboardingPath } from '@/lib/auth/redirects'
import { getPatientRetinomicTier } from '@/lib/auth/retinomic-access'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

/**
 * Post-auth routing — premium tier lands on full dashboard (not upgrade teasers).
 */
export async function resolvePatientAuthDestination(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const onboardingPath = await getPatientOnboardingPath(supabase, userId)
  if (onboardingPath !== PATIENT_ROUTES.dashboard) {
    return onboardingPath
  }

  const tier = await getPatientRetinomicTier(supabase, userId)
  if (tier === 'PREMIUM_VERIFICATION') {
    return PATIENT_ROUTES.dashboard
  }

  return PATIENT_ROUTES.dashboard
}
