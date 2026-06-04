import { NextRequest, NextResponse } from 'next/server'

import { mapSignupDbError } from '@/lib/auth/map-signup-db-error'
import { createClient } from '@/lib/supabase/server'

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
    const message = mapSignupDbError(rpcError.message)
    const status = message === 'Unauthorised' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({
    success: true,
    next: 'continue',
  })
}
