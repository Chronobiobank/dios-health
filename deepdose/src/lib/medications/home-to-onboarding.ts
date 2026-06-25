/** Carry home-page drug selection through consent into meds onboarding. */

export type MedsPathOptions = {
  med?: string
  time?: string
  medCodes?: string[]
  wake?: string
}

export function buildConsentOnboardingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  const med = options?.med?.trim() ?? options?.medCodes?.[0]?.trim()
  const time = options?.time?.trim() ?? options?.wake?.trim()
  if (med) params.set('med', med)
  if (time) params.set('time', time.slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient/onboarding/consent?${qs}` : '/patient/onboarding/consent'
}

export function buildMedsOnboardingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  const med = options?.med?.trim() ?? options?.medCodes?.[0]?.trim()
  const time = options?.time?.trim() ?? options?.wake?.trim()
  if (med) params.set('med', med)
  if (time) params.set('time', time.slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient/onboarding/medications?${qs}` : '/patient/onboarding/medications'
}

export function buildPatientLandingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  if (options?.medCodes?.length) {
    params.set('meds', options.medCodes.map((c) => c.trim()).filter(Boolean).join(','))
  } else if (options?.med?.trim()) {
    params.set('med', options.med.trim())
  }
  const wake = options?.wake?.trim() ?? options?.time?.trim()
  if (wake) params.set('wake', wake.slice(0, 5))
  const qs = params.toString()
  return qs ? `/patient-landing?${qs}` : '/patient-landing'
}

/** Chrono test (MCTQ) — bridge from poly calculator to personal timing. */
export function buildPersonalTimingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  if (options?.medCodes?.length) {
    params.set('meds', options.medCodes.map((c) => c.trim()).filter(Boolean).join(','))
  } else if (options?.med?.trim()) {
    params.set('med', options.med.trim())
  }
  const wake = options?.wake?.trim() ?? options?.time?.trim()
  if (wake) params.set('wake', wake.slice(0, 5))
  const qs = params.toString()
  const destination = qs
    ? `/patient/onboarding/chronotype?${qs}`
    : '/patient/onboarding/chronotype'
  return `/login?next=${encodeURIComponent(destination)}`
}

export function buildLoginPathForMeds(options?: MedsPathOptions): string {
  const next = encodeURIComponent(buildConsentOnboardingPath(options))
  return `/login?next=${next}`
}

export function parseMedsOnboardingParams(searchParams: URLSearchParams | { get: (k: string) => string | null }) {
  const med = searchParams.get('med')?.trim() ?? null
  const time = searchParams.get('time')?.trim()?.slice(0, 5) ?? null
  return { med, time }
}

export function parsePatientLandingParams(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
) {
  const medsParam = searchParams.get('meds')?.trim() ?? null
  const medCodes = medsParam
    ? medsParam.split(',').map((c) => c.trim()).filter(Boolean)
    : []
  const wake =
    searchParams.get('wake')?.trim()?.slice(0, 5) ??
    searchParams.get('time')?.trim()?.slice(0, 5) ??
    null
  const med = searchParams.get('med')?.trim() ?? medCodes[0] ?? null
  const time = wake ?? searchParams.get('time')?.trim()?.slice(0, 5) ?? null

  return { medCodes, med, time, wake }
}
