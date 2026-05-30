import type { TipTraQNight } from '@/lib/dlmo'

const TIME_PATTERN = /^\d{2}:\d{2}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

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
  return JSON.parse(text) as Record<string, unknown>
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
  if (lower.includes('bucket') && lower.includes('not found')) {
    return 'TipTraQ storage is not configured yet. Please contact support.'
  }
  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Could not save your report. Please sign out and sign in again.'
  }
  return 'Failed to store PDF'
}

export function mapInsertError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('does not exist') || lower.includes('schema cache')) {
    return 'TipTraQ database tables are not set up yet. Please contact support.'
  }
  if (lower.includes('duplicate') || lower.includes('unique')) {
    return 'This report date has already been uploaded.'
  }
  return 'Failed to save night data'
}
