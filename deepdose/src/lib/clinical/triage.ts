import type { SupabaseClient } from '@supabase/supabase-js'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'

export type TriageStatus = 'URGENT' | 'REVIEW' | 'ON_TRACK'

export type ClinicianTriageRow = {
  patientId: string
  patientName: string
  patientRef: string
  isPremiumTier: boolean
  deviceAlertTriggered: boolean
  triageStatus: TriageStatus
  circadianScore: number
  chronotypeLabel: string | null
  lastDeviceSyncAt: string | null
  linkedAt: string
}

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
}

const STATUS_WEIGHT: Record<TriageStatus, number> = {
  URGENT: 0,
  REVIEW: 1,
  ON_TRACK: 2,
}

function deriveTriageStatus(
  deviceAlert: boolean,
  score: number
): TriageStatus {
  if (deviceAlert) return 'URGENT'
  if (score > 0 && score < 50) return 'REVIEW'
  return 'ON_TRACK'
}

export function sortTriageRows(rows: ClinicianTriageRow[]): ClinicianTriageRow[] {
  return [...rows].sort((a, b) => {
    if (a.deviceAlertTriggered !== b.deviceAlertTriggered) {
      return a.deviceAlertTriggered ? -1 : 1
    }
    const statusDelta = STATUS_WEIGHT[a.triageStatus] - STATUS_WEIGHT[b.triageStatus]
    if (statusDelta !== 0) return statusDelta
    return a.patientName.localeCompare(b.patientName)
  })
}

export async function fetchClinicianTriageRows(
  supabase: SupabaseClient,
  clinicianId: string
): Promise<ClinicianTriageRow[]> {
  const { data: relationships, error } = await supabase
    .from('care_relationships')
    .select('patient_id, created_at')
    .eq('clinician_id', clinicianId)
    .eq('active', true)

  if (error || !relationships?.length) {
    return []
  }

  const rows: ClinicianTriageRow[] = []

  for (const rel of relationships) {
    const { data: profile } = await supabase
      .from('patient_profiles')
      .select('is_premium_tier, device_alert_triggered, last_device_sync_at')
      .eq('id', rel.patient_id)
      .single()

    if (!profile) continue

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', rel.patient_id)
      .single()

    const context = await getPatientCircadianContext(supabase, rel.patient_id)
    const chronotypeLabel = context.chronotypeCat
      ? CHRONOTYPE_LABELS[context.chronotypeCat] ?? context.chronotypeCat
      : null

    rows.push({
      patientId: rel.patient_id,
      patientName: userProfile?.display_name ?? 'Patient',
      patientRef: rel.patient_id.slice(0, 8).toUpperCase(),
      isPremiumTier: profile.is_premium_tier,
      deviceAlertTriggered: profile.device_alert_triggered,
      triageStatus: deriveTriageStatus(
        profile.device_alert_triggered,
        context.circadianScore
      ),
      circadianScore: context.circadianScore,
      chronotypeLabel,
      lastDeviceSyncAt: profile.last_device_sync_at,
      linkedAt: rel.created_at,
    })
  }

  return sortTriageRows(rows)
}

export async function clinicianCanAccessPatient(
  supabase: SupabaseClient,
  clinicianId: string,
  patientId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('care_relationships')
    .select('id')
    .eq('clinician_id', clinicianId)
    .eq('patient_id', patientId)
    .eq('active', true)
    .maybeSingle()

  return Boolean(data)
}
