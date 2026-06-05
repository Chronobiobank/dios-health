import type { SupabaseClient } from '@supabase/supabase-js'

import type { RetinomicTier } from '@/src/types'
import { resolveRetinomicTierFromCounts } from '@/lib/retinomic/sync-tier'

export function isPremiumDashboardPath(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return (
    normalized === '/dashboard/premium' || normalized.startsWith('/dashboard/premium/')
  )
}

export async function getPatientRetinomicTier(
  supabase: SupabaseClient,
  userId: string
): Promise<RetinomicTier> {
  const { data } = await supabase
    .from('patient_profiles')
    .select('retinomic_tier')
    .eq('id', userId)
    .maybeSingle<{ retinomic_tier: RetinomicTier | null }>()

  if (data?.retinomic_tier) {
    return data.retinomic_tier
  }

  const [{ count: bloodCount }, { count: tipTraqCount }] = await Promise.all([
    supabase
      .from('blood_circadian_panels')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', userId),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', userId),
  ])

  return resolveRetinomicTierFromCounts(bloodCount ?? 0, tipTraqCount ?? 0)
}

export function wantsJsonResponse(request: Request): boolean {
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('application/json')
}
