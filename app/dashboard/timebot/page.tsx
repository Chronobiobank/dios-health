import { TimebotView } from '@/components/dashboard/timebot-view'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { getPatientFirstName } from '@/lib/auth/greeting'
import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { buildTimebotData } from '@/lib/dashboard/timebot-data'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardTimebotPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [{ data: dlmoProfile }, { count: nightsCount }] = await Promise.all([
    supabase.from('dlmo_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', user.id),
  ])

  const firstName = getPatientFirstName({
    firstName: patient.first_name,
    fullName: profile.full_name,
  })

  const timebot = buildTimebotData({
    profile: (dlmoProfile as DlmoProfileRow | null) ?? null,
    hasTipTraqData: (nightsCount ?? 0) > 0,
    firstName,
    locationCity: patient.location_city,
    locationCountry: patient.location_country,
    fallbackSleepTime: patient.chronotype_q3 ?? '11:00pm',
    currentSupplements: (patient.current_supplements as string[] | null) ?? [],
    currentMedications: (patient.current_medications as string[] | null) ?? [],
  })

  return <TimebotView data={timebot} />
}
