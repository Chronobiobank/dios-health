import { getCatalogEntry } from '@/lib/medications/catalog'
import {
  buildLoginPathForMeds,
  parsePatientLandingParams,
} from '@/lib/medications/home-to-onboarding'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type RawSearchParams = {
  med?: string
  meds?: string
  times?: string
  time?: string
  wake?: string
}

export function resolvePlanFromSearchParams(params: RawSearchParams): {
  urlPlanContext?: PlanContextFromDraft
  signupHref: string
} {
  const { medCodes, medTimes, med, time, wake } = parsePatientLandingParams(
    new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) => (value ? [[key, value]] : []))
    )
  )

  const signupHref = buildLoginPathForMeds({
    med: med ?? undefined,
    time: time ?? undefined,
    medCodes: medCodes.length ? medCodes : undefined,
    medTimes: medTimes.length ? medTimes : undefined,
    wake: wake ?? undefined,
  })

  const codes = medCodes.length > 0 ? medCodes : med ? [med] : []

  const urlPlanContext =
    codes.length > 0
      ? {
          medCodes: codes,
          medNames: codes.map(
            (code) =>
              getCatalogEntry(code)?.displayName ?? code.charAt(0).toUpperCase() + code.slice(1)
          ),
          medTimes: medTimes.length ? medTimes : undefined,
          wake: wake ?? time,
          verdict: verdictForMedCodes(codes),
        }
      : undefined

  return { urlPlanContext, signupHref }
}
