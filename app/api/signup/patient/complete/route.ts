import { NextRequest, NextResponse } from 'next/server'

import { mapSignupDbError } from '@/lib/auth/map-signup-db-error'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Session not ready. Try signing in again.' }, { status: 401 })
  }

  let body: { firstName?: string; familyName?: string; researchConsent?: boolean }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const firstName = body.firstName?.trim() ?? ''
  const familyName = body.familyName?.trim() ?? ''

  if (!firstName) {
    return NextResponse.json({ error: 'First name is required.' }, { status: 400 })
  }

  const { error: rpcError } = await supabase.rpc('complete_patient_signup', {
    p_first_name: firstName,
    p_family_name: familyName || null,
    p_research_consent: Boolean(body.researchConsent),
  })

  if (rpcError) {
    console.error('complete_patient_signup RPC error:', rpcError)
    return NextResponse.json(
      { error: mapSignupDbError(rpcError.message) },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    next: AUTH_ROUTES.patientChronoprofile,
  })
}
