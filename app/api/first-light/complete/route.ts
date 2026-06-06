import { NextResponse } from 'next/server'

import { calculateSmartphoneDlmo } from '@/lib/dlmo/smartphone-dlmo'
import { mergeDlmoLayers } from '@/lib/dashboard/dlmo-merge'
import {
  buildFirstLightOutputs,
  type FirstLightSessionPayload,
} from '@/lib/product/first-light-outputs'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ALGORITHM_VERSION = 'smartphone-dlmo-v1'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function normalizeTime(value: string): string | null {
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

    const body = (await request.json()) as FirstLightSessionPayload

    const sleepOnsetLocal = normalizeTime(body.sleepOnsetLocal)
    const wakeTimeLocal = normalizeTime(body.wakeTimeLocal)
    if (!sleepOnsetLocal || !wakeTimeLocal) {
      return errorResponse('wakeTimeLocal and sleepOnsetLocal must be HH:MM', 400)
    }

    const recordedAt = body.scanCompletedAt || new Date().toISOString()
    const outdoorLight = body.outdoorLight

    const [{ data: patientProfile }, { data: mluxProfile }] = await Promise.all([
      supabase
        .from('patient_profiles')
        .select('fitzpatrick_type, current_medications')
        .eq('id', user.id)
        .maybeSingle(),
      supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    ])

    const fitzpatrickType = patientProfile?.fitzpatrick_type ?? null
    const vdrDoseToday = outdoorLight ? 65 : 15
    const solarZenithDeg = outdoorLight ? 42 : null

    const result = calculateSmartphoneDlmo({
      sleep_onset_local: sleepOnsetLocal,
      pupil_constriction_ratio: outdoorLight ? 0.72 : 0.58,
      solar_zenith_deg: solarZenithDeg,
      vdr_dose_today: vdrDoseToday,
      fitzpatrick_type: fitzpatrickType,
      sleep_onset_estimated: false,
      recorded_at: recordedAt,
    })

    const sensorPayload = {
      sleep_onset_local: sleepOnsetLocal,
      wake_time_local: wakeTimeLocal,
      pupil_constriction_ratio: outdoorLight ? 0.72 : 0.58,
      solar_zenith_deg: solarZenithDeg,
      vdr_dose_today: vdrDoseToday,
      fitzpatrick_type: fitzpatrickType,
      sleep_onset_estimated: false,
      outdoor_light_before_10am: outdoorLight,
      first_light_session: {
        scan_within_window: body.scanWithinWindow,
        adherence: body.adherence,
        completed_at: recordedAt,
      },
      recorded_at: recordedAt,
    }

    const { error: insertError } = await supabase.from('smartphone_circadian_observations').insert({
      patient_id: user.id,
      mlux_phase_minutes: result.mlux_phase_minutes,
      confidence_score: result.confidence_score,
      confidence_band_minutes: result.confidence_band_minutes,
      confidence_label: result.confidence_label,
      sensor_payload: sensorPayload,
      observed_at: recordedAt,
      algorithm_version: ALGORITHM_VERSION,
    })

    if (insertError) {
      console.error('[First Light] observation insert failed', insertError)
      return errorResponse('Could not save morning scan', 500)
    }

    const { error: mergeError } = await mergeDlmoLayers(supabase, user.id)
    if (mergeError) {
      console.error('[First Light] DLMO merge failed', mergeError)
      return errorResponse(mergeError, 500)
    }

    const { data: refreshedProfile } = await supabase
      .from('mlux_profiles')
      .select('*')
      .eq('patient_id', user.id)
      .maybeSingle()

    const outputs = buildFirstLightOutputs(body, {
      currentMedications: patientProfile?.current_medications ?? null,
      mluxProfile: refreshedProfile ?? mluxProfile,
    })

    return NextResponse.json({ success: true, outputs, dlmo: result })
  } catch (error) {
    console.error('[First Light] complete error', error)
    return errorResponse('Internal server error', 500)
  }
}
