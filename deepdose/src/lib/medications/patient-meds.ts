import type { SupabaseClient } from '@supabase/supabase-js'

import {
  buildMedicationRecommendation,
  getCatalogEntry,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'

export type PatientMedicationRow = {
  code: string
  dose_mg: number | null
  current_timing: string | null
  recommendation: MedicationRecommendation
}

function formatTimingFromDb(value: string | null): string | null {
  if (!value) return null
  return value.slice(0, 5)
}

export async function loadActivePatientMedications(
  supabase: SupabaseClient,
  patientId: string
): Promise<{ context: Awaited<ReturnType<typeof getPatientCircadianContext>>; medications: PatientMedicationRow[] }> {
  const [context, { data: rows, error }] = await Promise.all([
    getPatientCircadianContext(supabase, patientId),
    supabase
      .from('patient_medications')
      .select('medication_code, dose_mg, current_timing')
      .eq('patient_id', patientId)
      .eq('is_active', true)
      .order('started_at', { ascending: true }),
  ])

  if (error) {
    throw new Error(error.message)
  }

  const medications: PatientMedicationRow[] = []

  for (const row of rows ?? []) {
    const entry = getCatalogEntry(row.medication_code)
    if (!entry) continue

    medications.push({
      code: row.medication_code,
      dose_mg: row.dose_mg != null ? Number(row.dose_mg) : null,
      current_timing: formatTimingFromDb(row.current_timing),
      recommendation: buildMedicationRecommendation(entry, context.phaseOffsetMinutes),
    })
  }

  return { context, medications }
}

export function patientMedRowsToEditorState(rows: PatientMedicationRow[]): {
  selected: Map<string, MedicationRecommendation>
  details: Record<string, { doseValue: string; currentTiming: string }>
} {
  const selected = new Map<string, MedicationRecommendation>()
  const details: Record<string, { doseValue: string; currentTiming: string }> = {}

  for (const row of rows) {
    selected.set(row.code, row.recommendation)
    details[row.code] = {
      doseValue: row.dose_mg != null ? String(row.dose_mg) : '',
      currentTiming:
        row.current_timing ??
        row.recommendation.recommendedStart ??
        '08:00',
    }
  }

  return { selected, details }
}
