'use client'

import { Check, Mic, MicOff, Type } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { VayaOrb, type VayaOrbState } from '@/components/dashboard/vaya-orb'
import type {
  TimebotData,
  TimebotTimelineEvent,
  TimebotTimelineGroup,
} from '@/lib/dashboard/timebot-data'
import { buildDemoProtocolGroup } from '@/lib/dashboard/vaya-demo-protocol'
import { runSilentMluxCapture, startVayaSession } from '@/lib/vaya/mlux-capture'
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

function ProtocolCard({
  event,
  initialConfirmed = false,
  onConfirm,
}: {
  event: TimebotTimelineEvent
  initialConfirmed?: boolean
  onConfirm?: () => void
}) {
  const [confirmed, setConfirmed] = useState(initialConfirmed)

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors',
        confirmed ? 'border-emerald-200 bg-emerald-50' : 'border-black/[0.06] bg-white'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn('text-[15px] font-medium', confirmed ? 'text-emerald-800' : 'text-black')}>
            {event.name}
          </p>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
              CATEGORY_STYLE[event.category]
            )}
          >
            {event.category}
          </span>
          <StatusPill status={event.status} />
        </div>
        <p className="mt-1 font-mono text-[13px] font-medium text-black/60">{event.timeDisplay}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-black/45">{event.instruction}</p>
      </div>

      {onConfirm && !confirmed ? (
        <button
          type="button"
          onClick={() => {
            setConfirmed(true)
            onConfirm()
          }}
          className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/60 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
        >
          Taken ✓
        </button>
      ) : confirmed ? (
        <span className="shrink-0 font-mono text-[11px] text-emerald-600">✓ Done</span>
      ) : null}
    </div>
  )
}

export function TimebotView({ data, mluxScore, introMessage }: TimebotViewProps) {
  const [pulseState, setPulseState] = useState<VayaOrbState>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [trackedSupplements, setTrackedSupplements] = useState(data.currentSupplements)
  const [input, setInput] = useState('')
  const [lastVayaResponse, setLastVayaResponse] = useState<string | null>(null)
  const [confirmedDoses, setConfirmedDoses] = useState<Set<string>>(new Set())
  const [voiceMode, setVoiceMode] = useState<'voice' | 'text'>('voice')
  const [isListening, setIsListening] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [orbVolume, setOrbVolume] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const respondTimer = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stopStreamRef = useRef<(() => void) | null>(null)
  const speakingAudioRef = useRef<HTMLAudioElement | null>(null)
  const cameraCaptureDoneRef = useRef(false)
  const showIntro = messages.length === 0
  const hasMedicationOnProtocol = data.timelineEvents.some((e) => e.category === 'Medication')
  const protocolGroups: TimebotTimelineGroup[] = hasMedicationOnProtocol
    ? data.timelineGroups
    : data.timelineGroups.length > 0
      ? [buildDemoProtocolGroup(), ...data.timelineGroups]
      : [buildDemoProtocolGroup()]

  useEffect(() => {
    return () => {
      if (respondTimer.current) window.clearTimeout(respondTimer.current)
      stopStreamRef.current?.()
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      speakingAudioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (cameraCaptureDoneRef.current) return
    cameraCaptureDoneRef.current = true
    startVayaSession()
    void runSilentMluxCapture({ videoRef })
  }, [])

  async function speakWithVaya(text: string) {
    if (voiceMode !== 'voice' || !text.trim()) return

    try {
      const response = await fetch('/api/vaya/speak', {
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

  async function handleConfirmDose(eventId: string, medicationName: string) {
    setConfirmedDoses((prev) => new Set(prev).add(eventId))
    try {
      await fetch('/api/vaya/confirm-dose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName,
          confirmedAt: new Date().toISOString(),
        }),
      })
    } catch {
      // Silent fail — UI already shows confirmed.
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
      if (result.answer) {
        setLastVayaResponse(result.answer)
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', text: result.answer ?? '' },
        ])
        void speakWithVaya(result.answer)
      }

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

  async function toggleVoice() {
    if (isListening) {
      stopStreamRef.current?.()
      stopStreamRef.current = null
      setIsListening(false)
      setOrbVolume(0)
      if (liveTranscript.trim()) {
        await sendMessage(liveTranscript.trim())
        setLiveTranscript('')
      }
      return
    }

    setIsListening(true)
    setLiveTranscript('')
    try {
      const { startDeepgramStream } = await import('@/lib/vaya/deepgram')
      const stop = startDeepgramStream(
        (text, isFinal) => {
          setLiveTranscript(text)
          setOrbVolume(text.trim() ? 0.7 : 0.28)
          if (isFinal && text.trim()) {
            stopStreamRef.current?.()
            stopStreamRef.current = null
            setIsListening(false)
            setOrbVolume(0)
            void sendMessage(text.trim())
            setLiveTranscript('')
          }
        },
        () => {
          setIsListening(false)
          setVoiceMode('text')
          setOrbVolume(0)
        }
      )
      stopStreamRef.current = stop
    } catch {
      setIsListening(false)
      setVoiceMode('text')
      setOrbVolume(0)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--color-bg-main)]">
      <video ref={videoRef} className="hidden" muted playsInline aria-hidden />

      <div className="flex flex-col items-center px-4 pb-2 pt-6">
        <div className="mb-5 flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]',
              PRECISION_STYLE[data.precisionLabel]
            )}
          >
            {PRECISION_HEADER[data.precisionLabel]}
          </span>
          <span className="font-mono text-[12px] text-black/50">{mluxScore} m-EDI lux</span>
          {mluxScore < 100 ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 font-mono text-[10px] text-red-600">
              Low — get outside
            </span>
          ) : mluxScore < 250 ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-700">
              Below target
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-700">
              On target
            </span>
          )}
        </div>

        <VayaOrb state={pulseState} volume={isListening ? Math.max(orbVolume, 0.22) : orbVolume} />

        {showIntro ? (
          <p
            className="animate-in fade-in mt-5 max-w-md px-2 text-center text-[15px] leading-relaxed text-black/70 duration-500 sm:text-[16px] sm:leading-relaxed"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            role="status"
            aria-live="polite"
          >
            {introMessage}
          </p>
        ) : null}

        {isListening && liveTranscript ? (
          <p
            className="animate-in fade-in mt-4 max-w-xs text-center text-[14px] leading-relaxed text-black/50 duration-200"
            aria-live="polite"
          >
            {liveTranscript}
          </p>
        ) : null}

        {lastVayaResponse ? (
          <div
            key={lastVayaResponse}
            className="animate-in fade-in slide-in-from-bottom-2 mt-4 w-full max-w-sm rounded-2xl border border-black/[0.07] bg-white px-5 py-4 text-[15px] leading-relaxed text-black shadow-[0_2px_12px_rgba(0,0,0,0.06)] duration-300"
            role="status"
            aria-live="polite"
          >
            {lastVayaResponse}
          </div>
        ) : null}

        {loading ? (
          <p className="mt-3 animate-pulse font-mono text-[12px] text-black/35">Vaya is thinking…</p>
        ) : null}

        {error ? (
          <p className="mt-3 text-[13px] text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        <div className="mt-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-black/35">
            Today&apos;s protocol
          </p>
          <div className="flex flex-col gap-2">
            {protocolGroups.map((group) => (
              <div key={group.minutes}>
                {group.events.map((event) => (
                  <ProtocolCard
                    key={event.id}
                    event={event}
                    initialConfirmed={confirmedDoses.has(event.id)}
                    onConfirm={
                      event.category === 'Medication'
                        ? () => void handleConfirmDose(event.id, event.name)
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>
          {!hasMedicationOnProtocol ? (
            <p className="mt-3 text-center text-[12px] leading-relaxed text-black/45">
              Example timing — tell Vaya what you take to personalise your protocol.
            </p>
          ) : null}
        </div>

        {trackedSupplements.length > 0 ? (
          <p className="mt-4 text-center font-mono text-[11px] text-black/35">
            Tracking: {trackedSupplements.join(' · ')}
          </p>
        ) : null}

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-black/20">
          Make Time Count
        </p>
      </div>

      <div className="sticky bottom-[var(--patient-nav-offset)] z-30 border-t border-black/[0.06] bg-[var(--color-bg-main)] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        {voiceMode === 'voice' ? (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setVoiceMode('text')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/30 transition-colors hover:text-black"
              aria-label="Switch to text input"
            >
              <Type className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => void toggleVoice()}
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200',
                isListening
                  ? 'scale-110 bg-red-500 text-white shadow-[0_0_0_8px_rgba(239,68,68,0.15)]'
                  : 'bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105'
              )}
              aria-label={isListening ? 'Stop — send to Vaya' : 'Speak to Vaya'}
            >
              {isListening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </button>

            <div className="h-10 w-10" aria-hidden />
          </div>
        ) : (
          <form id="vaya-form" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVoiceMode('voice')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/40 hover:text-black"
                aria-label="Switch to voice"
              >
                <Mic className="h-4 w-4" />
              </button>
              <input
                id="vaya-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type to Vaya"
                disabled={loading}
                className="calmer-input"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="calmer-submit shrink-0"
              >
                {loading ? '…' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
