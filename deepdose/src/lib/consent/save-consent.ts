import type { SupabaseClient } from '@supabase/supabase-js'

export interface PatientConsentRow {
  patient_id: string
  purpose_code: string
  framework_id: string
  granted: boolean
  granted_at: string | null
  withdrawn_at: string | null
  ip_address: string | null
  user_agent: string | null
}

/** Insert or update without ON CONFLICT (works before unique index migration is applied). */
export async function savePatientConsent(
  supabase: SupabaseClient,
  row: PatientConsentRow
): Promise<{ error: string | null }> {
  const { data: existingRows, error: selectError } = await supabase
    .from('patient_consents')
    .select('id')
    .eq('patient_id', row.patient_id)
    .eq('purpose_code', row.purpose_code)
    .limit(1)

  if (selectError) {
    return { error: selectError.message }
  }

  const existing = existingRows?.[0]

  if (existing) {
    const { error: updateError } = await supabase
      .from('patient_consents')
      .update({
        framework_id: row.framework_id,
        granted: row.granted,
        granted_at: row.granted_at,
        withdrawn_at: row.withdrawn_at,
        ip_address: row.ip_address,
        user_agent: row.user_agent,
      })
      .eq('id', existing.id)

    if (updateError) {
      return { error: updateError.message }
    }
  } else {
    const { error: insertError } = await supabase.from('patient_consents').insert(row)

    if (insertError) {
      return { error: insertError.message }
    }
  }

  return { error: null }
}
