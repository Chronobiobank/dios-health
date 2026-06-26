import type { Metadata } from 'next'

import { PatientLandingWithDraft } from '@/components/deepdose/PatientLandingWithDraft'
import { DEEPDOSE_LANDING_META } from '@/lib/deepdose-marketing/landing-content'
import { getCatalogEntry } from '@/lib/medications/catalog'
import {
  buildLoginPathForMeds,
  parsePatientLandingParams,
} from '@/lib/medications/home-to-onboarding'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'

export const metadata: Metadata = {
  title: DEEPDOSE_LANDING_META.title,
  description: DEEPDOSE_LANDING_META.description,
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function PatientLandingPage({ searchParams }: PageProps) {
  const params = await searchParams
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

  return (
    <PatientLandingWithDraft urlPlanContext={urlPlanContext} signupHrefFromUrl={signupHref} />
  )
}
