import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as {
      patient_id?: string
      drug_name?: string
      recommendation?: string
      action_taken?: string
    }

    const loggedAt = new Date().toISOString()
    const isDemoPatient = body.patient_id?.startsWith('demo-')

    const { error } = await supabase.from('consultation_audit_log').insert({
      clinician_id: user.id,
      patient_id: isDemoPatient ? null : body.patient_id ?? null,
      drug_name: body.drug_name ?? null,
      recommendation: body.recommendation ?? null,
      action_taken: body.action_taken ?? 'instruction_generated',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, loggedAt })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
