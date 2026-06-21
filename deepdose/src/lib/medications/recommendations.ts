import {
  buildMedicationRecommendation,
  getMedicationCatalog,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'

export type { MedicationRecommendation } from '@/lib/medications/catalog'

interface DbMedication {
  code: string
  display_name: string
  drug_class: string | null
  evidence_grade: 'A' | 'B' | 'C' | null
}

/** Legacy helper — builds recommendations for DB rows that exist in the catalog. */
export function buildMedicationRecommendations(
  dbMedications: DbMedication[],
  phaseOffsetMinutes: number
): MedicationRecommendation[] {
  const catalogByCode = new Map(getMedicationCatalog().map((e) => [e.code, e]))

  return dbMedications
    .filter((m) => catalogByCode.has(m.code))
    .map((m) => buildMedicationRecommendation(catalogByCode.get(m.code)!, phaseOffsetMinutes))
}
