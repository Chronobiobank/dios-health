import type { SupabaseClient } from '@supabase/supabase-js'

import type { BiochemicalFuel, RetinomicTier } from '@/src/types'
import { vitaminD3NmolToNgMl } from '@/lib/retinomic/photic-dose'

export function resolveRetinomicTierFromCounts(
  bloodPanelsCount: number,
  tipTraqNightsCount: number
): RetinomicTier {
  if (bloodPanelsCount > 0 && tipTraqNightsCount > 0) {
    return 'PREMIUM_VERIFICATION'
  }
  return 'FREE_SCREENING'
}

type LatestBloodRow = {
  vitamin_d3_nmoll: number | null
  vitamin_b5_umoll: number | null
}

export function biochemicalFuelFromPanel(row: LatestBloodRow | null): BiochemicalFuel | null {
  if (!row) return null
  return {
    vitaminD3:
      row.vitamin_d3_nmoll != null ? vitaminD3NmolToNgMl(row.vitamin_d3_nmoll) : null,
    vitaminB5: row.vitamin_b5_umoll ?? null,
  }
}

/** Recompute tier + biochemical_fuel from streams and persist on patient_profiles. */
export async function syncRetinomicPatientState(
  supabase: SupabaseClient,
  patientId: string
): Promise<{ tier: RetinomicTier; error: string | null }> {
  const [{ count: bloodCount }, { count: tipTraqCount }, { data: latestBlood }] = await Promise.all([
    supabase
      .from('blood_circadian_panels')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId),
    supabase
      .from('blood_circadian_panels')
      .select('vitamin_d3_nmoll, vitamin_b5_umoll')
      .eq('patient_id', patientId)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle<LatestBloodRow>(),
  ])

  const tier = resolveRetinomicTierFromCounts(bloodCount ?? 0, tipTraqCount ?? 0)
  const biochemical_fuel = biochemicalFuelFromPanel(latestBlood)

  const { error } = await supabase
    .from('patient_profiles')
    .update({
      retinomic_tier: tier,
      biochemical_fuel,
    })
    .eq('id', patientId)

  return { tier, error: error?.message ?? null }
}
