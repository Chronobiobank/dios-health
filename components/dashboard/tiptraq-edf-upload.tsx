'use client'

import { useCallback, useState } from 'react'

import { getTipTraqUploadMaxBytes, isEdfFile } from '@/lib/tiptraq/edf-parser'
import { createClient } from '@/lib/supabase/client'

export type TipTraqUploadResult = {
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

type UploadState = {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  result?: TipTraqUploadResult
  error?: string
}

const STATUS_MESSAGES: Record<UploadState['status'], string | null> = {
  idle: null,
  uploading: 'Uploading to secure storage...',
  processing: 'Calculating your body clock...',
  complete: null,
  error: null,
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (/not valid JSON|Unexpected token|Request Entity Too Large|413/i.test(message)) {
    return 'Upload failed — your EDF file may be too large (max 50MB). If the file is small, hard-refresh this page (Ctrl+Shift+R) and try again.'
  }

  return message || 'Upload failed. Please try again.'
}

async function readJson<T extends { error?: string }>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) {
    throw new Error(`Server returned empty response (HTTP ${response.status})`)
  }
  try {
    return JSON.parse(text) as T
  } catch {
    if (/request entity too large|413/i.test(text)) {
      throw new Error('File is too large. EDF uploads must be under 50MB.')
    }
    throw new Error(text.slice(0, 200))
  }
}

async function runTipTraqUpload(file: File): Promise<TipTraqUploadResult> {
  if (!isEdfFile(file)) {
    throw new Error('Please upload a TipTraQ channel export (.edf file).')
  }

  const maxBytes = getTipTraqUploadMaxBytes()
  if (file.size > maxBytes) {
    throw new Error(`EDF file must be under 50MB (yours is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`)
  }

  const signResponse = await fetch('/api/tiptraq/signed-upload', { method: 'POST' })
  const signed = await readJson<{
    error?: string
    storagePath?: string
    signedUrl?: string
  }>(signResponse)

  if (!signResponse.ok || !signed.storagePath || !signed.signedUrl) {
    throw new Error(signed.error || 'Could not prepare upload. Check Supabase storage is set up.')
  }

  const putResponse = await fetch(signed.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  })

  if (!putResponse.ok) {
    const detail = (await putResponse.text()).slice(0, 200)
    throw new Error(detail || `Storage upload failed (HTTP ${putResponse.status})`)
  }

  const extractResponse = await fetch('/api/tiptraq/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storagePath: signed.storagePath }),
  })

  const result = await readJson<TipTraqUploadResult & { error?: string }>(extractResponse)

  if (!extractResponse.ok) {
    await createClient().storage.from('tiptraq-reports').remove([signed.storagePath])
    throw new Error(result.error || 'Body clock processing failed')
  }

  if (!result.night || !result.rolling) {
    throw new Error('Upload completed but the response was incomplete.')
  }

  return result
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
      setState({ status: 'uploading', progress: 30 })

      try {
        setState({ status: 'processing', progress: 70 })
        const result = await runTipTraqUpload(file)
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
                  {3 - state.result.rolling.nights_count !== 1 ? 's' : ''} for clinical confidence
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
