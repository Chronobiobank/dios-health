import { NextResponse } from 'next/server'

import { mergeDlmoLayers } from '@/lib/dashboard/dlmo-merge'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

type ObservationBody = {
  proxy_dlmo_minutes_from_midnight?: number
  confidence_score?: number
  confidence_band_minutes?: number
  confidence_label?: string
  sensor_payload?: Record<string, unknown>
  observed_at?: string
  algorithm_version?: string
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

    if (body.proxy_dlmo_minutes_from_midnight == null || body.confidence_score == null) {
      return errorResponse('proxy_dlmo_minutes_from_midnight and confidence_score are required', 400)
    }

    const { data: observation, error: insertError } = await supabase
      .from('smartphone_circadian_observations')
      .insert({
        patient_id: user.id,
        proxy_dlmo_minutes_from_midnight: body.proxy_dlmo_minutes_from_midnight,
        confidence_score: body.confidence_score,
        confidence_band_minutes: body.confidence_band_minutes ?? null,
        confidence_label: body.confidence_label ?? null,
        sensor_payload: body.sensor_payload ?? {},
        observed_at: body.observed_at ?? new Date().toISOString(),
        algorithm_version: body.algorithm_version ?? null,
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

    return NextResponse.json({ success: true, id: observation.id, dominant_layer: dominantLayer })
  } catch (error) {
    console.error('[Smartphone observation] error', error)
    return errorResponse('Internal server error', 500)
  }
}
