/** Carry home-page drug selection through consent into meds onboarding. */

export function buildConsentOnboardingPath(options?: { med?: string; time?: string }): string {
  const params = new URLSearchParams()
  if (options?.med?.trim()) params.set('med', options.med.trim())
  if (options?.time?.trim()) params.set('time', options.time.trim().slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient/onboarding/consent?${qs}` : '/patient/onboarding/consent'
}

export function buildMedsOnboardingPath(options?: { med?: string; time?: string }): string {
  const params = new URLSearchParams()
  if (options?.med?.trim()) params.set('med', options.med.trim())
  if (options?.time?.trim()) params.set('time', options.time.trim().slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient/onboarding/medications?${qs}` : '/patient/onboarding/medications'
}

export function buildPatientLandingPath(options?: { med?: string; time?: string }): string {
  const params = new URLSearchParams()
  if (options?.med?.trim()) params.set('med', options.med.trim())
  if (options?.time?.trim()) params.set('time', options.time.trim().slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient-landing?${qs}` : '/patient-landing'
}

export function buildLoginPathForMeds(options?: { med?: string; time?: string }): string {
  const next = encodeURIComponent(buildConsentOnboardingPath(options))
  return `/login?next=${next}`
}

export function parseMedsOnboardingParams(searchParams: URLSearchParams | { get: (k: string) => string | null }) {
  const med = searchParams.get('med')?.trim() ?? null
  const time = searchParams.get('time')?.trim()?.slice(0, 5) ?? null
  return { med, time }
}
