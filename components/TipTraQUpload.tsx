'use client'

import { useCallback, useState } from 'react'

export interface TipTraQUploadResult {
  night: {
    date: string
    dlmo_time: string
    confidence_score: number
    confidence_label: string
    confidence_band_minutes: number
    chronotype_signal: string
  }
  rolling: {
    nights_count: number
    dlmo_time: string
    confidence_score: number
    confidence_label: string
    confidence_band_minutes: number
    chronotype: string
    dose_windows: Record<string, string>
  }
}

interface UploadState {
  status: 'idle' | 'uploading' | 'extracting' | 'calculating' | 'complete' | 'error'
  progress: number
  result?: TipTraQUploadResult
  error?: string
}

const STATUS_MESSAGES: Record<UploadState['status'], string | null> = {
  idle: null,
  uploading: 'Uploading your report...',
  extracting: 'Reading your sleep data...',
  calculating: 'Calculating your body clock...',
  complete: null,
  error: null,
}

type TipTraQUploadProps = {
  onComplete?: (result: TipTraQUploadResult) => void
}

export default function TipTraQUpload({ onComplete }: TipTraQUploadProps) {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setState({
          status: 'error',
          progress: 0,
          error: 'Please upload a PDF file.',
        })
        return
      }

      setState({ status: 'uploading', progress: 20 })

      const formData = new FormData()
      formData.append('pdf', file)

      try {
        setState({ status: 'extracting', progress: 50 })

        const response = await fetch('/api/tiptraq/extract', {
          method: 'POST',
          body: formData,
        })

        setState((s) => ({
          ...s,
          status: 'calculating',
          progress: 80,
        }))

        if (!response.ok) {
          const err = (await response.json()) as { error?: string }
          throw new Error(err.error || 'Upload failed')
        }

        const result = (await response.json()) as TipTraQUploadResult

        setState({
          status: 'complete',
          progress: 100,
          result,
        })

        onComplete?.(result)
      } catch (error) {
        setState({
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Something went wrong. Try again.',
        })
      }
    },
    [onComplete]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const reset = () => setState({ status: 'idle', progress: 0 })

  return (
    <div className="w-full">
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
          <div className="mt-4 text-lg font-medium">Upload TipTraQ report</div>
          <div className="mt-2 text-sm text-white/60">
            Drag and drop your PDF nightly report, or tap to choose
          </div>
          <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-white/90">
            Choose PDF
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <div className="mt-4 font-mono text-[11px] text-white/40">
            One night at a time · Confidence grows with each upload
          </div>
        </div>
      )}

      {['uploading', 'extracting', 'calculating'].includes(state.status) && (
        <div className="rounded-2xl border border-black/[0.08] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="text-sm font-medium text-black">{STATUS_MESSAGES[state.status]}</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-black/50">
            {state.status === 'extracting' && 'AI is reading your sleep report...'}
            {state.status === 'calculating' && 'Applying the proxy DLMO algorithm...'}
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
              <span className="text-black/70">
                {state.result.rolling.confidence_label} confidence
              </span>
              <span className="font-mono font-medium text-black">
                {state.result.rolling.confidence_score}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${state.result.rolling.confidence_score}%` }}
              />
            </div>
            <div className="mt-2 font-mono text-[11px] text-black/45">
              ± {state.result.rolling.confidence_band_minutes} minutes
              {state.result.rolling.nights_count < 3 && (
                <span>
                  {' '}
                  · Upload {3 - state.result.rolling.nights_count} more night
                  {3 - state.result.rolling.nights_count !== 1 ? 's' : ''} for clinical confidence
                </span>
              )}
            </div>
          </div>

          {state.result.rolling.nights_count >= 3 && (
            <div className="mt-5 border-t border-black/5 pt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
                Dose windows
              </div>
              {Object.entries(state.result.rolling.dose_windows)
                .filter(([key]) => !key.includes('light'))
                .map(([drug, time]) => (
                  <div key={drug} className="mt-2 flex items-center justify-between text-sm">
                    <span className="capitalize text-black/70">{drug}</span>
                    <span className="font-mono font-medium text-black">{time}</span>
                  </div>
                ))}
            </div>
          )}

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
