import type { Metadata } from 'next'

import { PatientLandingWithDraft } from '@/components/deepdose/PatientLandingWithDraft'
import { ProfileAccountStrip } from '@/components/deepdose/ProfileAccountStrip'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · Profile`,
  description:
    'Sleep matters. Your Sleep Regularity Index shows disease risk across a continuum. Raise it with six personalised daily doses.',
  alternates: { canonical: '/profile' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const { urlPlanContext, signupHref } = resolvePlanFromSearchParams(params)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PatientLandingWithDraft urlPlanContext={urlPlanContext} signupHrefFromUrl={signupHref} />
      {user ? (
        <div className="seco-landing seco-landing--maven seco-landing--sleep-wake-dash">
          <div className="seco-landing__section-inner">
            <div className="dios-glass-outer sw-dash__tile sw-dash__tile--summary">
              <ProfileAccountStrip />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
