import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
  type MedicationTiming,
} from '@/lib/circadian/medications'

export interface MedicationRecommendation {
  code: MedicationCode
  displayName: string
  drugClass: string
  evidenceGrade: 'A' | 'B' | 'C'
  rationale: string
  recommendedStart: string
  recommendedEnd: string
  phaseAdjusted: boolean
}

interface DbMedication {
  code: string
  display_name: string
  drug_class: string | null
  evidence_grade: 'A' | 'B' | 'C' | null
}

export function buildMedicationRecommendations(
  dbMedications: DbMedication[],
  phaseOffsetMinutes: number
): MedicationRecommendation[] {
  return dbMedications
    .filter((m): m is DbMedication & { code: MedicationCode } => m.code in MEDICATION_TIMINGS)
    .map((m) => {
      const timing: MedicationTiming = MEDICATION_TIMINGS[m.code]
      const window = adjustTimingForPhase(timing, phaseOffsetMinutes)

      return {
        code: m.code,
        displayName: m.display_name,
        drugClass: m.drug_class ?? timing.drugClass,
        evidenceGrade: (m.evidence_grade ?? timing.evidenceGrade) as 'A' | 'B' | 'C',
        rationale: timing.rationale,
        recommendedStart: window.start,
        recommendedEnd: window.end,
        phaseAdjusted: timing.phaseOffsetSensitive && phaseOffsetMinutes !== 0,
      }
    })
}
