import { createClient } from '@/lib/supabase/client'
import { getTipTraqUploadMaxBytes, isEdfFile } from '@/lib/tiptraq/edf-parser'

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

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function normalizeUploadError(error: unknown, step: string): Error {
  const message = errorMessage(error)

  if (/not valid JSON|Unexpected token|Request Entity Too Large|Payload Too Large|413/i.test(message)) {
    return new Error(
      `${step}: the file could not be uploaded (it may be too large, or the connection was interrupted). EDF files must be under 50MB.`
    )
  }

  return error instanceof Error ? error : new Error(`${step}: ${message}`)
}

async function parseExtractResponse(response: Response): Promise<TipTraQUploadResult> {
  const raw = await response.text()

  let payload: { error?: string } & Partial<TipTraQUploadResult> = {}
  if (raw) {
    try {
      payload = JSON.parse(raw) as typeof payload
    } catch {
      if (response.status === 413 || /request entity too large|payload too large/i.test(raw)) {
        throw new Error('Processing failed — file is too large. Use an EDF under 50MB.')
      }
      throw new Error(raw.slice(0, 160) || 'Processing failed')
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || `Processing failed (HTTP ${response.status})`)
  }

  if (!payload.night || !payload.rolling) {
    throw new Error('Upload completed but the response was incomplete. Please try again.')
  }

  return payload as TipTraQUploadResult
}

async function parseJsonResponse<T extends { error?: string }>(response: Response): Promise<T> {
  const raw = await response.text()

  if (!raw) {
    throw new Error(`Request failed (HTTP ${response.status})`)
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    if (/request entity too large|payload too large|413/i.test(raw)) {
      throw new Error('File is too large. EDF uploads must be under 50MB.')
    }
    throw new Error(raw.slice(0, 160) || `Request failed (HTTP ${response.status})`)
  }
}

async function requestSignedUploadUrl(): Promise<{ storagePath: string; signedUrl: string }> {
  const response = await fetch('/api/tiptraq/signed-upload', { method: 'POST' })
  const payload = await parseJsonResponse<{ error?: string; storagePath?: string; signedUrl?: string }>(
    response
  )

  if (!response.ok || !payload.storagePath || !payload.signedUrl) {
    throw new Error(payload.error || 'Could not prepare upload')
  }

  return {
    storagePath: payload.storagePath,
    signedUrl: payload.signedUrl,
  }
}

async function putFileToSignedUrl(signedUrl: string, file: File): Promise<void> {
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    const detail = (await uploadResponse.text()).slice(0, 160)
    if (uploadResponse.status === 413 || /entity too large|payload too large/i.test(detail)) {
      throw new Error('EDF file must be under 50MB')
    }
    throw new Error(
      detail || `Storage upload failed (HTTP ${uploadResponse.status}). Check Supabase storage is set up.`
    )
  }
}

export async function uploadTipTraqEdf(file: File): Promise<TipTraQUploadResult> {
  if (!isEdfFile(file)) {
    throw new Error('Please upload a TipTraQ channel export (.edf file).')
  }

  const maxBytes = getTipTraqUploadMaxBytes()
  if (file.size > maxBytes) {
    throw new Error(`EDF file must be under 50MB (yours is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`)
  }

  const supabase = createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Please sign in to upload TipTraQ data')
  }

  let uploadedPath = ''

  try {
    const signed = await requestSignedUploadUrl()
    uploadedPath = signed.storagePath
    await putFileToSignedUrl(signed.signedUrl, file)
  } catch (error) {
    throw normalizeUploadError(error, 'Storage upload')
  }

  try {
    const response = await fetch('/api/tiptraq/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storagePath: uploadedPath }),
    })

    return await parseExtractResponse(response)
  } catch (error) {
    if (uploadedPath) {
      await supabase.storage.from('tiptraq-reports').remove([uploadedPath])
    }
    throw normalizeUploadError(error, 'Body clock processing')
  }
}
