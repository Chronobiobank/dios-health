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
      patient_email?: string
      instruction?: string
      patient_id?: string
      drug_name?: string
    }

    if (!body.instruction?.trim()) {
      return NextResponse.json({ error: 'Instruction is required' }, { status: 400 })
    }

    if (body.patient_id?.startsWith('demo-') || !body.patient_email?.trim()) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo patient — instruction ready to share in clinic.',
      })
    }

    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? 'DIOS <noreply@dios.health>',
          to: [body.patient_email.trim()],
          subject: 'Your dose timing recommendation — DIOS',
          text: body.instruction,
        }),
      })

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
      }
    }

    await supabase.from('consultation_audit_log').insert({
      clinician_id: user.id,
      patient_id: body.patient_id ?? null,
      drug_name: body.drug_name ?? null,
      recommendation: body.instruction,
      action_taken: 'sent_to_patient',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
