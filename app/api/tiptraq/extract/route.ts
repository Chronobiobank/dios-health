import { NextRequest, NextResponse } from 'next/server'

import { calculateNightDLMO, calculateRollingDLMO, type DLMOResult } from '@/lib/dlmo'
import { createClient } from '@/lib/supabase/server'
import {
  extractTipTraQFromPdf,
  getAnthropicApiKey,
  mapAnthropicError,
  TIPTRAQ_EXTRACTION_MODEL,
} from '@/lib/tiptraq/anthropic-client'
import {
  isPdfFile,
  mapFetchError,
  mapInsertError,
  mapProfileUpsertError,
  mapStorageUploadError,
  parseExtractedJson,
  toNightInput,
  resolveReportDate,
} from '@/lib/tiptraq/extraction'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function toRollingNightResults(nights: Array<{
  proxy_dlmo_minutes_from_midnight: number | null
  confidence_score: number | null
  confidence_band_minutes: number | null
}>): DLMOResult[] {
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

export async function POST(request: NextRequest) {
  if (!getAnthropicApiKey()) {
    console.error('TipTraQ extract: ANTHROPIC_API_KEY is not configured')
    return errorResponse(
      'Report extraction is not configured on the server. Add ANTHROPIC_API_KEY in Vercel environment variables.',
      503
    )
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return errorResponse('Unauthorised', 401)
    }

    const formData = await request.formData()
    const file = formData.get('pdf')
    if (!(file instanceof File)) {
      return errorResponse('No PDF provided', 400)
    }

    if (!isPdfFile(file)) {
      return errorResponse('File must be a PDF', 400)
    }

    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('PDF must be under 10MB', 400)
    }

    const fileBytes = await file.arrayBuffer()
    const fileName = `${user.id}/${Date.now()}-tiptraq.pdf`

    const { error: uploadError } = await supabase.storage
      .from('tiptraq-reports')
      .upload(fileName, fileBytes, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return errorResponse(mapStorageUploadError(uploadError.message), 500)
    }

    const { rawText } = await extractTipTraQFromPdf(Buffer.from(fileBytes).toString('base64'))

    let extracted: Record<string, unknown>
    try {
      extracted = parseExtractedJson(rawText)
    } catch {
      console.error('JSON parse error:', rawText)
      return errorResponse('Could not read this TipTraQ report. Check the PDF and try again.', 422)
    }

    const reportDate = resolveReportDate(extracted)
    const nightInput = toNightInput(extracted)
    const dlmoResult = calculateNightDLMO(nightInput)

    const { error: insertError } = await supabase.from('tiptraq_nights').insert({
      patient_id: user.id,
      report_date: reportDate,
      pdf_path: fileName,
      recording_start: extracted.recording_start,
      recording_end: extracted.recording_end,
      trt_minutes: extracted.trt_minutes,
      signal_quality_pct: extracted.signal_quality_pct,
      sleep_onset: extracted.sleep_onset,
      sleep_offset: extracted.sleep_offset,
      sleep_latency_minutes: extracted.sleep_latency_minutes,
      tst_minutes: extracted.tst_minutes,
      waso_minutes: extracted.waso_minutes,
      sleep_efficiency_pct: extracted.sleep_efficiency_pct,
      rem_duration_minutes: extracted.rem_duration_minutes,
      rem_pct_tst: extracted.rem_pct_tst,
      nrem_duration_minutes: extracted.nrem_duration_minutes,
      first_rem_onset: extracted.first_rem_onset,
      ahi: extracted.ahi,
      ahi_severity: extracted.ahi_severity,
      rdi: extracted.rdi,
      odi_3pct: extracted.odi_3pct,
      odi_4pct: extracted.odi_4pct,
      t90_pct: extracted.t90_pct,
      min_spo2: extracted.min_spo2,
      mean_spo2: extracted.mean_spo2,
      hypoxic_burden: extracted.hypoxic_burden,
      event_count: extracted.event_count,
      mean_pr: extracted.mean_pr,
      min_pr: extracted.min_pr,
      max_pr: extracted.max_pr,
      sns_pct: extracted.sns_pct,
      pns_pct: extracted.pns_pct,
      snoring_minutes: extracted.snoring_minutes,
      algorithm_version: extracted.algorithm_version,
      proxy_dlmo_time: dlmoResult.proxy_dlmo_time,
      proxy_dlmo_minutes_from_midnight: dlmoResult.proxy_dlmo_minutes,
      dlmo_baseline_estimate: dlmoResult.baseline_estimate,
      dlmo_rem_correction_min: dlmoResult.rem_correction_min,
      dlmo_ans_correction_min: dlmoResult.ans_correction_min,
      dlmo_ahi_modifier_min: dlmoResult.ahi_modifier_min,
      confidence_score: dlmoResult.confidence_score,
      confidence_band_minutes: dlmoResult.confidence_band_minutes,
      confidence_label: dlmoResult.confidence_label,
      chronotype_signal: dlmoResult.chronotype_signal,
      non_dipper_flag: dlmoResult.non_dipper_flag,
      high_sympathetic_flag: dlmoResult.high_sympathetic_flag,
      rem_delay_flag: dlmoResult.rem_delay_flag,
      apnea_confound_flag: dlmoResult.apnea_confound_flag,
      extraction_model: TIPTRAQ_EXTRACTION_MODEL,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      return errorResponse(mapInsertError(insertError.message), 500)
    }

    const { data: allNights, error: fetchError } = await supabase
      .from('tiptraq_nights')
      .select('proxy_dlmo_minutes_from_midnight, confidence_score, confidence_band_minutes')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: true })

    if (fetchError) {
      console.error('Fetch nights error:', fetchError)
      return errorResponse(mapFetchError(fetchError.message), 500)
    }

    const nightResults =
      allNights && allNights.length > 0 ? toRollingNightResults(allNights) : [dlmoResult]

    const rolling = calculateRollingDLMO(nightResults)

    const { error: upsertError } = await supabase.from('dlmo_profiles').upsert(
      {
        patient_id: user.id,
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
      {
        onConflict: 'patient_id',
      }
    )

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return errorResponse(mapProfileUpsertError(upsertError.message), 500)
    }

    return NextResponse.json({
      success: true,
      night: {
        date: reportDate,
        dlmo_time: dlmoResult.proxy_dlmo_time,
        confidence_score: dlmoResult.confidence_score,
        confidence_label: dlmoResult.confidence_label,
        confidence_band_minutes: dlmoResult.confidence_band_minutes,
        chronotype_signal: dlmoResult.chronotype_signal,
        flags: {
          non_dipper: dlmoResult.non_dipper_flag,
          high_sympathetic: dlmoResult.high_sympathetic_flag,
          rem_delay: dlmoResult.rem_delay_flag,
          apnea_confound: dlmoResult.apnea_confound_flag,
        },
      },
      rolling: {
        nights_count: rolling.nights_count,
        dlmo_time: rolling.proxy_dlmo_time,
        confidence_score: rolling.confidence_score,
        confidence_label: rolling.confidence_label,
        confidence_band_minutes: rolling.confidence_band_minutes,
        chronotype: rolling.chronotype,
        dose_windows: {
          simvastatin: rolling.simvastatin_optimal,
          ramipril: rolling.ramipril_optimal,
          prednisolone: rolling.prednisolone_optimal,
          salmeterol: rolling.salmeterol_optimal,
          light_start: rolling.light_window_start,
          light_end: rolling.light_window_end,
        },
      },
    })
  } catch (error) {
    console.error('Extraction pipeline error:', error)

    const anthropicMessage = mapAnthropicError(error)
    if (anthropicMessage) {
      return errorResponse(anthropicMessage, 503)
    }

    if (error instanceof Error) {
      if (error.message.startsWith('Report is missing') || error.message.startsWith('Report has an invalid')) {
        return errorResponse(error.message, 422)
      }
    }

    return errorResponse('Internal server error', 500)
  }
}
