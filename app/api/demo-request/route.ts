import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { full_name, organisation, email } = body as {
      full_name?: string
      organisation?: string
      email?: string
    }

    if (!full_name?.trim() || !organisation?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'full_name, organisation, and email are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(url, key)

    const { error } = await supabase.from('demo_requests').insert({
      full_name: full_name.trim(),
      organisation: organisation.trim(),
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
