import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

type ConfirmDoseBody = {
  medicationName: string
  confirmedAt: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { medicationName, confirmedAt } = (await request.json()) as ConfirmDoseBody
    if (!medicationName?.trim() || !confirmedAt) {
      return NextResponse.json({ error: 'medicationName and confirmedAt are required' }, { status: 400 })
    }

    const confirmed = new Date(confirmedAt)
    if (Number.isNaN(confirmed.getTime())) {
      return NextResponse.json({ error: 'Invalid confirmedAt' }, { status: 400 })
    }

    const { error } = await supabase.from('dose_events').insert({
      patient_id: user.id,
      medication_name: medicationName.trim(),
      recommended_time: confirmed.toTimeString().slice(0, 5),
      recommended_date: confirmed.toISOString().slice(0, 10),
      patient_reported_time: confirmed.toTimeString().slice(0, 5),
      patient_reported_at: confirmed.toISOString(),
      adherence_delta_minutes: 0,
      confirmed: true,
    })

    if (error) {
      console.error('[coach/confirm-dose]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to confirm dose' }, { status: 500 })
  }
}
