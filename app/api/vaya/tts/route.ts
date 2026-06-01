import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

type TtsBody = {
  text?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = (await request.json()) as TtsBody
  const text = body.text?.trim()
  if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 })

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || 'EXAVITQu4vr4xnSDxMaL'

  // Graceful fallback path: client switches to Web Speech Synthesis.
  if (!apiKey) {
    return NextResponse.json({ error: 'ElevenLabs not configured.', fallback: 'speechSynthesis' }, { status: 503 })
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_flash_v2_5',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Could not synthesize speech.', fallback: 'speechSynthesis' }, { status: 502 })
  }

  const audioBuffer = await response.arrayBuffer()

  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
