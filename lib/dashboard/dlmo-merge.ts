import { normalizeMinutesFromMidnight } from '@/lib/dlmo'
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
  proxy_dlmo_minutes_from_midnight: number | null
  confidence_score: number | null
}

type BloodRow = {
  id: string
  collected_at: string
  proxy_dlmo_minutes_from_midnight: number | null
  confidence_score: number | null
}

type DlmoProfileRow = {
  nights_count: number | null
  proxy_dlmo_rolling: string | null
  proxy_dlmo_minutes_from_midnight: number | null
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
  smartphoneMinutes: number | null
): DominantLayer {
  if (
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
  profile: DlmoProfileRow | null,
  blood: BloodRow | null,
  smartphone: SmartphoneRow | null
): { proxy_dlmo_rolling: string | null; proxy_dlmo_minutes_from_midnight: number | null; confidence_score: number | null } {
  if (dominant === 'tiptraq') {
    return {
      proxy_dlmo_rolling: profile?.proxy_dlmo_rolling ?? null,
      proxy_dlmo_minutes_from_midnight: profile?.proxy_dlmo_minutes_from_midnight ?? null,
      confidence_score: profile?.confidence_score ?? null,
    }
  }

  if (dominant === 'blood' && blood?.proxy_dlmo_minutes_from_midnight != null) {
    const minutes = normalizeMinutesFromMidnight(blood.proxy_dlmo_minutes_from_midnight)
    return {
      proxy_dlmo_rolling: minutesToDbTime(minutes),
      proxy_dlmo_minutes_from_midnight: minutes,
      confidence_score: blood.confidence_score,
    }
  }

  if (dominant === 'smartphone' && smartphone?.proxy_dlmo_minutes_from_midnight != null) {
    const minutes = normalizeMinutesFromMidnight(smartphone.proxy_dlmo_minutes_from_midnight)
    return {
      proxy_dlmo_rolling: minutesToDbTime(minutes),
      proxy_dlmo_minutes_from_midnight: minutes,
      confidence_score: smartphone.confidence_score,
    }
  }

  return {
    proxy_dlmo_rolling: profile?.proxy_dlmo_rolling ?? null,
    proxy_dlmo_minutes_from_midnight: profile?.proxy_dlmo_minutes_from_midnight ?? null,
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
      .select('id, observed_at, proxy_dlmo_minutes_from_midnight, confidence_score')
      .eq('patient_id', patientId)
      .order('observed_at', { ascending: false })
      .limit(1)
      .maybeSingle<SmartphoneRow>(),
    supabase
      .from('blood_circadian_panels')
      .select('id, collected_at, proxy_dlmo_minutes_from_midnight, confidence_score')
      .eq('patient_id', patientId)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle<BloodRow>(),
    supabase
      .from('mlux_profiles')
      .select(
        'nights_count, proxy_dlmo_rolling, proxy_dlmo_minutes_from_midnight, confidence_score, confidence_band_minutes, confidence_label, last_updated'
      )
      .eq('patient_id', patientId)
      .maybeSingle<DlmoProfileRow>(),
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

  const layer3Minutes = profile?.proxy_dlmo_minutes_from_midnight ?? null
  const layer3Confidence = profile?.confidence_score ?? null

  let layersActive = 0
  if (smartphone) layersActive |= LAYER_BIT_SMARTPHONE
  if (blood) layersActive |= LAYER_BIT_BLOOD
  if ((profile?.nights_count ?? 0) > 0) layersActive |= LAYER_BIT_TIPTRAQ

  const dominantLayer = resolveDominantLayer(
    layer3Confidence,
    layer3Minutes,
    blood?.confidence_score ?? null,
    blood?.proxy_dlmo_minutes_from_midnight ?? null,
    smartphone?.confidence_score ?? null,
    smartphone?.proxy_dlmo_minutes_from_midnight ?? null
  )

  const canonical = canonicalFromLayer(dominantLayer, profile, blood, smartphone)

  const mergePayload = {
    patient_id: patientId,
    dominant_layer: dominantLayer,
    layers_active: layersActive,
    layer1_proxy_dlmo_minutes: smartphone?.proxy_dlmo_minutes_from_midnight ?? null,
    layer1_confidence_score: smartphone?.confidence_score ?? null,
    layer1_observation_id: smartphone?.id ?? null,
    layer1_updated_at: smartphone?.observed_at ?? null,
    layer2_proxy_dlmo_minutes: blood?.proxy_dlmo_minutes_from_midnight ?? null,
    layer2_confidence_score: blood?.confidence_score ?? null,
    layer2_panel_id: blood?.id ?? null,
    layer2_updated_at: blood?.collected_at ?? null,
    layer3_proxy_dlmo_minutes: layer3Minutes,
    layer3_confidence_score: layer3Confidence,
    layer3_updated_at: profile?.last_updated ?? null,
    proxy_dlmo_rolling: canonical.proxy_dlmo_rolling,
    proxy_dlmo_minutes_from_midnight: canonical.proxy_dlmo_minutes_from_midnight,
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
