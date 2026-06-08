import type { Metadata } from 'next'

import { TimebotView } from '@/components/dashboard/timebot-view'

import '@/app/styles/dina-page.css'
import { getCoachIntroMessage, getPatientFirstName } from '@/lib/auth/greeting'
import { COACH_ASK_LABEL, COACH_DISPLAY_NAME } from '@/lib/coach/brand'
import { requirePatientSession } from '@/lib/auth/require-patient'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { buildTimebotData } from '@/lib/dashboard/timebot-data'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${COACH_DISPLAY_NAME} — DIOS`,
  description: `${COACH_ASK_LABEL} about your body clock, results, and medication timing.`,
}

export default async function DashboardCoachPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [{ data: mluxProfile }, { count: nightsCount }] = await Promise.all([
    supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', user.id),
  ])

  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })

  const introMessage = getCoachIntroMessage(
    firstName,
    patient.location_city,
    patient.location_country
  )

  const profileRow = mluxProfile as MLuxProfileRow | null
  const mluxScore = Math.round((profileRow?.confidence_score ?? 20) * 3.5)

  const session = buildTimebotData({
    profile: profileRow,
    hasTipTraqData: (nightsCount ?? 0) > 0,
    firstName,
    locationCity: patient.location_city,
    locationCountry: patient.location_country,
    fallbackSleepTime: patient.chronotype_q3 ?? '11:00pm',
    currentSupplements: (patient.current_supplements as string[] | null) ?? [],
    currentMedications: (patient.current_medications as string[] | null) ?? [],
  })

  return <TimebotView data={session} mluxScore={mluxScore} introMessage={introMessage} />
}
