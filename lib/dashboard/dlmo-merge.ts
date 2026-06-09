import { isCalibrationComplete } from '@/lib/bodycloq'
import { normalizeMinutesFromMidnight } from '@/lib/mlux'
import { mapProfileUpsertError } from '@/lib/tiptraq/extraction'
import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export type DominantLayer = 'smartphone' | 'blood' | 'tiptraq' | null

export const LAYER_BIT_SMARTPHONE = 1
export const LAYER_BIT_BLOOD = 2
export const LAYER_BIT_TIPTRAQ = 4

const TIPTRAQ_DOMINANCE_THRESHOLD = 40
const BLOOD_DOMINANCE_THRESHOLD = 30

type SmartphoneRow = {
  id: string
  observed_at: string
  mlux_phase_minutes: number | null
  confidence_score: number | null
}

type BloodRow = {
  id: string
  collected_at: string
  mlux_phase_minutes: number | null
  confidence_score: number | null
}

type MLuxProfileRow = {
  nights_count: number | null
  mlux_phase_time: string | null
  mlux_phase_minutes: number | null
  confidence_score: number | null
  confidence_band_minutes: number | null
  confidence_label: string | null
  last_updated: string | null
}

function minutesToDbTime(minutes: number): string {
  const normalized = normalizeMinutesFromMidnight(minutes)
  const hours = Math.floor(normalized / 60)
  const mins = normalized % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

function resolveDominantLayer(
  layer3Confidence: number | null,
  layer3Minutes: number | null,
  bloodConfidence: number | null,
  bloodMinutes: number | null,
  smartphoneConfidence: number | null,
  smartphoneMinutes: number | null,
  tiptraqCalibrated: boolean
): DominantLayer {
  if (
    tiptraqCalibrated &&
    layer3Confidence != null &&
    layer3Confidence >= TIPTRAQ_DOMINANCE_THRESHOLD &&
    layer3Minutes != null
  ) {
    return 'tiptraq'
  }

  if (
    bloodConfidence != null &&
    bloodConfidence >= BLOOD_DOMINANCE_THRESHOLD &&
    bloodMinutes != null
  ) {
    return 'blood'
  }

  if (smartphoneConfidence != null && smartphoneMinutes != null) {
    return 'smartphone'
  }

  return null
}

function canonicalFromLayer(
  dominant: DominantLayer,
  profile: MLuxProfileRow | null,
  blood: BloodRow | null,
  smartphone: SmartphoneRow | null
): { mlux_phase_time: string | null; mlux_phase_minutes: number | null; confidence_score: number | null } {
  if (dominant === 'tiptraq') {
    return {
      mlux_phase_time: profile?.mlux_phase_time ?? null,
      mlux_phase_minutes: profile?.mlux_phase_minutes ?? null,
      confidence_score: profile?.confidence_score ?? null,
    }
  }

  if (dominant === 'blood' && blood?.mlux_phase_minutes != null) {
    const minutes = normalizeMinutesFromMidnight(blood.mlux_phase_minutes)
    return {
      mlux_phase_time: minutesToDbTime(minutes),
      mlux_phase_minutes: minutes,
      confidence_score: blood.confidence_score,
    }
  }

  if (dominant === 'smartphone' && smartphone?.mlux_phase_minutes != null) {
    const minutes = normalizeMinutesFromMidnight(smartphone.mlux_phase_minutes)
    return {
      mlux_phase_time: minutesToDbTime(minutes),
      mlux_phase_minutes: minutes,
      confidence_score: smartphone.confidence_score,
    }
  }

  return {
    mlux_phase_time: profile?.mlux_phase_time ?? null,
    mlux_phase_minutes: profile?.mlux_phase_minutes ?? null,
    confidence_score: profile?.confidence_score ?? null,
  }
}

export async function mergeDlmoLayers(
  supabase: SupabaseServerClient,
  patientId: string
): Promise<{ error: string | null; dominantLayer: DominantLayer }> {
  const [smartphoneResult, bloodResult, profileResult] = await Promise.all([
    supabase
      .from('smartphone_circadian_observations')
      .select('id, observed_at, mlux_phase_minutes, confidence_score')
      .eq('patient_id', patientId)
      .order('observed_at', { ascending: false })
      .limit(1)
      .maybeSingle<SmartphoneRow>(),
    supabase
      .from('blood_circadian_panels')
      .select('id, collected_at, mlux_phase_minutes, confidence_score')
      .eq('patient_id', patientId)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle<BloodRow>(),
    supabase
      .from('mlux_profiles')
      .select(
        'nights_count, mlux_phase_time, mlux_phase_minutes, confidence_score, confidence_band_minutes, confidence_label, last_updated'
      )
      .eq('patient_id', patientId)
      .maybeSingle<MLuxProfileRow>(),
  ])

  if (smartphoneResult.error) {
    return { error: mapProfileUpsertError(smartphoneResult.error.message), dominantLayer: null }
  }

  if (bloodResult.error) {
    return { error: mapProfileUpsertError(bloodResult.error.message), dominantLayer: null }
  }

  if (profileResult.error) {
    return { error: mapProfileUpsertError(profileResult.error.message), dominantLayer: null }
  }

  const smartphone = smartphoneResult.data
  const blood = bloodResult.data
  const profile = profileResult.data

  const layer3Minutes = profile?.mlux_phase_minutes ?? null
  const layer3Confidence = profile?.confidence_score ?? null

  let layersActive = 0
  if (smartphone) layersActive |= LAYER_BIT_SMARTPHONE
  if (blood) layersActive |= LAYER_BIT_BLOOD
  const tiptraqCalibrated = isCalibrationComplete(profile?.nights_count ?? 0)
  if (tiptraqCalibrated) layersActive |= LAYER_BIT_TIPTRAQ

  const dominantLayer = resolveDominantLayer(
    layer3Confidence,
    layer3Minutes,
    blood?.confidence_score ?? null,
    blood?.mlux_phase_minutes ?? null,
    smartphone?.confidence_score ?? null,
    smartphone?.mlux_phase_minutes ?? null,
    tiptraqCalibrated
  )

  const canonical = canonicalFromLayer(dominantLayer, profile, blood, smartphone)

  const diagnosticTier = tiptraqCalibrated ? 'L1' : blood ? 'L2' : 'L3'

  const mergePayload = {
    patient_id: patientId,
    dominant_layer: dominantLayer,
    layers_active: layersActive,
    has_tipraq: tiptraqCalibrated,
    diagnostic_tier: diagnosticTier,
    layer1_proxy_dlmo_minutes: smartphone?.mlux_phase_minutes ?? null,
    layer1_confidence_score: smartphone?.confidence_score ?? null,
    layer1_observation_id: smartphone?.id ?? null,
    layer1_updated_at: smartphone?.observed_at ?? null,
    layer2_proxy_dlmo_minutes: blood?.mlux_phase_minutes ?? null,
    layer2_confidence_score: blood?.confidence_score ?? null,
    layer2_panel_id: blood?.id ?? null,
    layer2_updated_at: blood?.collected_at ?? null,
    layer3_proxy_dlmo_minutes: layer3Minutes,
    layer3_confidence_score: layer3Confidence,
    layer3_updated_at: profile?.last_updated ?? null,
    mlux_phase_time: canonical.mlux_phase_time,
    mlux_phase_minutes: canonical.mlux_phase_minutes,
    confidence_score: canonical.confidence_score,
    last_updated: new Date().toISOString(),
  }

  const { error: upsertError } = await supabase
    .from('mlux_profiles')
    .upsert(mergePayload, { onConflict: 'patient_id' })

  if (upsertError) {
    return { error: mapProfileUpsertError(upsertError.message), dominantLayer: null }
  }

  return { error: null, dominantLayer }
}
