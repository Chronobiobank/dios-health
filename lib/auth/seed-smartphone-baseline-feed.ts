import type { SupabaseClient } from '@supabase/supabase-js'

import { mergeDlmoLayers } from '@/lib/dashboard/dlmo-merge'
import { calculateSmartphoneDlmo } from '@/lib/dlmo/smartphone-dlmo'
import { estimateInitialVdrFromBaseline } from '@/lib/retinomic/live-mlux-feed'
import { resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'
import type { IrisPigment } from '@/src/types'

const ALGORITHM_VERSION = 'smartphone-dlmo-v1'

export type SeedSmartphoneBaselineFeedInput = {
  userId: string
  irisPigment: IrisPigment
  skinITA: number
  fitzpatrickType: number
  sleepOnsetLocal?: string
  solarZenithDeg?: number | null
}

/** Day-one phone feed — seeds Layer 1 from onboarding baseline so light dose is live immediately */
export async function seedSmartphoneBaselineFeed(
  supabase: SupabaseClient,
  input: SeedSmartphoneBaselineFeedInput
): Promise<{ error: string | null }> {
  const sleepOnset = input.sleepOnsetLocal ?? '22:30'
  const phase = resolvePhoticDayPhase()
  const vdrDoseToday = estimateInitialVdrFromBaseline(input.irisPigment, phase)
  const outdoorLight = vdrDoseToday >= 50
  const recordedAt = new Date().toISOString()

  const result = calculateSmartphoneDlmo({
    sleep_onset_local: sleepOnset,
    solar_zenith_deg: input.solarZenithDeg ?? (outdoorLight ? 42 : null),
    vdr_dose_today: vdrDoseToday,
    fitzpatrick_type: input.fitzpatrickType,
    sleep_onset_estimated: true,
    recorded_at: recordedAt,
  })

  const sensorPayload = {
    sleep_onset_local: sleepOnset,
    vdr_dose_today: vdrDoseToday,
    outdoor_light_before_10am: outdoorLight,
    fitzpatrick_type: input.fitzpatrickType,
    skin_ita: input.skinITA,
    iris_pigment: input.irisPigment,
    sleep_onset_estimated: true,
    seeded_from: 'onboarding_baseline',
    recorded_at: recordedAt,
  }

  const { error: insertError } = await supabase.from('smartphone_circadian_observations').insert({
    patient_id: input.userId,
    mlux_phase_minutes: result.mlux_phase_minutes,
    confidence_score: result.confidence_score,
    confidence_band_minutes: result.confidence_band_minutes,
    confidence_label: result.confidence_label,
    sensor_payload: sensorPayload,
    observed_at: recordedAt,
    algorithm_version: ALGORITHM_VERSION,
  })

  if (insertError) {
    return { error: insertError.message }
  }

  const { error: mergeError } = await mergeDlmoLayers(supabase, input.userId)
  if (mergeError) {
    return { error: mergeError }
  }

  return { error: null }
}
