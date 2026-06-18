import type { SupabaseClient } from '@supabase/supabase-js'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { computePatientBti } from './engine'
import type { BtiPayload } from './types'

export async function loadPatientBti(
  supabase: SupabaseClient,
  patientId: string
): Promise<BtiPayload[]> {
  const [context, medsResult, profileResult] = await Promise.all([
    getPatientCircadianContext(supabase, patientId),
    supabase
      .from('patient_medications')
      .select('medication_code, current_timing')
      .eq('patient_id', patientId)
      .eq('is_active', true),
    supabase
      .from('patient_profiles')
      .select('device_alert_triggered')
      .eq('id', patientId)
      .maybeSingle(),
  ])

  return computePatientBti(patientId, medsResult.data ?? [], context, {
    deviceAlertTriggered: profileResult.data?.device_alert_triggered ?? false,
  })
}
