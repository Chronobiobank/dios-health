import type { SupabaseClient } from '@supabase/supabase-js'

import { validatePatientDateOfBirth } from '@/lib/patient-dashboard/date-of-birth'

export type ChronoprofilePayload = {
  dateOfBirth: string
  biologicalSex: string
  fitzpatrickType: number
  locationCity: string
  locationCountry: string
  shiftWorker: boolean
  shiftPattern: string
  chronotypeQ1: string
  chronotypeQ2: string
  chronotypeQ3: string
}

export function isChronoprofileRpcMissing(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('could not find the function') ||
    lower.includes('function') && lower.includes('does not exist') ||
    lower.includes('complete_patient_chronoprofile')
  )
}

/** Direct row update when RPC is not deployed yet (same fields as complete_patient_chronoprofile). */
export async function savePatientChronoprofileDirect(
  supabase: SupabaseClient,
  userId: string,
  payload: ChronoprofilePayload
): Promise<{ error: string | null }> {
  const dobCheck = validatePatientDateOfBirth(payload.dateOfBirth)
  if (!dobCheck.ok) {
    return { error: dobCheck.message }
  }

  const { error } = await supabase
    .from('patient_profiles')
    .update({
      date_of_birth: payload.dateOfBirth.trim(),
      age: dobCheck.age,
      biological_sex: payload.biologicalSex.trim(),
      fitzpatrick_type: payload.fitzpatrickType,
      location_city: payload.locationCity.trim(),
      location_country: payload.locationCountry.trim(),
      shift_worker: payload.shiftWorker,
      shift_pattern: payload.shiftWorker ? payload.shiftPattern.trim() || null : null,
      chronotype_q1: payload.chronotypeQ1.trim(),
      chronotype_q2: payload.chronotypeQ2.trim(),
      chronotype_q3: payload.chronotypeQ3.trim(),
      onboarding_complete: true,
    })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
