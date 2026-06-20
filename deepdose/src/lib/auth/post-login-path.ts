export type UserTier = 'patient' | 'clinician' | 'enterprise'

export const DEFAULT_PATIENT_PATH = '/patient/onboarding/consent'

function isSafeInternalPath(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//'))
}

/** Where to send a user after auth, honouring an explicit `next` when present. */
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
      return DEFAULT_PATIENT_PATH
  }
}

export function loginEyebrow(next?: string | null): string {
  if (next?.startsWith('/clinical')) return 'Clinician access'
  if (next?.startsWith('/enterprise')) return 'Chronobiobank access'
  return 'Patient access'
}

/** Staff portals (clinical / enterprise) — no self-serve signup. */
export function isStaffLoginPath(next?: string | null): boolean {
  return Boolean(next?.startsWith('/clinical') || next?.startsWith('/enterprise'))
}

export function loginLede(next: string | null | undefined, mode: 'signin' | 'signup'): string {
  if (next?.startsWith('/clinical')) {
    return 'Sign in with the credentials issued by your practice.'
  }
  if (next?.startsWith('/enterprise')) {
    return 'Sign in with your organisation Chronobiobank credentials.'
  }
  return mode === 'signin' ? 'Sign in to your account' : 'Create your patient account'
}
