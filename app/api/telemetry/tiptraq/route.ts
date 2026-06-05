import { NextResponse } from 'next/server'

import { verifyWebhookSecret } from '@/lib/api/webhook-auth'
import { syncRetinomicPatientState } from '@/lib/retinomic/sync-tier'
import { createAdminClient } from '@/lib/supabase/admin'
import type { TipTraqWebhookPayload } from '@/src/types'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function parsePayload(body: unknown): TipTraqWebhookPayload | null {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>
  const userId = typeof raw.userId === 'string' ? raw.userId : null
  const totalSleepTime = typeof raw.totalSleepTime === 'number' ? raw.totalSleepTime : null
  const remSleepEfficiencyPercent =
    typeof raw.remSleepEfficiencyPercent === 'number' ? raw.remSleepEfficiencyPercent : null
  const microArousalsCount =
    typeof raw.microArousalsCount === 'number' ? raw.microArousalsCount : null
  const overnightSpO2Min =
    typeof raw.overnightSpO2Min === 'number' ? raw.overnightSpO2Min : null

  if (
    !userId ||
    totalSleepTime == null ||
    remSleepEfficiencyPercent == null ||
    microArousalsCount == null ||
    overnightSpO2Min == null
  ) {
    return null
  }

  const reportDate =
    typeof raw.reportDate === 'string' ? raw.reportDate.slice(0, 10) : undefined

  return {
    userId,
    totalSleepTime,
    remSleepEfficiencyPercent,
    microArousalsCount,
    overnightSpO2Min,
    reportDate,
  }
}

export async function POST(request: Request) {
  if (!verifyWebhookSecret(request, 'TIPTRAQ_WEBHOOK_SECRET')) {
    return errorResponse('Unauthorised', 401)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  const payload = parsePayload(body)
  if (!payload) {
    return errorResponse(
      'userId, totalSleepTime, remSleepEfficiencyPercent, microArousalsCount, and overnightSpO2Min are required',
      400
    )
  }

  try {
    const supabase = createAdminClient()

    const { data: patient, error: patientError } = await supabase
      .from('patient_profiles')
      .select('id')
      .eq('id', payload.userId)
      .maybeSingle<{ id: string }>()

    if (patientError) {
      console.error('TipTraQ webhook patient lookup:', patientError)
      return errorResponse('Database error', 500)
    }

    if (!patient) {
      return errorResponse('Patient not found', 404)
    }

    const reportDate =
      payload.reportDate ?? new Date().toISOString().slice(0, 10)

    const nightPayload = {
      patient_id: payload.userId,
      report_date: reportDate,
      tst_minutes: Math.round(payload.totalSleepTime),
      rem_sleep_efficiency_pct: payload.remSleepEfficiencyPercent,
      micro_arousals_count: payload.microArousalsCount,
      min_spo2: Math.round(payload.overnightSpO2Min),
      rem_delay_flag: payload.remSleepEfficiencyPercent < 70,
      high_sympathetic_flag: payload.microArousalsCount > 12,
      webhook_source: 'pranaq_tiptraq',
      webhook_received_at: new Date().toISOString(),
      algorithm_version: 'pranaq_webhook_v1',
    }

    const { data: existingNight } = await supabase
      .from('tiptraq_nights')
      .select('id')
      .eq('patient_id', payload.userId)
      .eq('report_date', reportDate)
      .maybeSingle<{ id: string }>()

    const nightResult = existingNight
      ? await supabase
          .from('tiptraq_nights')
          .update(nightPayload)
          .eq('id', existingNight.id)
          .select('id')
          .maybeSingle<{ id: string }>()
      : await supabase
          .from('tiptraq_nights')
          .insert(nightPayload)
          .select('id')
          .maybeSingle<{ id: string }>()

    if (nightResult.error) {
      console.error('TipTraQ webhook night persist:', nightResult.error)
      return errorResponse('Could not persist sleep telemetry', 500)
    }

    const night = nightResult.data

    await supabase.from('tiptraq_webhook_events').insert({
      patient_id: payload.userId,
      tiptraq_night_id: night?.id ?? null,
      payload: body as Record<string, unknown>,
    })

    const { tier, error: syncError } = await syncRetinomicPatientState(supabase, payload.userId)
    if (syncError) {
      console.error('TipTraQ tier sync:', syncError)
    }

    return NextResponse.json({
      ok: true,
      tiptraqNightId: night?.id ?? null,
      tier,
    })
  } catch (error) {
    console.error('TipTraQ webhook error:', error)
    return errorResponse('Webhook processing failed', 500)
  }
}
