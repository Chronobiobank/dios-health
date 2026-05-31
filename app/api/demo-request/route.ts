import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { full_name, email, role, message, organisation } = body as {
      full_name?: string
      email?: string
      role?: string
      message?: string
      organisation?: string
    }

    const resolvedRole = role?.trim() || organisation?.trim()

    if (!full_name?.trim() || !email?.trim() || !resolvedRole) {
      return NextResponse.json(
        { error: 'Full name, email, and role are required' },
        { status: 400 }
      )
    }

    const organisationValue = message?.trim()
      ? `${resolvedRole} — ${message.trim()}`
      : resolvedRole

    const supabase = createClient(url, key)

    const { error } = await supabase.from('demo_requests').insert({
      full_name: full_name.trim(),
      organisation: organisationValue,
      email: email.trim(),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
