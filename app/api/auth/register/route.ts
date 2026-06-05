import { NextResponse } from 'next/server'

import { mapSignupDbError } from '@/lib/auth/map-signup-db-error'
import { readPatientMedicationList } from '@/lib/medication/patient-medications'
import { seedRetinomicPatientRecord } from '@/lib/auth/seed-retinomic-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { createAdminClient } from '@/lib/supabase/admin'
import type { IrisPigment } from '@/src/types'

export const dynamic = 'force-dynamic'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

type RegisterBody = {
  email?: string
  password?: string
  firstName?: string
  familyName?: string
  irisPigment?: IrisPigment
  skinITA?: number
  onboardingLat?: number
  onboardingLng?: number
  currentMedications?: unknown
}

export async function POST(request: Request) {
  let body: RegisterBody

  try {
    body = (await request.json()) as RegisterBody
  } catch {
    return errorResponse('Invalid request.', 400)
  }

  const email = body.email?.trim().toLowerCase() ?? ''
  const password = body.password ?? ''
  const firstName = body.firstName?.trim() ?? ''

  if (!email || !password || password.length < 8) {
    return errorResponse('Email and password (8+ characters) are required.', 400)
  }

  if (!firstName) {
    return errorResponse('First name is required.', 400)
  }

  const irisPigment =
    body.irisPigment === 'LIGHT' || body.irisPigment === 'DARK' ? body.irisPigment : 'DARK'
  const skinITA =
    typeof body.skinITA === 'number' && Number.isFinite(body.skinITA) ? body.skinITA : 38
  const lat =
    typeof body.onboardingLat === 'number' && Number.isFinite(body.onboardingLat)
      ? body.onboardingLat
      : -36.85
  const lng =
    typeof body.onboardingLng === 'number' && Number.isFinite(body.onboardingLng)
      ? body.onboardingLng
      : 174.76
  const currentMedications = readPatientMedicationList(body.currentMedications)

  try {
    const admin = createAdminClient()

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: firstName,
        first_name: firstName,
        family_name: body.familyName?.trim() || null,
      },
    })

    if (createError || !created.user) {
      const msg = createError?.message?.toLowerCase() ?? ''
      if (msg.includes('already') || msg.includes('registered')) {
        return errorResponse('An account with this email already exists. Sign in instead.', 409)
      }
      console.error('[auth/register] createUser:', createError)
      return errorResponse('Could not create your account. Try again shortly.', 500)
    }

    const { error: seedError } = await seedRetinomicPatientRecord(admin, {
      userId: created.user.id,
      email,
      firstName,
      familyName: body.familyName?.trim() || null,
      irisPigment,
      skinITA,
      lat,
      lng,
      currentMedications,
    })

    if (seedError) {
      console.error('[auth/register] seed:', seedError)
      await admin.auth.admin.deleteUser(created.user.id)
      return errorResponse(mapSignupDbError(seedError), 500)
    }

    return NextResponse.json({
      success: true,
      tier: 'FREE_SCREENING',
      next: PATIENT_ROUTES.dashboard,
      userId: created.user.id,
    })
  } catch (error) {
    console.error('[auth/register]', error)
    return errorResponse('Registration is temporarily unavailable.', 500)
  }
}
