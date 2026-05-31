import { NextResponse } from 'next/server'

import { mergeDlmoLayers } from '@/lib/dashboard/dlmo-merge'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

type BloodPanelBody = {
  proxy_dlmo_minutes_from_midnight?: number
  confidence_score?: number
  confidence_band_minutes?: number
  confidence_label?: string
  vitamin_d3_nmoll?: number
  vitamin_b12_pmoll?: number
  ferritin_ugl?: number
  vitamin_b5_umoll?: number
  collected_at?: string
  lab_source?: string
  raw_results?: Record<string, unknown>
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

    const body = (await request.json()) as BloodPanelBody

    if (body.proxy_dlmo_minutes_from_midnight == null || body.confidence_score == null) {
      return errorResponse('proxy_dlmo_minutes_from_midnight and confidence_score are required', 400)
    }

    const { data: panel, error: insertError } = await supabase
      .from('blood_circadian_panels')
      .insert({
        patient_id: user.id,
        proxy_dlmo_minutes_from_midnight: body.proxy_dlmo_minutes_from_midnight,
        confidence_score: body.confidence_score,
        confidence_band_minutes: body.confidence_band_minutes ?? null,
        confidence_label: body.confidence_label ?? null,
        vitamin_d3_nmoll: body.vitamin_d3_nmoll ?? null,
        vitamin_b12_pmoll: body.vitamin_b12_pmoll ?? null,
        ferritin_ugl: body.ferritin_ugl ?? null,
        vitamin_b5_umoll: body.vitamin_b5_umoll ?? null,
        collected_at: body.collected_at ?? new Date().toISOString(),
        lab_source: body.lab_source ?? 'city_labs',
        raw_results: body.raw_results ?? {},
        algorithm_version: body.algorithm_version ?? null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[Blood panel] insert failed', insertError)
      return errorResponse('Could not save blood panel', 500)
    }

    const { error: mergeError, dominantLayer } = await mergeDlmoLayers(supabase, user.id)

    if (mergeError) {
      console.error('[Blood panel] DLMO merge failed', mergeError)
      return errorResponse(mergeError, 500)
    }

    return NextResponse.json({ success: true, id: panel.id, dominant_layer: dominantLayer })
  } catch (error) {
    console.error('[Blood panel] error', error)
    return errorResponse('Internal server error', 500)
  }
}
