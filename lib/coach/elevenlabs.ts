export type ElevenLabsSynthesisResult =
  | { ok: true; audio: ArrayBuffer; contentType: string }
  | { ok: false; error: string; fallback: 'speechSynthesis' }

const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const DEFAULT_MODEL_ID = 'eleven_flash_v2_5'

export function getElevenLabsVoiceId(): string {
  return process.env.ELEVENLABS_VOICE_ID?.trim() || DEFAULT_VOICE_ID
}

export function isElevenLabsConfigured(): boolean {
  return Boolean(process.env.ELEVENLABS_API_KEY?.trim())
}

/** Server-side ElevenLabs TTS — used by /api/coach/speak and /api/coach/tts. */
export async function synthesizeSpeech(text: string): Promise<ElevenLabsSynthesisResult> {
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, error: 'Text is required.', fallback: 'speechSynthesis' }
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  if (!apiKey) {
    return {
      ok: false,
      error: 'ElevenLabs not configured.',
      fallback: 'speechSynthesis',
    }
  }

  const voiceId = getElevenLabsVoiceId()

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: trimmed,
      model_id: DEFAULT_MODEL_ID,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  })

  if (!response.ok) {
    return {
      ok: false,
      error: 'Could not synthesize speech.',
      fallback: 'speechSynthesis',
    }
  }

  const audio = await response.arrayBuffer()
  return {
    ok: true,
    audio,
    contentType: response.headers.get('Content-Type') ?? 'audio/mpeg',
  }
}
