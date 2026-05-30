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
      full_name?: string
      email?: string
      practice_name?: string
      registration_body?: string
      registration_number?: string
    }

    const message = [
      'New clinician verification request',
      '',
      `Name: ${body.full_name ?? ''}`,
      `Email: ${body.email ?? user.email ?? ''}`,
      `Practice: ${body.practice_name ?? ''}`,
      `Registration body: ${body.registration_body ?? ''}`,
      `Registration number: ${body.registration_number ?? ''}`,
    ].join('\n')

    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? 'DIOS <noreply@dios.health>',
          to: ['admin@dios.health'],
          subject: 'Clinician verification request — DIOS',
          text: message,
        }),
      })

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 502 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
