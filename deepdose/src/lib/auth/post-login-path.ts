import type { SupabaseClient } from '@supabase/supabase-js'

export type UserTier = 'patient' | 'clinician' | 'enterprise'

/** Consumer home after auth — chronotype Grid. */
export const DEFAULT_PATIENT_HOME = '/grid'

/** @deprecated Clinical activation still uses consent; consumers land on DEFAULT_PATIENT_HOME. */
export const DEFAULT_PATIENT_PATH = '/patient/onboarding/consent'

function isSafeInternalPath(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//'))
}

/**
 * Consumer auth lives on the home gate (`/`), not `/login`.
 * Staff portals keep `/login?next=/clinical|enterprise…`.
 */
export function consumerAuthPath(next?: string | null): string {
  if (isSafeInternalPath(next) && next !== '/') {
    return `/?next=${encodeURIComponent(next)}`
  }
  return '/'
}

/** Patient sign-up from home search or dose-dash onboarding. */
export function isPatientDoseDashPath(next?: string | null): boolean {
  if (!next) return true
  return (
    next.startsWith('/patient/onboarding') ||
    next.startsWith('/patient/dashboard') ||
    next.startsWith('/dosage') ||
    next.startsWith('/profile') ||
    next.startsWith('/account') ||
    next.startsWith('/connect') ||
    next.startsWith('/chat') ||
    next.startsWith('/real') ||
    next.startsWith('/grid') ||
    next.startsWith('/dose') ||
    next.startsWith('/bank')
  )
}

/** Sync redirect helper — honour `next`, else tier default (patients → /real). */
export function resolvePostLoginPath(
  tier: UserTier | string | null | undefined,
  next?: string | null
): string {
  if (isSafeInternalPath(next)) {
    return next
  }

  switch (tier) {
    case 'clinician':
      return '/clinical/dashboard'
    case 'enterprise':
      return '/enterprise/dashboard'
    default:
      return DEFAULT_PATIENT_HOME
  }
}

/**
 * Patient post-auth destination: honour `next`, else `/real`.
 * Clinical onboarding is only via explicit `next` (activation / patient dash).
 */
export async function resolvePatientPostLoginPath(
  _supabase: SupabaseClient,
  _userId: string,
  next?: string | null
): Promise<string> {
  if (isSafeInternalPath(next)) {
    return next
  }
  return DEFAULT_PATIENT_HOME
}

/** Short context line · omit when the title is enough (patient sign-in). */
export function loginEyebrow(next?: string | null, activation?: string | null): string | null {
  if (activation?.trim() || next?.startsWith('/patient/dashboard/status')) return 'Clinical activation'
  if (next?.startsWith('/clinical')) return 'Clinical'
  if (next?.startsWith('/enterprise')) return 'Enterprise'
  return null
}

export function loginTitle(next: string | null | undefined, mode: 'signin' | 'signup'): string {
  if (next?.startsWith('/clinical')) return 'Sign in'
  if (next?.startsWith('/enterprise')) return 'Sign in'
  return mode === 'signup' ? 'Create account' : 'Sign in'
}

/** Staff portals (clinical / enterprise), no self-serve signup. */
export function isStaffLoginPath(next?: string | null): boolean {
  return Boolean(next?.startsWith('/clinical') || next?.startsWith('/enterprise'))
}

/** One supporting line · only when it adds information sign-in titles do not cover. */
export function loginLede(
  next: string | null | undefined,
  mode: 'signin' | 'signup',
  activation?: string | null
): string | null {
  if (activation?.trim()) {
    return mode === 'signup'
      ? 'Create your account, accept consent, then we link your clinician, no jargon, just the next step.'
      : 'Sign in to link your clinician and open your status dashboard.'
  }
  if (next?.startsWith('/patient/dashboard/status')) {
    return 'Sign in to continue setup with your clinician.'
  }
  if (next?.startsWith('/clinical')) {
    return 'Use credentials from your practice administrator.'
  }
  if (next?.startsWith('/enterprise')) {
    return 'Use your organisation credentials.'
  }
  if (mode === 'signup') {
    return 'Consent first, then add your medications.'
  }
  return null
}
