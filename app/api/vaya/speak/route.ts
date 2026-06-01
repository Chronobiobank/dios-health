import { NextResponse } from 'next/server'

import { synthesizeSpeech } from '@/lib/vaya/elevenlabs'
import { createClient } from '@/lib/supabase/server'

type SpeakBody = {
  text?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = (await request.json()) as SpeakBody
  const text = body.text?.trim()
  if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 })

  const result = await synthesizeSpeech(text)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fallback: result.fallback },
      { status: result.fallback === 'speechSynthesis' ? 503 : 502 }
    )
  }

  return new NextResponse(result.audio, {
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': 'no-store',
    },
  })
}
