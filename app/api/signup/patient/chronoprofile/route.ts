import { NextRequest, NextResponse } from 'next/server'

import { mapSignupDbError } from '@/lib/auth/map-signup-db-error'
import {
  savePatientChronoprofileDirect,
  type ChronoprofilePayload,
} from '@/lib/auth/save-patient-chronoprofile'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { validatePatientDateOfBirth } from '@/lib/patient-dashboard/date-of-birth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Session not ready. Sign in and try again.' }, { status: 401 })
  }

  let body: ChronoprofilePayload

  try {
    body = (await request.json()) as ChronoprofilePayload
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const dobCheck = validatePatientDateOfBirth(body.dateOfBirth ?? '')
  if (!dobCheck.ok) {
    return NextResponse.json({ error: dobCheck.message }, { status: 400 })
  }

  const payload: ChronoprofilePayload = {
    dateOfBirth: body.dateOfBirth.trim(),
    biologicalSex: body.biologicalSex?.trim() ?? '',
    fitzpatrickType: body.fitzpatrickType ?? 0,
    locationCity: body.locationCity?.trim() ?? '',
    locationCountry: body.locationCountry?.trim() ?? '',
    shiftWorker: Boolean(body.shiftWorker),
    shiftPattern: body.shiftPattern?.trim() ?? '',
    chronotypeQ1: body.chronotypeQ1?.trim() ?? '',
    chronotypeQ2: body.chronotypeQ2?.trim() ?? '',
    chronotypeQ3: body.chronotypeQ3?.trim() ?? '',
  }

  const { error: rpcError } = await supabase.rpc('complete_patient_chronoprofile', {
    p_date_of_birth: payload.dateOfBirth,
    p_biological_sex: payload.biologicalSex,
    p_fitzpatrick_type: payload.fitzpatrickType,
    p_location_city: payload.locationCity,
    p_location_country: payload.locationCountry,
    p_shift_worker: payload.shiftWorker,
    p_shift_pattern: payload.shiftPattern,
    p_chronotype_q1: payload.chronotypeQ1,
    p_chronotype_q2: payload.chronotypeQ2,
    p_chronotype_q3: payload.chronotypeQ3,
  })

  if (rpcError) {
    console.error('complete_patient_chronoprofile RPC error:', rpcError)

    const { error: directError } = await savePatientChronoprofileDirect(
      supabase,
      user.id,
      payload
    )
    if (!directError) {
      return NextResponse.json({
        success: true,
        next: PATIENT_ROUTES.dashboard,
      })
    }

    console.error('chronoprofile direct save error:', directError)
    return NextResponse.json(
      { error: mapSignupDbError(directError ?? rpcError.message) },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    next: PATIENT_ROUTES.dashboard,
  })
}
