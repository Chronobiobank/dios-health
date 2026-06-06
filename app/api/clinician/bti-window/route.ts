import { NextResponse } from 'next/server'

import { simulateBiologicalWindowFromTelemetry } from '@/lib/dios/bti/btiEngineService'
import type { WearableTelemetryLogRow } from '@/lib/dios/bti/types'
import { WEARABLE_TELEMETRY_LOGS_TABLE } from '@/lib/dios/constants/tables'
import { MockTipTraQAdapter } from '@/lib/dios/premium/mock-tiptraq-adapter'
import { createClient } from '@/lib/supabase/server'

type BtiWindowRequest = {
  patientId?: string
  medicationId?: string
}

export async function POST(request: Request) {
  let body: BtiWindowRequest
  try {
    body = (await request.json()) as BtiWindowRequest
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const patientId = body.patientId?.trim()
  const medicationId = body.medicationId?.trim() || 'vitamin-d3'

  if (!patientId) {
    return NextResponse.json({ error: 'patientId is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'patient' | 'clinician' }>()

    if (profile?.role === 'clinician') {
      const { data: link } = await supabase
        .from('clinician_patients')
        .select('id')
        .eq('clinician_id', user.id)
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .maybeSingle()

      if (!link) {
        return NextResponse.json({ error: 'Patient not in clinician cohort' }, { status: 403 })
      }
    } else if (profile?.role === 'patient' && user.id !== patientId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { data: telemetry } = await supabase
    .from(WEARABLE_TELEMETRY_LOGS_TABLE)
    .select(
      'id, patient_id, synced_at, sleep_onset_timestamp, wake_timestamp, deep_sleep_duration_minutes, rem_duration_minutes, daily_average_hrv, intra_night_hrv_series, lux_exposure_hours, source, ingestion_tier, average_spo2, respiratory_disturbance_index, created_at'
    )
    .eq('patient_id', patientId)
    .order('synced_at', { ascending: false })
    .limit(1)
    .maybeSingle<WearableTelemetryLogRow>()

  const resolvedTelemetry: WearableTelemetryLogRow = telemetry ?? {
    ...new MockTipTraQAdapter().toWearableTelemetryInsert(patientId),
    id: 'prototype-mock',
    created_at: new Date().toISOString(),
  }

  const payload = simulateBiologicalWindowFromTelemetry(resolvedTelemetry, medicationId)

  return NextResponse.json(payload)
}
