import type { SupabaseClient } from '@supabase/supabase-js'
import {
  RESEARCH_CONSENT_PURPOSES,
  ageBandFromDob,
} from '@/lib/chronobiobank/pseudonymise'

export type IngestResult = {
  ingested: number
  skipped: number
  consentPurposes: string[]
  reason?: string
}

/**
 * Pseudonymise a patient's accepted prescribing data into chronobiobank_records,
 * gated by their research consent. Idempotent via chronobiobank_ingest_log.
 *
 * MUST run with the service-role admin client: chronobiobank_records has no
 * INSERT policy for end users by design (write-only via the trusted pipeline).
 */
export async function ingestPatientToChronobiobank(
  admin: SupabaseClient,
  patientId: string
): Promise<IngestResult> {
  // 1. Which research purposes has the patient granted (and not withdrawn)?
  const { data: consents } = await admin
    .from('patient_consents')
    .select('purpose_code, granted, withdrawn_at')
    .eq('patient_id', patientId)
    .in('purpose_code', RESEARCH_CONSENT_PURPOSES as unknown as string[])

  const activePurposes = (consents ?? [])
    .filter((c) => c.granted && !c.withdrawn_at)
    .map((c) => c.purpose_code)

  if (activePurposes.length === 0) {
    return { ingested: 0, skipped: 0, consentPurposes: [], reason: 'No research consent granted.' }
  }

  // 2. Stable per-patient cohort token (kept only in the patient-owned link log).
  let cohortToken: string | null = null
  const { data: existingToken } = await admin
    .from('chronobiobank_ingest_log')
    .select('cohort_token')
    .eq('patient_id', patientId)
    .limit(1)
    .maybeSingle()
  cohortToken = existingToken?.cohort_token ?? crypto.randomUUID()

  // 3. Coarse demographic + circadian context (generalised, non-identifying).
  const [{ data: profile }, { data: chronotype }] = await Promise.all([
    admin
      .from('patient_profiles')
      .select('date_of_birth, biological_sex, fitzpatrick_type')
      .eq('id', patientId)
      .maybeSingle(),
    admin
      .from('chronotype_profiles')
      .select('chronotype_cat, sjl_hours')
      .eq('patient_id', patientId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const { data: scoreRow } = await admin
    .from('circadian_scores')
    .select('score')
    .eq('patient_id', patientId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const ageBand = ageBandFromDob(profile?.date_of_birth ?? null)
  const circadianScore = scoreRow?.score != null ? Number(scoreRow.score) : null

  // 4. Accepted/modified prescribing recommendations not yet contributed.
  const { data: recommendations } = await admin
    .from('prescribing_recommendations')
    .select('id, medication_code, current_timing, recommended_timing, status, actioned_at')
    .eq('patient_id', patientId)
    .in('status', ['accepted', 'modified'])

  if (!recommendations || recommendations.length === 0) {
    return {
      ingested: 0,
      skipped: 0,
      consentPurposes: activePurposes,
      reason: 'No accepted prescribing recommendations to contribute.',
    }
  }

  const { data: alreadyLogged } = await admin
    .from('chronobiobank_ingest_log')
    .select('recommendation_id')
    .eq('patient_id', patientId)

  const loggedIds = new Set((alreadyLogged ?? []).map((r) => r.recommendation_id))

  let ingested = 0
  let skipped = 0

  for (const rec of recommendations) {
    if (loggedIds.has(rec.id)) {
      skipped += 1
      continue
    }

    // Pull any outcome recorded against this recommendation.
    const { data: outcome } = await admin
      .from('prescribing_outcomes')
      .select('outcome_type, value, unit, measured_at')
      .eq('recommendation_id', rec.id)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const daysToOutcome =
      outcome?.measured_at && rec.actioned_at
        ? Math.max(
            0,
            Math.round(
              (new Date(outcome.measured_at).getTime() -
                new Date(rec.actioned_at).getTime()) /
                86_400_000
            )
          )
        : null

    const { data: inserted, error: insertError } = await admin
      .from('chronobiobank_records')
      .insert({
        cohort_token: cohortToken,
        age_band: ageBand,
        biological_sex: profile?.biological_sex ?? null,
        fitzpatrick_type: profile?.fitzpatrick_type ?? null,
        chronotype_cat: chronotype?.chronotype_cat ?? null,
        sjl_hours: chronotype?.sjl_hours ?? null,
        circadian_score: circadianScore,
        medication_code: rec.medication_code,
        prior_timing: rec.current_timing,
        recommended_timing: rec.recommended_timing,
        outcome_type: outcome?.outcome_type ?? null,
        outcome_value: outcome?.value ?? null,
        outcome_unit: outcome?.unit ?? null,
        days_to_outcome: daysToOutcome,
        consent_purposes: activePurposes,
        record_date: new Date().toISOString().slice(0, 10),
      })
      .select('id')
      .single()

    if (insertError) continue

    await admin.from('chronobiobank_ingest_log').insert({
      patient_id: patientId,
      cohort_token: cohortToken,
      recommendation_id: rec.id,
      record_id: inserted?.id ?? null,
    })

    ingested += 1
  }

  return { ingested, skipped, consentPurposes: activePurposes }
}
