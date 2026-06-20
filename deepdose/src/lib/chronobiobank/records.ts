import type { SupabaseClient } from '@supabase/supabase-js'
import { timingShiftMinutes } from '@/lib/chronobiobank/pseudonymise'

export type CohortFilter = {
  ageBands?: string[]
  biologicalSex?: string[]
  chronotypeCats?: string[]
  medicationCodes?: string[]
}

export type ChronobiobankRecord = {
  cohort_token: string
  age_band: string | null
  biological_sex: string | null
  fitzpatrick_type: number | null
  chronotype_cat: string | null
  sjl_hours: number | null
  circadian_score: number | null
  medication_code: string | null
  prior_timing: string | null
  recommended_timing: string | null
  outcome_type: string | null
  outcome_value: number | null
  outcome_unit: string | null
  days_to_outcome: number | null
  consent_purposes: string[] | null
  record_date: string | null
}

export type Distribution = { label: string; count: number }

export type ChronobiobankAggregates = {
  totalRecords: number
  uniqueCohorts: number
  chronotypeDistribution: Distribution[]
  medicationDistribution: Distribution[]
  ageBandDistribution: Distribution[]
  sexDistribution: Distribution[]
  meanCircadianScore: number | null
  meanSjlHours: number | null
  meanTimingShiftMinutes: number | null
  outcomesRecorded: number
}

const RECORD_COLUMNS =
  'cohort_token, age_band, biological_sex, fitzpatrick_type, chronotype_cat, sjl_hours, circadian_score, medication_code, prior_timing, recommended_timing, outcome_type, outcome_value, outcome_unit, days_to_outcome, consent_purposes, record_date'

/**
 * Fetch pseudonymised records. RLS restricts this to users whose organisation
 * holds an active data license, so the isolation policy is enforced at the DB.
 */
export async function fetchChronobiobankRecords(
  supabase: SupabaseClient,
  filter: CohortFilter = {},
  limit = 5000
): Promise<ChronobiobankRecord[]> {
  let query = supabase.from('chronobiobank_records').select(RECORD_COLUMNS).limit(limit)

  if (filter.ageBands?.length) query = query.in('age_band', filter.ageBands)
  if (filter.biologicalSex?.length) query = query.in('biological_sex', filter.biologicalSex)
  if (filter.chronotypeCats?.length) query = query.in('chronotype_cat', filter.chronotypeCats)
  if (filter.medicationCodes?.length) query = query.in('medication_code', filter.medicationCodes)

  const { data } = await query
  return (data ?? []) as ChronobiobankRecord[]
}

function distribution(
  records: ChronobiobankRecord[],
  key: keyof ChronobiobankRecord
): Distribution[] {
  const counts = new Map<string, number>()
  for (const record of records) {
    const value = record[key]
    if (value == null) continue
    const label = String(value)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

export function computeAggregates(records: ChronobiobankRecord[]): ChronobiobankAggregates {
  const scores = records.map((r) => r.circadian_score).filter((v): v is number => v != null)
  const sjl = records.map((r) => (r.sjl_hours != null ? Number(r.sjl_hours) : null)).filter(
    (v): v is number => v != null
  )
  const shifts = records
    .map((r) => timingShiftMinutes(r.prior_timing, r.recommended_timing))
    .filter((v): v is number => v != null)

  return {
    totalRecords: records.length,
    uniqueCohorts: new Set(records.map((r) => r.cohort_token)).size,
    chronotypeDistribution: distribution(records, 'chronotype_cat'),
    medicationDistribution: distribution(records, 'medication_code'),
    ageBandDistribution: distribution(records, 'age_band'),
    sexDistribution: distribution(records, 'biological_sex'),
    meanCircadianScore: mean(scores.map(Number)),
    meanSjlHours: mean(sjl),
    meanTimingShiftMinutes: mean(shifts),
    outcomesRecorded: records.filter((r) => r.outcome_type != null).length,
  }
}

/** Append-only audit entry for a licensed query (uses admin client). */
export async function logBiobankAccess(
  admin: SupabaseClient,
  entry: { licenseId: string | null; accessedBy: string; queryHash: string; recordCount: number }
): Promise<void> {
  await admin.from('biobank_access_log').insert({
    license_id: entry.licenseId,
    accessed_by: entry.accessedBy,
    query_hash: entry.queryHash,
    record_count: entry.recordCount,
  })
}
