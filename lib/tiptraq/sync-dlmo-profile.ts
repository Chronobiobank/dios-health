import { calculateRollingDLMO, type DLMOResult, type RollingDLMO } from '@/lib/dlmo'
import { mapFetchError, mapProfileUpsertError } from '@/lib/tiptraq/extraction'
import type { createClient } from '@/lib/supabase/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

type NightSummaryRow = {
  proxy_dlmo_minutes_from_midnight: number | null
  confidence_score: number | null
  confidence_band_minutes: number | null
}

export function toRollingNightResults(nights: NightSummaryRow[]): DLMOResult[] {
  return nights.map((night) => ({
    proxy_dlmo_minutes: night.proxy_dlmo_minutes_from_midnight ?? 0,
    proxy_dlmo_time: '',
    baseline_estimate: '',
    rem_correction_min: 0,
    ans_correction_min: 0,
    ahi_modifier_min: 0,
    confidence_score: night.confidence_score ?? 0,
    confidence_band_minutes: night.confidence_band_minutes ?? 75,
    confidence_label: '',
    chronotype_signal: '',
    non_dipper_flag: false,
    high_sympathetic_flag: false,
    rem_delay_flag: false,
    apnea_confound_flag: false,
  }))
}

export async function syncDlmoProfileForPatient(
  supabase: SupabaseServerClient,
  patientId: string
): Promise<{ error: string | null; rolling: RollingDLMO | null }> {
  const { data: allNights, error: fetchError } = await supabase
    .from('tiptraq_nights')
    .select('proxy_dlmo_minutes_from_midnight, confidence_score, confidence_band_minutes')
    .eq('patient_id', patientId)
    .order('report_date', { ascending: true })

  if (fetchError) {
    return { error: mapFetchError(fetchError.message), rolling: null }
  }

  if (!allNights || allNights.length === 0) {
    const { error: upsertError } = await supabase.from('mlux_profiles').upsert(
      {
        patient_id: patientId,
        nights_count: 0,
        proxy_dlmo_rolling: null,
        proxy_dlmo_minutes_from_midnight: null,
        confidence_score: null,
        confidence_band_minutes: null,
        confidence_label: null,
        chronotype: null,
        simvastatin_optimal_time: null,
        ramipril_optimal_time: null,
        prednisolone_optimal_time: null,
        salmeterol_optimal_time: null,
        light_dose_window_start: null,
        light_dose_window_end: null,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'patient_id' }
    )

    if (upsertError) {
      return { error: mapProfileUpsertError(upsertError.message), rolling: null }
    }

    return { error: null, rolling: null }
  }

  const rolling = calculateRollingDLMO(toRollingNightResults(allNights))

  const { error: upsertError } = await supabase.from('mlux_profiles').upsert(
    {
      patient_id: patientId,
      nights_count: rolling.nights_count,
      proxy_dlmo_rolling: rolling.proxy_dlmo_time,
      proxy_dlmo_minutes_from_midnight: rolling.proxy_dlmo_minutes,
      confidence_score: rolling.confidence_score,
      confidence_band_minutes: rolling.confidence_band_minutes,
      confidence_label: rolling.confidence_label,
      chronotype: rolling.chronotype,
      simvastatin_optimal_time: rolling.simvastatin_optimal,
      ramipril_optimal_time: rolling.ramipril_optimal,
      prednisolone_optimal_time: rolling.prednisolone_optimal,
      salmeterol_optimal_time: rolling.salmeterol_optimal,
      light_dose_window_start: rolling.light_window_start,
      light_dose_window_end: rolling.light_window_end,
      last_updated: new Date().toISOString(),
    },
    { onConflict: 'patient_id' }
  )

  if (upsertError) {
    return { error: mapProfileUpsertError(upsertError.message), rolling: null }
  }

  return { error: null, rolling }
}

export function mapTipTraqDeleteError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'You do not have permission to delete this recording.'
  }

  if (lower.includes('does not exist') || lower.includes('schema cache')) {
    return 'TipTraQ delete is not set up yet. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  return 'Could not delete this recording. Please try again.'
}
