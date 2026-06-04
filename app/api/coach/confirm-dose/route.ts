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

    await supabase.from('dose_events').insert({
      patient_id: user.id,
      medication_name: medicationName,
      recommended_time: new Date(confirmedAt).toTimeString().slice(0, 5),
      recommended_date: new Date(confirmedAt).toISOString().slice(0, 10),
      patient_reported_time: new Date(confirmedAt).toTimeString().slice(0, 5),
      patient_reported_at: confirmedAt,
      adherence_delta_minutes: 0,
      confirmed: true,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to confirm dose' }, { status: 500 })
  }
}
