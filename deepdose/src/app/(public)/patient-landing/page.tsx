import type { Metadata } from 'next'

import { DeepDoseLanding } from '@/components/deepdose/DeepDoseLanding'
import { DEEPDOSE_LANDING_META } from '@/lib/deepdose-marketing/landing-content'
import { getCatalogEntry } from '@/lib/medications/catalog'
import {
  buildLoginPathForMeds,
  parseMedsOnboardingParams,
} from '@/lib/medications/home-to-onboarding'

export const metadata: Metadata = {
  title: DEEPDOSE_LANDING_META.title,
  description: DEEPDOSE_LANDING_META.description,
}

type PageProps = {
  searchParams: Promise<{ med?: string; time?: string }>
}

export default async function PatientLandingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { med, time } = parseMedsOnboardingParams(
    new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) =>
        value ? [[key, value]] : []
      )
    )
  )

  const signupHref = buildLoginPathForMeds({
    med: med ?? undefined,
    time: time ?? undefined,
  })

  const entry = med ? getCatalogEntry(med) : undefined
  const medContext = entry ? { name: entry.displayName, time } : undefined

  return <DeepDoseLanding signupHref={signupHref} medContext={medContext} />
}
