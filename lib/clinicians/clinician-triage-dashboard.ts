import { createClient } from '@/lib/supabase/client'
import {
  getLocalTriageCohort,
  TRIAGE_MOCK_COHORT,
  type TriageMockPatient,
  type WearableSource,
} from '@/lib/clinicians/triage-mock-cohort'
import type { TriageStatus } from '@/lib/clinicians/triage-types'

export const CLINICIAN_TRIAGE_DASHBOARD_VIEW = 'clinician_triage_dashboard' as const

export type ClinicianTriageDashboardRow = {
  patient_id: string
  patient_name: string
  patient_ref: string
  protocol: string
  is_premium_tier: boolean
  device_alert_triggered: boolean
  triage_status: TriageStatus
  pth_pgml: number | null
  pth_trend: string | null
  next_lab_due: string | null
  last_telemetry_sync_at: string | null
  enrolled_at: string
  primary_medication_id: string
  clinician_id: string | null
}

const TRIAGE_SORT_WEIGHT: Record<TriageStatus, number> = {
  URGENT: 0,
  REVIEW: 1,
  ON_TRACK: 2,
}

/** Device alerts first, then triage status (CLAUDE.md §5). */
export function sortTriageDashboardRows(
  rows: ClinicianTriageDashboardRow[]
): ClinicianTriageDashboardRow[] {
  return [...rows].sort((a, b) => {
    if (a.device_alert_triggered !== b.device_alert_triggered) {
      return a.device_alert_triggered ? -1 : 1
    }
    const statusDelta =
      TRIAGE_SORT_WEIGHT[a.triage_status] - TRIAGE_SORT_WEIGHT[b.triage_status]
    if (statusDelta !== 0) return statusDelta
    return a.patient_name.localeCompare(b.patient_name)
  })
}

function deriveWearableSource(row: ClinicianTriageDashboardRow): WearableSource {
  const mockMatch = TRIAGE_MOCK_COHORT.find(
    (patient) =>
      patient.patient_id === row.patient_id || patient.patient_ref === row.patient_ref
  )
  if (mockMatch) return mockMatch.wearable_source
  return row.is_premium_tier ? 'tiptraq' : 'oura'
}

export function enrichTriageDashboardRow(row: ClinicianTriageDashboardRow): TriageMockPatient {
  const mockMatch = TRIAGE_MOCK_COHORT.find(
    (patient) =>
      patient.patient_id === row.patient_id || patient.patient_ref === row.patient_ref
  )

  return {
    ...row,
    wearable_source: deriveWearableSource(row),
    bti_delay_minutes: mockMatch?.bti_delay_minutes ?? null,
  }
}

/** Supabase view when available; local mock cohort otherwise (CLAUDE.md §5). */
export async function fetchClinicianTriageDashboard(
  clinicianId?: string | null
): Promise<TriageMockPatient[]> {
  const supabase = createClient()

  let query = supabase.from(CLINICIAN_TRIAGE_DASHBOARD_VIEW).select('*')

  if (clinicianId) {
    query = query.eq('clinician_id', clinicianId)
  }

  const { data, error } = await query.returns<ClinicianTriageDashboardRow[]>()

  if (error || !data || data.length === 0) {
    return getLocalTriageCohort()
  }

  return sortTriageDashboardRows(data.map(enrichTriageDashboardRow)) as TriageMockPatient[]
}
