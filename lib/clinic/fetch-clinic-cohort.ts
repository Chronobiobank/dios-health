import type { SupabaseClient } from '@supabase/supabase-js'

import {
  CLINICIAN_TRIAGE_DASHBOARD_VIEW,
  enrichTriageDashboardRow,
  sortTriageDashboardRows,
  type ClinicianTriageDashboardRow,
} from '@/lib/clinicians/clinician-triage-dashboard'
import { PRGC_MONITORING_PATIENTS } from '@/lib/clinic/prgc-monitoring'
import {
  triageRowToClinicCohortEntry,
  type ClinicCohortEntry,
} from '@/lib/clinic/triage-to-prgc'

export type ClinicCohortResult = {
  entries: ClinicCohortEntry[]
  source: 'database' | 'demo'
}

function demoCohortEntries(): ClinicCohortEntry[] {
  return PRGC_MONITORING_PATIENTS.map((prgc) => ({
    prgc,
    protocol: 'coimbra',
    patientProfileId: prgc.id,
    triageStatus: 'REVIEW' as const,
  }))
}

/** Clinician panel cohort — triage view when linked patients exist, else pRGC demo rows. */
export async function fetchClinicCohort(
  supabase: SupabaseClient,
  clinicianId: string
): Promise<ClinicCohortResult> {
  const { data, error } = await supabase
    .from(CLINICIAN_TRIAGE_DASHBOARD_VIEW)
    .select('*')
    .eq('clinician_id', clinicianId)
    .returns<ClinicianTriageDashboardRow[]>()

  if (error || !data?.length) {
    return { entries: demoCohortEntries(), source: 'demo' }
  }

  const entries = sortTriageDashboardRows(data)
    .map((row) => enrichTriageDashboardRow(row))
    .map((row) => triageRowToClinicCohortEntry(row))

  return { entries, source: 'database' }
}
