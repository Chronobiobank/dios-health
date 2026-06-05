import type {
  ChronoimmuneLabPoint,
  ChronoimmuneMicronutrientLog,
  ChronoimmuneProfile,
  CohortTriageStatus,
} from '@/lib/patient-dashboard/types'
import { getChronoimmuneZone } from '@/lib/chronoimmune/indication-zones'
import { calculatePthTarget } from '@/lib/chronoimmune/pth-target'

export const SEAN_JAMES_RECORD_ID = 'SEAN-001'

const PTH_REF_LOWER = 15
const PTH_REF_UPPER = 65

const labHistory: ChronoimmuneLabPoint[] = [
  {
    testDate: '2025-09-12',
    serum25ohdNgMl: 38,
    pth: 52,
    serumCalcium: 9.2,
    urineCalcium24hrMg: 180,
    egfr: 94,
    doseIuAtTest: 0,
  },
  {
    testDate: '2025-12-08',
    serum25ohdNgMl: 54,
    pth: 44,
    serumCalcium: 9.4,
    urineCalcium24hrMg: 195,
    egfr: 93,
    doseIuAtTest: 18_000,
  },
  {
    testDate: '2026-03-14',
    serum25ohdNgMl: 68,
    pth: 36,
    serumCalcium: 9.3,
    urineCalcium24hrMg: 210,
    egfr: 92,
    doseIuAtTest: 22_000,
  },
]

const latestLab = labHistory[labHistory.length - 1]
const pthTarget = calculatePthTarget(latestLab.pth, PTH_REF_LOWER, PTH_REF_UPPER)

const zone = getChronoimmuneZone(2)

const micronutrientLog: ChronoimmuneMicronutrientLog[] = zone.micronutrients.map((id) => ({
  id,
  logged: id === 'd3-k2' || id === 'b5' || id === 'magnesium-glycinate',
}))

/** Sean James — Zone 2 Chronoimmune demo (SEAN-001). */
export function buildSeanJamesChronoimmuneProfile(): ChronoimmuneProfile {
  const bodyWeightKg = 84
  const currentDoseIu = 22_000
  const iuPerKg = Math.round((currentDoseIu / bodyWeightKg) * 10) / 10

  return {
    recordId: SEAN_JAMES_RECORD_ID,
    zoneId: 2,
    indicationLabel: 'Psoriasis — mild autoimmune',
    bodyWeightKg,
    currentDoseIu,
    doseRangeMinIu: 10_000,
    doseRangeMaxIu: 30_000,
    iuPerKg,
    pthReferenceLower: PTH_REF_LOWER,
    pthReferenceUpper: PTH_REF_UPPER,
    pthTargetCeiling: pthTarget.targetCeiling,
    pthFloorThreshold: 8,
    labHistory,
    micronutrientLog,
    safetyGateLevel: zone.safetyGateLevel,
    labReviewFrequency: zone.labReviewFrequency,
    calciumCascade: {
      serumCalcium: 'clear',
      urineCalcium: 'clear',
      egfr: 'clear',
    },
    consentOnFile: false,
    cohortTriageStatus: 'green' satisfies CohortTriageStatus,
    nextReviewDate: '2026-06-28',
    titrationLocked: false,
    lockReason: null,
  }
}
