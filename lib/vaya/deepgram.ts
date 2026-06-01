'use client'

type TranscriptHandler = (text: string, isFinal: boolean) => void
type ErrorHandler = () => void

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

type SpeechRecognitionEvent = Event & {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0: {
      transcript: string
    }
  }>
}

type WindowWithRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionCtor
  webkitSpeechRecognition?: SpeechRecognitionCtor
}

/**
 * Starts a local speech transcript stream.
 * Placeholder for Deepgram realtime stream; uses browser SpeechRecognition where available.
 */
export function startDeepgramStream(
  onTranscript: TranscriptHandler,
  onError: ErrorHandler
): () => void {
  const win = window as WindowWithRecognition
  const Recognition = win.SpeechRecognition ?? win.webkitSpeechRecognition

  if (!Recognition) {
    onError()
    return () => {}
  }

  const recognition = new Recognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'en-NZ'

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let transcript = ''
    let hasFinal = false
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript
      if (event.results[i].isFinal) hasFinal = true
    }
    onTranscript(transcript.trim(), hasFinal)
  }

  recognition.onerror = () => {
    onError()
  }

  recognition.onend = () => {
    // Caller controls restarts; this keeps behavior explicit.
  }

  recognition.start()

  return () => {
    recognition.stop()
  }
}
