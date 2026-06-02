import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

type DeepgramResult = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string
      }>
    }>
  }
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return jsonError('Unauthorised', 401)

  const apiKey = process.env.DEEPGRAM_API_KEY?.trim()
  if (!apiKey) return jsonError('Voice transcription unavailable. Please type your message.', 503)

  const formData = await request.formData()
  const audioFile = formData.get('audio')
  if (!(audioFile instanceof File)) return jsonError('Audio input is required.', 400)

  const buffer = await audioFile.arrayBuffer()
  if (buffer.byteLength === 0) return jsonError('Audio input is empty.', 400)

  const response = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': audioFile.type || 'audio/webm',
      },
      body: buffer,
    }
  )

  if (!response.ok) {
    return jsonError('Could not transcribe voice. Please type your message.', 502)
  }

  const data = (await response.json()) as DeepgramResult
  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? ''

  if (!transcript) {
    return jsonError('No speech detected. Please try again or type your message.', 422)
  }

  return NextResponse.json({ transcript })
}
