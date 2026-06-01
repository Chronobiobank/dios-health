import { NextResponse } from 'next/server'

import { calculateSmartphoneDlmo } from '@/lib/dlmo/smartphone-dlmo'
import { mergeDlmoLayers } from '@/lib/dashboard/dlmo-merge'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ALGORITHM_VERSION = 'smartphone-dlmo-v1'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

type ObservationBody = {
  sleep_onset_local?: string
  pupil_constriction_ratio?: number | null
  solar_zenith_deg?: number | null
  vdr_dose_today?: number | null
  fitzpatrick_type?: number | null
  sleep_onset_estimated?: boolean
  recorded_at?: string
  outdoor_light_before_10am?: boolean
}

function normalizeSleepOnset(value: string): string | null {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null

  const hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2], 10)
  if (hours > 23 || minutes > 59) return null

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorised', 401)
    }

    const body = (await request.json()) as ObservationBody

    if (!body.sleep_onset_local?.trim()) {
      return errorResponse('sleep_onset_local is required', 400)
    }

    const sleepOnsetLocal = normalizeSleepOnset(body.sleep_onset_local)
    if (!sleepOnsetLocal) {
      return errorResponse('sleep_onset_local must be HH:MM', 400)
    }

    let fitzpatrickType = body.fitzpatrick_type ?? null
    if (fitzpatrickType == null) {
      const { data: patientProfile } = await supabase
        .from('patient_profiles')
        .select('fitzpatrick_type')
        .eq('id', user.id)
        .maybeSingle()

      fitzpatrickType = patientProfile?.fitzpatrick_type ?? null
    }

    const outdoorLight = body.outdoor_light_before_10am
    const vdrDoseToday =
      body.vdr_dose_today ??
      (outdoorLight === true ? 65 : outdoorLight === false ? 15 : null)

    const solarZenithDeg =
      body.solar_zenith_deg ?? (outdoorLight === true ? 42 : outdoorLight === false ? null : null)

    const sleepOnsetEstimated = body.sleep_onset_estimated ?? true

    const recordedAt = body.recorded_at ?? new Date().toISOString()

    const result = calculateSmartphoneDlmo({
      sleep_onset_local: sleepOnsetLocal,
      pupil_constriction_ratio: body.pupil_constriction_ratio ?? null,
      solar_zenith_deg: solarZenithDeg,
      vdr_dose_today: vdrDoseToday,
      fitzpatrick_type: fitzpatrickType,
      sleep_onset_estimated: sleepOnsetEstimated,
      recorded_at: recordedAt,
    })

    const sensorPayload = {
      sleep_onset_local: sleepOnsetLocal,
      pupil_constriction_ratio: body.pupil_constriction_ratio ?? null,
      solar_zenith_deg: solarZenithDeg,
      vdr_dose_today: vdrDoseToday,
      fitzpatrick_type: fitzpatrickType,
      sleep_onset_estimated: sleepOnsetEstimated,
      outdoor_light_before_10am: outdoorLight ?? null,
      recorded_at: recordedAt,
    }

    const { data: observation, error: insertError } = await supabase
      .from('smartphone_circadian_observations')
      .insert({
        patient_id: user.id,
        mlux_phase_minutes: result.mlux_phase_minutes,
        confidence_score: result.confidence_score,
        confidence_band_minutes: result.confidence_band_minutes,
        confidence_label: result.confidence_label,
        sensor_payload: sensorPayload,
        observed_at: recordedAt,
        algorithm_version: ALGORITHM_VERSION,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[Smartphone observation] insert failed', insertError)
      return errorResponse('Could not save smartphone observation', 500)
    }

    const { error: mergeError, dominantLayer } = await mergeDlmoLayers(supabase, user.id)

    if (mergeError) {
      console.error('[Smartphone observation] DLMO merge failed', mergeError)
      return errorResponse(mergeError, 500)
    }

    return NextResponse.json({
      success: true,
      id: observation.id,
      dominant_layer: dominantLayer,
      result,
    })
  } catch (error) {
    console.error('[Smartphone observation] error', error)
    return errorResponse('Internal server error', 500)
  }
}
