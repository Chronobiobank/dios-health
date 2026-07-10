import type { LinkPatientResult } from '@/lib/care/link-patient'
import { normalizeActivationCode } from '@/lib/care/pending-activation'
import { resolvePostLoginPath } from '@/lib/auth/post-login-path'

export const DEFAULT_ACTIVATION_NEXT = '/patient/dashboard/status'

/** Pure redirect helper — safe for client components (no admin / service role). */
export function resolvePathAfterActivationAttempt(
  tier: string | null | undefined,
  next: string | null | undefined,
  activation: string | null | undefined,
  linkResult: LinkPatientResult | null
): string {
  const fallbackNext = next ?? DEFAULT_ACTIVATION_NEXT
  const normalized = activation ? normalizeActivationCode(activation) : ''

  if (linkResult?.ok) {
    const params = new URLSearchParams({ linked: '1' })
    params.set('clinician', linkResult.clinicianName)
    return `${fallbackNext}?${params.toString()}`
  }

  if (linkResult && !linkResult.ok && linkResult.code === 'already_linked') {
    return fallbackNext
  }

  if (linkResult && !linkResult.ok && linkResult.code === 'consent_required' && normalized) {
    return `/patient/onboarding/consent?activation=${encodeURIComponent(normalized)}&next=${encodeURIComponent(fallbackNext)}`
  }

  if (linkResult && !linkResult.ok && normalized) {
    const params = new URLSearchParams({
      next: fallbackNext,
      activation: normalized,
      error: 'activation_failed',
      reason: linkResult.error,
    })
    return `/?${params.toString()}`
  }

  return resolvePostLoginPath(tier, next)
}
