/** Carry home-page drug selection through consent into meds onboarding. */

export type MedsPathOptions = {
  med?: string
  time?: string
  medCodes?: string[]
  /** Parallel take times (HH:MM) — one per med code. */
  medTimes?: string[]
  wake?: string
}

function normalizeClock(value: string | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return trimmed.slice(0, 5)
}

/** Earliest clock time — used as wake proxy when only per-med times are set. */
export function earliestTakeTime(times: string[]): string | null {
  const clocks = times.map((t) => normalizeClock(t)).filter(Boolean) as string[]
  if (!clocks.length) return null
  return clocks.reduce((earliest, clock) => (clock < earliest ? clock : earliest))
}

function appendMedsPathParams(params: URLSearchParams, options?: MedsPathOptions): void {
  if (options?.medCodes?.length) {
    params.set('meds', options.medCodes.map((c) => c.trim()).filter(Boolean).join(','))
  } else if (options?.med?.trim()) {
    params.set('med', options.med.trim())
  }

  if (options?.medTimes?.length) {
    const clocks = options.medTimes.map((t) => normalizeClock(t)).filter(Boolean) as string[]
    if (clocks.length) params.set('times', clocks.join(','))
  }

  const wake =
    normalizeClock(options?.wake) ??
    normalizeClock(options?.time) ??
    earliestTakeTime(options?.medTimes ?? [])
  if (wake) params.set('wake', wake)

  const legacyMed = options?.med?.trim() ?? options?.medCodes?.[0]?.trim()
  const legacyTime = wake
  if (legacyMed && !params.has('med')) params.set('med', legacyMed)
  if (legacyTime && !params.has('time')) params.set('time', legacyTime)
}

export function buildConsentOnboardingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  appendMedsPathParams(params, options)
  const qs = params.toString()
  return qs ? `/patient/onboarding/consent?${qs}` : '/patient/onboarding/consent'
}

export function buildMedsOnboardingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  appendMedsPathParams(params, options)
  const qs = params.toString()
  return qs ? `/patient/onboarding/medications?${qs}` : '/patient/onboarding/medications'
}

export function buildChronotypeOnboardingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  appendMedsPathParams(params, options)
  const qs = params.toString()
  return qs ? `/patient/onboarding/chronotype?${qs}` : '/patient/onboarding/chronotype'
}

export function buildPatientLandingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  if (options?.medCodes?.length) {
    params.set('meds', options.medCodes.map((c) => c.trim()).filter(Boolean).join(','))
  } else if (options?.med?.trim()) {
    params.set('med', options.med.trim())
  }
  if (options?.medTimes?.length) {
    const clocks = options.medTimes.map((t) => normalizeClock(t)).filter(Boolean) as string[]
    if (clocks.length) params.set('times', clocks.join(','))
  }
  const wake =
    normalizeClock(options?.wake) ??
    normalizeClock(options?.time) ??
    earliestTakeTime(options?.medTimes ?? [])
  if (wake) params.set('wake', wake)
  const qs = params.toString()
  return qs ? `/patient-landing?${qs}` : '/patient-landing'
}

export function buildPersonalTimingPath(options?: MedsPathOptions): string {
  const params = new URLSearchParams()
  appendMedsPathParams(params, options)
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

/** Same shape as patient landing — meds/times/wake flow through consent → meds → chronotype. */
export function parseMedsOnboardingParams(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
) {
  return parsePatientLandingParams(searchParams)
}

export function medsPathOptionsFromParsed(
  parsed: ReturnType<typeof parseMedsOnboardingParams>
): MedsPathOptions {
  return {
    medCodes: parsed.medCodes.length ? parsed.medCodes : undefined,
    medTimes: parsed.medTimes.length ? parsed.medTimes : undefined,
    med: parsed.med ?? undefined,
    wake: parsed.wake ?? undefined,
    time: parsed.time ?? undefined,
  }
}

export function parsePatientLandingParams(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
) {
  const medsParam = searchParams.get('meds')?.trim() ?? null
  const medCodes = medsParam
    ? medsParam.split(',').map((c) => c.trim()).filter(Boolean)
    : []
  const timesParam = searchParams.get('times')?.trim() ?? null
  const medTimes = timesParam
    ? timesParam.split(',').map((t) => t.trim().slice(0, 5)).filter(Boolean)
    : []
  const wake =
    searchParams.get('wake')?.trim()?.slice(0, 5) ??
    searchParams.get('time')?.trim()?.slice(0, 5) ??
    earliestTakeTime(medTimes)
  const med = searchParams.get('med')?.trim() ?? medCodes[0] ?? null
  const time = wake ?? searchParams.get('time')?.trim()?.slice(0, 5) ?? null

  return { medCodes, medTimes, med, time, wake }
}
