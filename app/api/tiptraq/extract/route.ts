import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

import { calculateNightDLMO, calculateRollingDLMO } from '@/lib/dlmo'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const EXTRACTION_PROMPT = `You are extracting structured data from a PranaQ TipTraQ nightly sleep report PDF.

Extract the following values exactly as they appear. If a value is not present return null.

Return ONLY valid JSON. No preamble. No markdown. No explanation. No code blocks.

{
  "patient_name": string,
  "report_date": "YYYY-MM-DD",
  "recording_start": "HH:MM",
  "recording_end": "HH:MM",
  "trt_minutes": number,
  "signal_quality_pct": number,
  "sleep_onset": "HH:MM",
  "sleep_offset": "HH:MM",
  "sleep_latency_minutes": number,
  "tst_minutes": number,
  "waso_minutes": number,
  "sleep_efficiency_pct": number,
  "rem_duration_minutes": number,
  "rem_pct_tst": number,
  "nrem_duration_minutes": number,
  "first_rem_onset": "HH:MM or null",
  "ahi": number,
  "ahi_severity": string,
  "rdi": number,
  "odi_3pct": number,
  "odi_4pct": number,
  "t90_pct": number,
  "min_spo2": number,
  "mean_spo2": number,
  "hypoxic_burden": number,
  "event_count": number,
  "mean_pr": number,
  "min_pr": number,
  "max_pr": number,
  "sns_pct": number,
  "pns_pct": number,
  "snoring_minutes": number,
  "algorithm_version": string
}

Important notes:
- Sleep onset is when sleep actually starts, not recording start
- first_rem_onset is the clock time of first REM epoch
- If REM onset cannot be determined from the report return null
- sns_pct and pns_pct should sum to 100
- All times in 24h format HH:MM
- waso_minutes: convert hours and minutes to total minutes`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('pdf') as File
    if (!file) {
      return NextResponse.json({ error: 'No PDF provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF must be under 10MB' }, { status: 400 })
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
      return NextResponse.json({ error: 'Failed to store PDF' }, { status: 500 })
    }

    const base64PDF = Buffer.from(fileBytes).toString('base64')

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64PDF,
              },
            },
            {
              type: 'text',
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    })

    const rawText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')

    let extracted: Record<string, unknown>
    try {
      extracted = JSON.parse(rawText.trim())
    } catch {
      console.error('JSON parse error:', rawText)
      return NextResponse.json({ error: 'Failed to parse report data' }, { status: 422 })
    }

    const nightData = {
      sleep_onset: extracted.sleep_onset as string,
      sleep_offset: extracted.sleep_offset as string,
      sleep_latency_minutes: extracted.sleep_latency_minutes as number,
      tst_minutes: extracted.tst_minutes as number,
      waso_minutes: extracted.waso_minutes as number,
      sleep_efficiency_pct: extracted.sleep_efficiency_pct as number,
      rem_duration_minutes: extracted.rem_duration_minutes as number,
      rem_pct_tst: extracted.rem_pct_tst as number,
      first_rem_onset: extracted.first_rem_onset as string | null,
      ahi: extracted.ahi as number,
      sns_pct: extracted.sns_pct as number,
      pns_pct: extracted.pns_pct as number,
      mean_pr: extracted.mean_pr as number,
      min_pr: extracted.min_pr as number,
      min_spo2: extracted.min_spo2 as number,
      hypoxic_burden: extracted.hypoxic_burden as number,
      signal_quality_pct: extracted.signal_quality_pct as number,
    }

    const dlmoResult = calculateNightDLMO(nightData)
    const reportDate = extracted.report_date as string

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
      extraction_model: 'claude-sonnet-4-20250514',
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save night data' }, { status: 500 })
    }

    const { data: allNights, error: fetchError } = await supabase
      .from('tiptraq_nights')
      .select('proxy_dlmo_minutes_from_midnight, confidence_score, confidence_band_minutes')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: true })

    if (fetchError || !allNights) {
      return NextResponse.json({ error: 'Failed to fetch night history' }, { status: 500 })
    }

    const nightResults = allNights.map((n) => ({
      proxy_dlmo_minutes: n.proxy_dlmo_minutes_from_midnight,
      proxy_dlmo_time: '',
      baseline_estimate: '',
      rem_correction_min: 0,
      ans_correction_min: 0,
      ahi_modifier_min: 0,
      confidence_score: n.confidence_score,
      confidence_band_minutes: n.confidence_band_minutes,
      confidence_label: '',
      chronotype_signal: '',
      non_dipper_flag: false,
      high_sympathetic_flag: false,
      rem_delay_flag: false,
      apnea_confound_flag: false,
    }))

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
