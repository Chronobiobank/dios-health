import { NextResponse } from 'next/server'

import { verifyWebhookSecret } from '@/lib/api/webhook-auth'
import {
  applyMorningMluxTargetDuration,
  computeHardwareBandwidthCoefficient,
  DEFAULT_MORNING_MLUX_TARGET_DURATION_MINUTES,
} from '@/lib/retinomic/hardware-bandwidth'
import { createAdminClient } from '@/lib/supabase/admin'
import type { HardwareBaseline, IrisPigment, SilotonWebhookPayload } from '@/src/types'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function parsePayload(body: unknown): SilotonWebhookPayload | null {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>
  const userId = typeof raw.userId === 'string' ? raw.userId : null
  const gclRaw = raw.gclIplThicknessMicrons
  if (!userId || !gclRaw || typeof gclRaw !== 'object') return null

  const gcl = gclRaw as Record<string, unknown>
  const leftEye = typeof gcl.leftEye === 'number' ? gcl.leftEye : null
  const rightEye = typeof gcl.rightEye === 'number' ? gcl.rightEye : null

  const irisPigment =
    raw.irisPigment === 'LIGHT' || raw.irisPigment === 'DARK'
      ? (raw.irisPigment as IrisPigment)
      : undefined
  const skinITA = typeof raw.skinITA === 'number' ? raw.skinITA : undefined

  return {
    userId,
    gclIplThicknessMicrons: { leftEye, rightEye },
    irisPigment,
    skinITA,
  }
}

export async function POST(request: Request) {
  if (!verifyWebhookSecret(request, 'SILOTON_WEBHOOK_SECRET')) {
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
    return errorResponse('userId and gclIplThicknessMicrons are required', 400)
  }

  try {
    const supabase = createAdminClient()

    const { data: patient, error: patientError } = await supabase
      .from('patient_profiles')
      .select('id, hardware_baseline, morning_mlux_target_duration_minutes')
      .eq('id', payload.userId)
      .maybeSingle<{
        id: string
        hardware_baseline: HardwareBaseline | null
        morning_mlux_target_duration_minutes: number
      }>()

    if (patientError) {
      console.error('Siloton webhook patient lookup:', patientError)
      return errorResponse('Database error', 500)
    }

    if (!patient) {
      return errorResponse('Patient not found', 404)
    }

    const hardwareBandwidthCoefficient = computeHardwareBandwidthCoefficient(
      payload.gclIplThicknessMicrons
    )
    const baseDuration =
      patient.morning_mlux_target_duration_minutes ?? DEFAULT_MORNING_MLUX_TARGET_DURATION_MINUTES
    const morningMluxTargetDurationMinutes = applyMorningMluxTargetDuration(
      baseDuration,
      hardwareBandwidthCoefficient
    )

    const priorBaseline = patient.hardware_baseline
    const hardwareBaseline: HardwareBaseline = {
      irisPigment: payload.irisPigment ?? priorBaseline?.irisPigment ?? 'DARK',
      skinITA: payload.skinITA ?? priorBaseline?.skinITA ?? 0,
      gclIplThicknessMicrons: payload.gclIplThicknessMicrons,
    }

    const { error: updateError } = await supabase
      .from('patient_profiles')
      .update({
        hardware_baseline: hardwareBaseline,
        hardware_bandwidth_coefficient: hardwareBandwidthCoefficient,
        morning_mlux_target_duration_minutes: morningMluxTargetDurationMinutes,
      })
      .eq('id', payload.userId)

    if (updateError) {
      console.error('Siloton webhook patient update:', updateError)
      return errorResponse('Could not update patient hardware baseline', 500)
    }

    await supabase.from('mlux_profiles').upsert(
      {
        patient_id: payload.userId,
        morning_mlux_target_duration_minutes: morningMluxTargetDurationMinutes,
        hardware_bandwidth_coefficient: hardwareBandwidthCoefficient,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'patient_id' }
    )

    await supabase.from('siloton_webhook_events').insert({
      patient_id: payload.userId,
      payload: body as Record<string, unknown>,
      hardware_bandwidth_coefficient: hardwareBandwidthCoefficient,
    })

    return NextResponse.json({
      ok: true,
      hardwareBandwidthCoefficient,
      morningMluxTargetDurationMinutes,
    })
  } catch (error) {
    console.error('Siloton webhook error:', error)
    return errorResponse('Webhook processing failed', 500)
  }
}
