import type { SupabaseClient } from '@supabase/supabase-js'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'

export const CLINICAL_CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
}

export const PRESCRIBING_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  modified: 'Modified',
}

export type ClinicalPatientHeader = {
  patientId: string
  displayName: string
  isPremiumTier: boolean
  deviceAlertTriggered: boolean
  lastDeviceSyncAt: string | null
}

export type AdherenceLogEntry = {
  id: string
  medication_code: string
  taken_at: string
  in_window: boolean
  source: string
}

export async function requireClinicalPatientAccess(
  supabase: SupabaseClient,
  clinicianId: string,
  patientId: string
): Promise<boolean> {
  return clinicianCanAccessPatient(supabase, clinicianId, patientId)
}

export async function loadClinicalPatientHeader(
  supabase: SupabaseClient,
  patientId: string
): Promise<ClinicalPatientHeader | null> {
  const [{ data: patientProfile }, { data: userProfile }] = await Promise.all([
    supabase
      .from('patient_profiles')
      .select('is_premium_tier, device_alert_triggered, last_device_sync_at')
      .eq('id', patientId)
      .single(),
    supabase.from('user_profiles').select('display_name').eq('id', patientId).single(),
  ])

  if (!patientProfile) return null

  return {
    patientId,
    displayName: userProfile?.display_name ?? 'Patient',
    isPremiumTier: patientProfile.is_premium_tier ?? false,
    deviceAlertTriggered: patientProfile.device_alert_triggered ?? false,
    lastDeviceSyncAt: patientProfile.last_device_sync_at,
  }
}

export async function fetchPatientAdherenceLog(
  supabase: SupabaseClient,
  patientId: string,
  limit = 30
): Promise<AdherenceLogEntry[]> {
  const { data } = await supabase
    .from('medication_adherence_log')
    .select('id, medication_code, taken_at, in_window, source')
    .eq('patient_id', patientId)
    .order('taken_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as AdherenceLogEntry[]
}
