import type { TipTraQNight } from '@/lib/dlmo'

const TIME_PATTERN = /^\d{2}:\d{2}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const NUMERIC_FIELDS = [
  'trt_minutes',
  'signal_quality_pct',
  'sleep_latency_minutes',
  'tst_minutes',
  'waso_minutes',
  'sleep_efficiency_pct',
  'rem_duration_minutes',
  'rem_pct_tst',
  'nrem_duration_minutes',
  'ahi',
  'rdi',
  'odi_3pct',
  'odi_4pct',
  't90_pct',
  'min_spo2',
  'mean_spo2',
  'hypoxic_burden',
  'event_count',
  'mean_pr',
  'min_pr',
  'max_pr',
  'sns_pct',
  'pns_pct',
  'snoring_minutes',
] as const

const TIME_FIELDS = [
  'recording_start',
  'recording_end',
  'sleep_onset',
  'sleep_offset',
  'first_rem_onset',
] as const

export function isPdfFile(file: File): boolean {
  if (file.type === 'application/pdf') return true
  return file.name.toLowerCase().endsWith('.pdf')
}

export function parseExtractedJson(rawText: string): Record<string, unknown> {
  let text = rawText.trim()
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    text = fenced[1].trim()
  }
  return normalizeExtractedFields(JSON.parse(text) as Record<string, unknown>)
}

function coerceNumber(value: unknown): unknown {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replace(/,/g, ''))
    if (!Number.isNaN(parsed)) return parsed
  }
  return value
}

function normalizeTime(value: unknown): unknown {
  if (value === null || value === undefined || value === '') return value
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (!match) return value

  return `${match[1].padStart(2, '0')}:${match[2]}`
}

export function normalizeExtractedFields(extracted: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...extracted }

  for (const field of NUMERIC_FIELDS) {
    if (field in normalized) {
      normalized[field] = coerceNumber(normalized[field])
    }
  }

  for (const field of TIME_FIELDS) {
    if (field in normalized) {
      normalized[field] = normalizeTime(normalized[field])
    }
  }

  return normalized
}

function requiredTime(value: unknown, field: string): string {
  if (typeof value !== 'string' || !TIME_PATTERN.test(value)) {
    throw new Error(`Report is missing a valid ${field} time.`)
  }
  return value
}

function requiredNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`Report is missing a valid ${field} value.`)
  }
  return value
}

function optionalTime(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' || !TIME_PATTERN.test(value)) {
    throw new Error('Report has an invalid first REM onset time.')
  }
  return value
}

export function validateReportDate(value: unknown): string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    throw new Error('Report is missing a valid report date.')
  }
  return value
}

export function toNightInput(extracted: Record<string, unknown>): TipTraQNight {
  return {
    sleep_onset: requiredTime(extracted.sleep_onset, 'sleep onset'),
    sleep_offset: requiredTime(extracted.sleep_offset, 'sleep offset'),
    sleep_latency_minutes: requiredNumber(extracted.sleep_latency_minutes, 'sleep latency'),
    tst_minutes: requiredNumber(extracted.tst_minutes, 'total sleep time'),
    waso_minutes: requiredNumber(extracted.waso_minutes, 'WASO'),
    sleep_efficiency_pct: requiredNumber(extracted.sleep_efficiency_pct, 'sleep efficiency'),
    rem_duration_minutes: requiredNumber(extracted.rem_duration_minutes, 'REM duration'),
    rem_pct_tst: requiredNumber(extracted.rem_pct_tst, 'REM percentage'),
    first_rem_onset: optionalTime(extracted.first_rem_onset),
    ahi: requiredNumber(extracted.ahi, 'AHI'),
    sns_pct: requiredNumber(extracted.sns_pct, 'SNS'),
    pns_pct: requiredNumber(extracted.pns_pct, 'PNS'),
    mean_pr: requiredNumber(extracted.mean_pr, 'mean pulse rate'),
    min_pr: requiredNumber(extracted.min_pr, 'minimum pulse rate'),
    min_spo2: requiredNumber(extracted.min_spo2, 'minimum SpO2'),
    hypoxic_burden: requiredNumber(extracted.hypoxic_burden, 'hypoxic burden'),
    signal_quality_pct: requiredNumber(extracted.signal_quality_pct, 'signal quality'),
  }
}

export function mapStorageUploadError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('bucket') || lower.includes('not found') || lower.includes('does not exist')) {
    return 'TipTraQ storage is not set up yet. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'TipTraQ storage permissions are missing. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  return 'Failed to store PDF. Please try again.'
}

export function mapInsertError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('does not exist') || lower.includes('schema cache') || lower.includes('relation')) {
    return 'TipTraQ database tables are not set up yet. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  if (lower.includes('foreign key') || lower.includes('profiles')) {
    return 'Your profile record is missing. Sign out, sign in again, then retry the upload.'
  }

  if (lower.includes('duplicate') || lower.includes('unique')) {
    return 'This report date has already been uploaded.'
  }

  if (lower.includes('invalid input syntax') && lower.includes('time')) {
    return 'Could not read sleep times from this report. Check the PDF and try again.'
  }

  return 'Failed to save night data. Please try again.'
}

export function mapFetchError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('does not exist') || lower.includes('schema cache') || lower.includes('relation')) {
    return 'TipTraQ database tables are not set up yet. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'TipTraQ read permissions are missing. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  return 'Failed to load night history after upload.'
}

export function mapProfileUpsertError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('does not exist') || lower.includes('schema cache') || lower.includes('relation')) {
    return 'DLMO profile table is not set up yet. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'DLMO profile permissions are missing. Run supabase/run-tiptraq-setup.sql in Supabase SQL Editor.'
  }

  return 'Failed to update your body clock profile.'
}
