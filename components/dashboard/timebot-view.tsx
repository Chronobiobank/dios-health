'use client'

import { Check, Mic, MicOff } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { VayaLottie, type VayaLottieState } from '@/components/dashboard/vaya-lottie'
import type {
  TimebotData,
  TimebotTimelineEvent,
  TimebotTimelineGroup,
} from '@/lib/dashboard/timebot-data'
import type { ScheduleStatus, TimebotEventCategory } from '@/lib/dashboard/timebot-timeline'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

type TimebotViewProps = {
  data: TimebotData
  mluxScore: number
  introMessage: string
}

const PRECISION_HEADER: Record<TimebotData['precisionLabel'], string> = {
  ESTIMATED: 'ESTIMATED',
  PRECISION: 'PRECISION',
  CONFIRMED: 'CONFIRMED',
}

const PRECISION_STYLE: Record<TimebotData['precisionLabel'], string> = {
  ESTIMATED: 'bg-amber-500/10 text-amber-900',
  PRECISION: 'bg-teal-600/10 text-teal-900',
  CONFIRMED: 'bg-emerald-600/10 text-emerald-900',
}

const CATEGORY_STYLE: Record<TimebotEventCategory, string> = {
  Light: 'bg-amber-500/10 text-amber-900',
  Meal: 'bg-orange-500/10 text-orange-900',
  Movement: 'bg-sky-500/10 text-sky-900',
  Medication: 'bg-violet-500/10 text-violet-900',
  Supplement: 'bg-teal-600/10 text-teal-900',
  Darkness: 'bg-indigo-500/10 text-indigo-900',
}

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  upcoming: 'Upcoming',
  now: 'Now',
  done: 'Done',
}

function StatusPill({ status }: { status: ScheduleStatus }) {
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-emerald-800">
        <Check className="h-3 w-3" aria-hidden />
        Done
      </span>
    )
  }

  if (status === 'now') {
    return (
      <span className="inline-flex items-center rounded-full bg-teal-600/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-teal-800">
        <span className="mr-1.5 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-teal-600" aria-hidden />
        Now
      </span>
    )
  }

  return (
    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-black/45">
      {STATUS_LABEL.upcoming}
    </span>
  )
}

function TimelineEventRow({ event }: { event: TimebotTimelineEvent }) {
  return (
    <li className="border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[15px] font-medium leading-snug text-black">{event.name}</p>
        <StatusPill status={event.status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
            CATEGORY_STYLE[event.category]
          )}
        >
          {event.category}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-black/55">{event.instruction}</p>
    </li>
  )
}

function TimelineGroup({ group }: { group: TimebotTimelineGroup }) {
  return (
    <section className="relative pl-0">
      <p className="font-mono text-[15px] font-bold tabular-nums text-black">{group.timeDisplay}</p>
      <ul className="mt-2">
        {group.events.map((event) => (
          <TimelineEventRow key={event.id} event={event} />
        ))}
      </ul>
    </section>
  )
}

export function TimebotView({ data, mluxScore, introMessage }: TimebotViewProps) {
  const [pulseState, setPulseState] = useState<VayaLottieState>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [trackedSupplements, setTrackedSupplements] = useState(data.currentSupplements)
  const [input, setInput] = useState('')
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(true)
  const [voiceAvailable, setVoiceAvailable] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const respondTimer = useRef<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const cameraCaptureDoneRef = useRef(false)
  const speakingAudioRef = useRef<HTMLAudioElement | null>(null)
  const showIntro = messages.length === 0

  useEffect(() => {
    return () => {
      if (respondTimer.current) window.clearTimeout(respondTimer.current)
      mediaRecorderRef.current?.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      speakingAudioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function initMediaAndCaptureMlux() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: 'user' },
        })

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        setVoiceAvailable(true)
        setVoiceModeEnabled(true)

        if (!cameraCaptureDoneRef.current) {
          cameraCaptureDoneRef.current = true
          const now = new Date()
          const hour = now.getHours().toString().padStart(2, '0')
          const minute = now.getMinutes().toString().padStart(2, '0')

          // Silent one-time MLux phase capture; never blocks the session if it fails.
          void fetch('/api/smartphone/observations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sleep_onset_local: `${hour}:${minute}`,
              sleep_onset_estimated: true,
              outdoor_light_before_10am: now.getHours() < 10,
            }),
          }).catch(() => {
            // swallow: capture is best-effort
          })
        }
      } catch {
        // Permission denied/unavailable -> degrade gracefully to text-only session.
        if (mounted) {
          setVoiceAvailable(false)
          setVoiceModeEnabled(false)
        }
      }
    }

    void initMediaAndCaptureMlux()

    return () => {
      mounted = false
    }
  }, [])

  async function speakWithVaya(text: string) {
    if (!voiceModeEnabled || !text.trim()) return

    try {
      const response = await fetch('/api/vaya/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        speakingAudioRef.current = audio
        audio.onended = () => URL.revokeObjectURL(audioUrl)
        await audio.play()
        return
      }
    } catch {
      // Fall through to browser speech synthesis.
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.96
      utterance.pitch = 1.0
      utterance.lang = 'en-NZ'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  async function transcribeAndSendVoice(blob: Blob) {
    setIsTranscribing(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'vaya-input.webm')
      const response = await fetch('/api/vaya/stt', {
        method: 'POST',
        body: formData,
      })
      const result = (await response.json()) as { transcript?: string; error?: string }
      if (!response.ok || !result.transcript?.trim()) {
        setError(result.error ?? 'Could not transcribe voice. Please type your message.')
        return
      }
      await sendMessage(result.transcript.trim())
    } catch {
      setError('Could not transcribe voice. Please type your message.')
    } finally {
      setIsTranscribing(false)
    }
  }

  async function toggleRecording() {
    if (!voiceAvailable || loading || isTranscribing) return

    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    const stream = streamRef.current
    if (!stream) {
      setVoiceAvailable(false)
      setVoiceModeEnabled(false)
      return
    }

    try {
      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        if (blob.size > 0) void transcribeAndSendVoice(blob)
      }
      recorder.start()
      setIsRecording(true)
    } catch {
      setVoiceAvailable(false)
      setVoiceModeEnabled(false)
    }
  }

  async function sendMessage(question: string) {
    if (!question || loading) return

    setInput('')
    setError(null)
    setLoading(true)
    setPulseState('thinking')
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: question }])

    try {
      const response = await fetch('/api/timebot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })

      const result = (await response.json()) as {
        answer?: string
        error?: string
        supplementsSaved?: string[]
      }

      if (!response.ok) {
        setError(result.error ?? 'Vaya could not answer right now.')
        setPulseState('idle')
        return
      }

      if (result.supplementsSaved?.length) {
        setTrackedSupplements(result.supplementsSaved)
      }

      setPulseState('responding')
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: result.answer ?? '' },
      ])
      void speakWithVaya(result.answer ?? '')

      if (respondTimer.current) window.clearTimeout(respondTimer.current)
      respondTimer.current = window.setTimeout(() => setPulseState('idle'), 3000)
    } catch {
      setError('Vaya could not answer right now.')
      setPulseState('idle')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await sendMessage(input.trim())
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-[calc(var(--patient-nav-offset)+5.5rem)] lg:pb-8">
      <div className="flex flex-col items-center px-2 pt-2 text-center">
        <VayaLottie
          state={pulseState}
          size="lg"
          bubbleVariant="intro"
          greeting={showIntro ? introMessage : undefined}
        />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]',
              PRECISION_STYLE[data.precisionLabel]
            )}
          >
            {PRECISION_HEADER[data.precisionLabel]}
          </span>
          <span className="font-mono text-[12px] text-black/50">
            {mluxScore} m-EDI lux
          </span>
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="chat-thread mt-8 border-t border-black/[0.06] pt-6">
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                data-role={message.role}
                className={cn(
                  'message-bubble',
                  loading &&
                    message.role === 'assistant' &&
                    message.id === messages[messages.length - 1]?.id &&
                    'streaming-cursor'
                )}
              >
                {message.text}
              </div>
            ))}
            {loading ? (
              <div className="message-bubble" data-role="assistant" style={{ opacity: 0.5 }}>
                <span className="font-mono text-[13px]">Vaya is thinking…</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {data.hasTimeline && data.timelineGroups.length > 0 ? (
        <div className="mt-8 border-t border-black/[0.06] pt-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-black/40">
            Today&apos;s schedule
          </p>
          <div className="flex flex-col gap-6">
            {data.timelineGroups.map((group) => (
              <TimelineGroup key={group.minutes} group={group} />
            ))}
          </div>
        </div>
      ) : null}

      {trackedSupplements.length > 0 ? (
        <p className="mt-4 text-center text-[12px] leading-relaxed text-black/45">
          Tracking: {trackedSupplements.join(', ')}
        </p>
      ) : null}

      <form
        id="vaya-form"
        onSubmit={handleSubmit}
        className="input-sticky-dock fixed inset-x-0 bottom-[var(--patient-nav-offset)] z-30 lg:static lg:z-auto lg:mx-auto lg:max-w-[var(--max-width-chat)]"
      >
        <label htmlFor="vaya-input" className="sr-only">
          Ask Vaya about your light and timing
        </label>
        <div className="input-sticky-dock__inner">
          <input
            id="vaya-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Vaya about your light and timing"
            disabled={loading}
            className="calmer-input"
          />
          {voiceModeEnabled && voiceAvailable ? (
            <button
              type="button"
              onClick={() => void toggleRecording()}
              disabled={loading || isTranscribing}
              className={cn(
                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors',
                isRecording && 'border-red-600/50 bg-red-50 text-red-700',
                (loading || isTranscribing) && 'cursor-not-allowed opacity-50'
              )}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="calmer-submit"
          >
            {loading || isTranscribing ? '…' : 'Send'}
          </button>
        </div>
        {voiceModeEnabled && voiceAvailable ? (
          <p className="type-caption mt-2 text-center text-black/45">
            Voice mode on by default. Type anytime if preferred.
          </p>
        ) : (
          <p className="type-caption mt-2 text-center text-black/45">
            Voice unavailable — using text input.
          </p>
        )}
        {error ? (
          <p className="type-caption mt-2 text-center text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
