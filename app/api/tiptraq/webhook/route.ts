import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function calculateDlmoOffset(dlmoProxy: string): number {
  const POPULATION_AVERAGE_MINS = 1260
  const [h, m] = dlmoProxy.split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0
  const dlmoMins = h * 60 + m
  return dlmoMins - POPULATION_AVERAGE_MINS
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl?.trim() || !serviceKey?.trim()) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 503 })
  }

  const signature = req.headers.get('x-pranaq-signature')
  const webhookSecret = process.env.PRANAQ_WEBHOOK_SECRET

  if (!webhookSecret?.trim() || !signature || signature !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const patient_id = body.patient_id as string | undefined
  const device_id = body.device_id as string | undefined
  const dlmo_proxy = body.dlmo_proxy as string | undefined
  const recorded_at = (body.recorded_at as string | undefined) ?? new Date().toISOString()

  if (!patient_id || !dlmo_proxy) {
    return NextResponse.json({ error: 'patient_id and dlmo_proxy are required' }, { status: 400 })
  }

  const { error } = await supabase.from('mlux_profiles').upsert(
    {
      patient_id,
      diagnostic_tier: 'L1',
      has_tipraq: true,
      tiptraq_device_id: device_id ?? null,
      tiptraq_paired_at: recorded_at,
      dlmo_proxy,
      dlmo_offset_mins: calculateDlmoOffset(dlmo_proxy),
      mlux_score: typeof body.sns_activity === 'number' ? body.sns_activity : null,
      sleep_efficiency: typeof body.sleep_efficiency === 'number' ? body.sleep_efficiency : null,
      rem_latency_mins: typeof body.rem_latency_mins === 'number' ? body.rem_latency_mins : null,
      ahi: typeof body.ahi === 'number' ? body.ahi : null,
      last_updated: recorded_at,
    },
    { onConflict: 'patient_id' }
  )

  if (error) {
    console.error('TipTraQ webhook mlux_profiles upsert:', error)
    return NextResponse.json({ error: 'Could not persist TipTraQ data' }, { status: 500 })
  }

  const edgeUrl = `${supabaseUrl}/functions/v1/calculate-dina-windows`
  void fetch(edgeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patient_id }),
  }).catch((err) => {
    console.error('TipTraQ webhook window recalculation:', err)
  })

  return NextResponse.json({ received: true })
}
