import { normalizeInviteCode } from '@/lib/care/invite-codes'

export const PENDING_ACTIVATION_KEY = 'deepdose_pending_activation'

export function normalizeActivationCode(code: string): string {
  return normalizeInviteCode(code)
}

export function persistPendingActivation(code: string): void {
  if (typeof window === 'undefined') return
  const normalized = normalizeActivationCode(code)
  if (normalized.length < 6) return
  sessionStorage.setItem(PENDING_ACTIVATION_KEY, normalized)
}

export function readPendingActivation(): string | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem(PENDING_ACTIVATION_KEY)
  if (!stored) return null
  const normalized = normalizeActivationCode(stored)
  return normalized.length >= 6 ? normalized : null
}

export function clearPendingActivation(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(PENDING_ACTIVATION_KEY)
}

export function buildAuthCallbackUrl(origin: string, next?: string | null, activation?: string | null): string {
  const params = new URLSearchParams()
  if (next) params.set('next', next)
  if (activation) params.set('activation', normalizeActivationCode(activation))
  const query = params.toString()
  return `${origin}/auth/callback${query ? `?${query}` : ''}`
}

export function buildConsentPathWithActivation(activation: string): string {
  return `/patient/onboarding/consent?activation=${encodeURIComponent(normalizeActivationCode(activation))}`
}

export function buildStatusPathAfterLink(clinicianName?: string): string {
  const params = new URLSearchParams({ linked: '1' })
  if (clinicianName) params.set('clinician', clinicianName)
  return `/patient/dashboard/status?${params.toString()}`
}
