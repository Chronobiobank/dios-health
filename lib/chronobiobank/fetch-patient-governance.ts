import { governanceContributionsFromSources } from '@/lib/chronobiobank/build-governance-input'
import { consentStateFromRow } from '@/lib/chronobiobank/consent-toggles'
import { calculateGovernanceWeight } from '@/lib/chronobiobank/governance-weight'
import type { ChronobiobankConsentState, GovernanceContributions } from '@/lib/chronobiobank/types'
import { createClient } from '@/lib/supabase/server'

export type PatientChronobiobankContext = {
  consent: ChronobiobankConsentState
  contributions: GovernanceContributions
  governanceWeight: number
}

export async function fetchPatientChronobiobankContext(
  patientId: string
): Promise<PatientChronobiobankContext> {
  const supabase = await createClient()

  const [
    { data: consentRow },
    { count: bloodCount },
    { count: tiptraqCount },
    { data: observations },
  ] = await Promise.all([
    supabase
      .from('chronobiobank_consent')
      .select(
        'consent_academic_research, consent_pharma_discovery, consent_ai_training, consent_open_source_challenges, consent_version, updated_at'
      )
      .eq('patient_id', patientId)
      .maybeSingle(),
    supabase
      .from('blood_circadian_panels')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId),
    supabase
      .from('tiptraq_nights')
      .select('id', { count: 'exact', head: true })
      .eq('patient_id', patientId),
    supabase
      .from('smartphone_circadian_observations')
      .select('observed_at')
      .eq('patient_id', patientId)
      .order('observed_at', { ascending: false })
      .limit(120),
  ])

  const uniqueDays = new Set(
    (observations ?? []).map((row) => {
      const d = new Date(row.observed_at as string)
      return d.toISOString().slice(0, 10)
    })
  )

  const contributions = governanceContributionsFromSources({
    smartphoneObservationDays: uniqueDays.size,
    bloodPanelsCount: bloodCount ?? 0,
    tiptraqNightsCount: tiptraqCount ?? 0,
  })

  const weight = calculateGovernanceWeight(contributions)

  return {
    consent: consentStateFromRow(consentRow),
    contributions,
    governanceWeight: weight.totalWeight,
  }
}
