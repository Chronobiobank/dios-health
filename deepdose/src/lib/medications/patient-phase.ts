import type { SupabaseClient } from '@supabase/supabase-js'
import { calculateCCS } from '@/lib/circadian/score'
import { countRecentSleepNights } from '@/lib/wearables/sync-oura'
import { wearableQualityScore } from '@/lib/wearables/device-health'
import { resolvePrimaryWearableConnection } from '@/lib/wearables/tiers'

export interface PatientCircadianContext {
  phaseOffsetMinutes: number
  dlmoEstimateHours: number
  sjlHours: number
  circadianScore: number
  chronotypeCat: string | null
  scoreComponents: {
    phaseScore: number
    sjlScore: number
    vitaminDScore: number
    dataQualityScore: number
  } | null
}

export async function getPatientCircadianContext(
  supabase: SupabaseClient,
  patientId: string
): Promise<PatientCircadianContext> {
  const { data: chronotype, error } = await supabase
    .from('chronotype_profiles')
    .select('msf_sc, sjl_hours, chronotype_cat')
    .eq('patient_id', patientId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !chronotype?.msf_sc) {
    return {
      phaseOffsetMinutes: 0,
      dlmoEstimateHours: 21,
      sjlHours: 0,
      circadianScore: 0,
      chronotypeCat: null,
      scoreComponents: null,
    }
  }

  const msfSc = Number(chronotype.msf_sc)
  const sjlHours = Number(chronotype.sjl_hours)
  const dlmoEstimateHours = ((msfSc - 2.5) % 24 + 24) % 24

  const { data: wearableConnections } = await supabase
    .from('wearable_connections')
    .select('provider, last_sync_at')
    .eq('patient_id', patientId)

  const primaryWearable = resolvePrimaryWearableConnection(wearableConnections ?? [])

  const recentNights = await countRecentSleepNights(supabase, patientId)
  const wearableScore = wearableQualityScore({
    connected: Boolean(primaryWearable),
    lastSyncAt: primaryWearable?.last_sync_at ?? null,
    recentSleepNights: recentNights,
    provider: primaryWearable?.provider ?? null,
  })

  const ccs = calculateCCS({
    dlmoEstimateHours,
    sjlHours,
    fitbitScore: wearableScore,
  })

  return {
    phaseOffsetMinutes: ccs.phaseOffsetMinutes,
    dlmoEstimateHours,
    sjlHours,
    circadianScore: ccs.score,
    chronotypeCat: chronotype.chronotype_cat,
    scoreComponents: ccs.components,
  }
}
