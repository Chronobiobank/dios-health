import { NextResponse } from 'next/server'

import {
  CHRONOBIOBANK_CONSENT_TOGGLES,
  consentStateFromRow,
} from '@/lib/chronobiobank/consent-toggles'
import type { ChronobiobankConsentDimension } from '@/lib/chronobiobank/types'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const CONSENT_VERSION = 'v2.0'

const VALID_DIMENSIONS = new Set<ChronobiobankConsentDimension>(
  CHRONOBIOBANK_CONSENT_TOGGLES.map((t) => t.dimension)
)

type PatchBody = {
  dimension: ChronobiobankConsentDimension
  enabled: boolean
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('chronobiobank_consent')
    .select(
      'consent_academic_research, consent_pharma_discovery, consent_ai_training, consent_open_source_challenges, consent_version, updated_at, governance_weight'
    )
    .eq('patient_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    consent: consentStateFromRow(data),
    governanceWeight: data?.governance_weight ?? 10,
  })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = (await request.json()) as PatchBody
  if (!VALID_DIMENSIONS.has(body.dimension) || typeof body.enabled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid consent update' }, { status: 400 })
  }

  const toggle = CHRONOBIOBANK_CONSENT_TOGGLES.find((t) => t.dimension === body.dimension)
  if (!toggle) {
    return NextResponse.json({ error: 'Unknown dimension' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('chronobiobank_consent')
    .select(toggle.column)
    .eq('patient_id', user.id)
    .maybeSingle()

  const previousRow = existing as Record<string, boolean | null | undefined> | null
  const previousValue =
    previousRow && toggle.column in previousRow
      ? Boolean(previousRow[toggle.column])
      : null

  const { error: upsertError } = await supabase.from('chronobiobank_consent').upsert(
    {
      patient_id: user.id,
      [toggle.column]: body.enabled,
      consent_version: CONSENT_VERSION,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'patient_id' }
  )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  const { error: auditError } = await supabase.from('chronobiobank_consent_audit').insert({
    patient_id: user.id,
    dimension: body.dimension,
    previous_value: previousValue,
    new_value: body.enabled,
    consent_version: CONSENT_VERSION,
  })

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 500 })
  }

  const { data: refreshed } = await supabase
    .from('chronobiobank_consent')
    .select(
      'consent_academic_research, consent_pharma_discovery, consent_ai_training, consent_open_source_challenges, consent_version, updated_at, governance_weight'
    )
    .eq('patient_id', user.id)
    .maybeSingle()

  return NextResponse.json({ consent: consentStateFromRow(refreshed) })
}
