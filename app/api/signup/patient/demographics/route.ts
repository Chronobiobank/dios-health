import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

function mapDemographicsError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('terms of service') || lower.includes('privacy policy')) {
    return 'You must accept the Terms of Service and Privacy Policy.'
  }

  if (lower.includes('first and family name')) {
    return 'First and family name are required.'
  }

  if (lower.includes('biological sex')) {
    return 'Biological sex is required.'
  }

  if (lower.includes('valid age')) {
    return 'Enter a valid age between 13 and 120.'
  }

  if (lower.includes('not authenticated')) {
    return 'Unauthorised'
  }

  if (lower.includes('save_patient_demographics') || lower.includes('could not find the function')) {
    return 'Signup save function missing. Run supabase/run-patient-signup-fields.sql in Supabase SQL Editor.'
  }

  if (lower.includes('schema cache')) {
    return 'Database schema cache is stale. Re-run supabase/run-patient-signup-fields.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Could not save your profile. Please sign out and sign in again.'
  }

  return message || 'Something went wrong. Please try again.'
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: {
    firstName?: string
    familyName?: string
    age?: number
    biologicalSex?: string
    acceptTerms?: boolean
  }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const firstName = body.firstName?.trim() ?? ''
  const familyName = body.familyName?.trim() ?? ''
  const age = body.age
  const biologicalSex = body.biologicalSex?.trim() ?? ''

  if (!firstName || !familyName) {
    return NextResponse.json({ error: 'First and family name are required.' }, { status: 400 })
  }

  if (!biologicalSex) {
    return NextResponse.json({ error: 'Biological sex is required.' }, { status: 400 })
  }

  if (!Number.isFinite(age) || age! < 13 || age! > 120) {
    return NextResponse.json({ error: 'Enter a valid age between 13 and 120.' }, { status: 400 })
  }

  const { error: rpcError } = await supabase.rpc('save_patient_demographics', {
    p_first_name: firstName,
    p_family_name: familyName,
    p_age: age,
    p_biological_sex: biologicalSex,
    p_accept_terms: Boolean(body.acceptTerms),
  })

  if (rpcError) {
    console.error('Demographics RPC error:', rpcError)
    const message = mapDemographicsError(rpcError.message)
    const status = message === 'Unauthorised' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({
    success: true,
    next: 'continue',
  })
}
