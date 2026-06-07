import type { DiagnosticTier } from '@/lib/types/diagnostic-tiers'

/** Map signup country labels to ISO 3166-1 alpha-2 (TipTraQ gating uses GB). */
export function normalizeCountryCode(country: string | null | undefined): string {
  const trimmed = country?.trim() ?? ''
  if (!trimmed) return ''
  const upper = trimmed.toUpperCase()
  if (upper === 'GB' || upper === 'UK' || trimmed === 'United Kingdom') return 'GB'
  return upper.length === 2 ? upper : trimmed
}

export function isTipTraQAvailable(countryCode: string): boolean {
  return normalizeCountryCode(countryCode) === 'GB'
}

export function getMaxTier(countryCode: string): DiagnosticTier {
  return isTipTraQAvailable(countryCode) ? 'L1' : 'L2'
}
