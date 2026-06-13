import { NextResponse } from 'next/server'

import {
  getPatientFulfillmentSummary,
  getRequirementsForCohortPatient,
} from '@/lib/fulfillment/service'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const url = new URL(request.url)
    const cohortRef = url.searchParams.get('cohortRef')
    const protocolType = url.searchParams.get('protocolType')
    const patientId = url.searchParams.get('patientId') ?? user.id

    if (cohortRef && protocolType) {
      const requirements = await getRequirementsForCohortPatient(protocolType, cohortRef)
      return NextResponse.json({ requirements })
    }

    const summary = await getPatientFulfillmentSummary(supabase, patientId)
    return NextResponse.json(summary)
  } catch (err) {
    console.error('[fulfillment/requirements]', err)
    return NextResponse.json({ error: 'Failed to load requirements' }, { status: 500 })
  }
}
