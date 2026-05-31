'use client'

import { useCallback, useState } from 'react'

import { runTipTraqEdfUpload, type TipTraqUploadResult } from '@/lib/tiptraq/run-edf-upload'

export type { TipTraqUploadResult }

type UploadState = {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  result?: TipTraqUploadResult
  error?: string
}

const STATUS_MESSAGES: Record<UploadState['status'], string | null> = {
  idle: null,
  uploading: 'Step 1–2: Uploading to secure storage...',
  processing: 'Step 3: Calculating your body clock...',
  complete: null,
  error: null,
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (/not valid JSON|Unexpected token|Request Entity Too Large|413/i.test(message)) {
    return 'Upload failed — hard-refresh this page (Ctrl+Shift+R) and try again. Your EDF must upload to storage first, not directly to the extract API.'
  }

  return message || 'Upload failed. Please try again.'
}

type TipTraqEdfUploadProps = {
  onComplete?: (result: TipTraqUploadResult) => void
}

export function TipTraqEdfUpload({ onComplete }: TipTraqEdfUploadProps) {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      setState({ status: 'uploading', progress: 35 })

      try {
        setState({ status: 'processing', progress: 75 })
        const result = await runTipTraqEdfUpload(file)
        setState({ status: 'complete', progress: 100, result })
        onComplete?.(result)
      } catch (error) {
        setState({ status: 'error', progress: 0, error: friendlyError(error) })
      }
    },
    [onComplete]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const picked = e.dataTransfer.files[0]
      if (picked) void processFile(picked)
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = e.target.files?.[0]
      if (picked) void processFile(picked)
    },
    [processFile]
  )

  const reset = () => setState({ status: 'idle', progress: 0 })

  return (
    <div className="w-full" data-tiptraq-upload="signed-flow-v2">
      {state.status === 'idle' && (
        <div
          className={`rounded-2xl border border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? 'border-teal-600 bg-teal-50/50'
              : 'border-black/15 bg-neutral-950 text-white'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">
            ↑
          </div>
          <div className="mt-4 text-lg font-medium">Upload TipTraQ channel data</div>
          <div className="mt-2 text-sm text-white/60">
            Drag and drop your EDF nightly recording, or tap to choose
          </div>
          <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-white/90">
            Choose EDF file
            <input
              type="file"
              accept=".edf,application/edf,application/octet-stream"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <div className="mt-4 font-mono text-[11px] text-white/40">
            European Data Format (.edf) · One night at a time · Max 50MB
          </div>
        </div>
      )}

      {['uploading', 'processing'].includes(state.status) && (
        <div className="rounded-2xl border border-black/[0.08] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="text-sm font-medium text-black">{STATUS_MESSAGES[state.status]}</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {state.status === 'complete' && state.result && (
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="border-b border-black/5 pb-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
              Night {state.result.rolling.nights_count} · {state.result.night.date}
            </div>
            <div className="mt-3 text-lg font-medium text-black">
              Melatonin rises at <strong>{state.result.night.dlmo_time}</strong>
            </div>
            <div className="mt-1 text-sm text-black/55">{state.result.night.chronotype_signal}</div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/70">{state.result.rolling.confidence_label} confidence</span>
              <span className="font-mono font-medium text-black">
                {state.result.rolling.confidence_score}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${Math.min(100, state.result.rolling.confidence_score)}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-[11px] text-black/45">
              ± {state.result.rolling.confidence_band_minutes} minutes
              {state.result.rolling.nights_count < 3 && (
                <span>
                  {' '}
                  · Upload {3 - state.result.rolling.nights_count} more night
                  {state.result.rolling.nights_count !== 1 ? 's' : ''} for clinical confidence
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-full border border-black/10 py-3 text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-black/5"
            onClick={reset}
          >
            Upload another night →
          </button>
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <div className="text-sm text-red-800">{state.error}</div>
          <button
            type="button"
            className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-transform duration-100 active:scale-[0.97]"
            onClick={reset}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
