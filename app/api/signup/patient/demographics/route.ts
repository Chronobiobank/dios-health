import { NextRequest, NextResponse } from 'next/server'

import { buildFullName } from '@/lib/auth/parse-oauth-names'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

function mapDemographicsError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('does not exist') || lower.includes('schema cache') || lower.includes('column')) {
    return 'Profile fields are not set up in the database yet. Run migration 006_patient_demographics.sql in Supabase.'
  }
  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Could not save your profile. Please sign out and sign in again.'
  }
  return 'Something went wrong. Please try again.'
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

  const fullName = buildFullName(firstName, familyName)

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      role: 'patient',
      full_name: fullName,
    },
    { onConflict: 'id' }
  )

  if (profileError) {
    console.error('Demographics profile upsert error:', profileError)
    return NextResponse.json({ error: mapDemographicsError(profileError.message) }, { status: 500 })
  }

  const { data: existingPatient } = await supabase
    .from('patient_profiles')
    .select('fitzpatrick_type, chronotype_q1')
    .eq('id', user.id)
    .maybeSingle<{ fitzpatrick_type: number | null; chronotype_q1: string | null }>()

  const { error: patientError } = await supabase.from('patient_profiles').upsert(
    {
      id: user.id,
      first_name: firstName,
      family_name: familyName,
      age,
      biological_sex: biologicalSex,
    },
    { onConflict: 'id' }
  )

  if (patientError) {
    console.error('Demographics patient upsert error:', patientError)
    return NextResponse.json({ error: mapDemographicsError(patientError.message) }, { status: 500 })
  }

  const resumeToDashboard = Boolean(
    existingPatient?.fitzpatrick_type && existingPatient.chronotype_q1
  )

  return NextResponse.json({
    success: true,
    next: resumeToDashboard ? PATIENT_ROUTES.dashboard : 'continue',
  })
}
