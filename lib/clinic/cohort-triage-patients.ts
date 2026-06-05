import { buildSeanJamesChronoimmuneProfile } from '@/lib/chronoimmune/sean-james-demo'
import { getChronoimmuneZone } from '@/lib/chronoimmune/indication-zones'
import { calculatePthTarget } from '@/lib/chronoimmune/pth-target'
import type {
  ChronoimmuneLabPoint,
  ChronoimmuneMicronutrientLog,
  ChronoimmuneProfile,
  CohortTriageStatus,
} from '@/lib/patient-dashboard/types'

export type CohortTriagePatient = {
  id: string
  displayName: string
  age: number
  profile: ChronoimmuneProfile
  daysSinceLastScan: number
  scanCompliancePercent7d: number
  adherenceConfirmed: boolean
  urgentFlag: string | null
  /** Lower = more urgent within a triage column */
  urgency: number
}

const PTH_REF_LOWER = 15
const PTH_REF_UPPER = 65
const PTH_FLOOR = 8

function buildMicronutrientLog(zoneId: ChronoimmuneProfile['zoneId'], loggedIds: string[]): ChronoimmuneMicronutrientLog[] {
  const zone = getChronoimmuneZone(zoneId)
  return zone.micronutrients.map((id) => ({
    id,
    logged: loggedIds.includes(id),
  }))
}

function buildProfile(input: {
  recordId: string
  zoneId: ChronoimmuneProfile['zoneId']
  indicationLabel: string
  bodyWeightKg: number
  currentDoseIu: number
  doseRangeMinIu: number
  doseRangeMaxIu: number
  labHistory: ChronoimmuneLabPoint[]
  micronutrientLogged: string[]
  calciumCascade: ChronoimmuneProfile['calciumCascade']
  cohortTriageStatus: CohortTriageStatus
  nextReviewDate: string
  titrationLocked: boolean
  lockReason: string | null
  consentOnFile?: boolean
}): ChronoimmuneProfile {
  const zone = getChronoimmuneZone(input.zoneId)
  const latest = input.labHistory[input.labHistory.length - 1]
  const pthTarget = calculatePthTarget(latest.pth, PTH_REF_LOWER, PTH_REF_UPPER, PTH_FLOOR)
  const iuPerKg = Math.round((input.currentDoseIu / input.bodyWeightKg) * 10) / 10

  return {
    recordId: input.recordId,
    zoneId: input.zoneId,
    indicationLabel: input.indicationLabel,
    bodyWeightKg: input.bodyWeightKg,
    currentDoseIu: input.currentDoseIu,
    doseRangeMinIu: input.doseRangeMinIu,
    doseRangeMaxIu: input.doseRangeMaxIu,
    iuPerKg,
    pthReferenceLower: PTH_REF_LOWER,
    pthReferenceUpper: PTH_REF_UPPER,
    pthTargetCeiling: pthTarget.targetCeiling,
    pthFloorThreshold: PTH_FLOOR,
    labHistory: input.labHistory,
    micronutrientLog: buildMicronutrientLog(input.zoneId, input.micronutrientLogged),
    safetyGateLevel: zone.safetyGateLevel,
    labReviewFrequency: zone.labReviewFrequency,
    calciumCascade: input.calciumCascade,
    consentOnFile: input.consentOnFile ?? true,
    cohortTriageStatus: input.cohortTriageStatus,
    nextReviewDate: input.nextReviewDate,
    titrationLocked: input.titrationLocked,
    lockReason: input.lockReason,
  }
}

const seanJamesProfile = buildSeanJamesChronoimmuneProfile()

export const COHORT_TRIAGE_DEMO_PATIENTS: CohortTriagePatient[] = [
  {
    id: 'sean-001',
    displayName: 'Sean James',
    age: 47,
    profile: {
      ...seanJamesProfile,
      cohortTriageStatus: 'green',
      titrationLocked: false,
      lockReason: null,
    },
    daysSinceLastScan: 0,
    scanCompliancePercent7d: 93,
    adherenceConfirmed: true,
    urgentFlag: null,
    urgency: 30,
  },
  {
    id: 'demo-patient-red',
    displayName: 'Elena R.',
    age: 52,
    profile: buildProfile({
      recordId: 'RED-001',
      zoneId: 4,
      indicationLabel: 'Multiple sclerosis — severe neurological',
      bodyWeightKg: 68,
      currentDoseIu: 68_000,
      doseRangeMinIu: 60_000,
      doseRangeMaxIu: 100_000,
      labHistory: [
        {
          testDate: '2026-01-10',
          serum25ohdNgMl: 112,
          pth: 18,
          serumCalcium: 9.1,
          urineCalcium24hrMg: 240,
          egfr: 88,
          doseIuAtTest: 60_000,
        },
        {
          testDate: '2026-03-05',
          serum25ohdNgMl: 128,
          pth: 11,
          serumCalcium: 9.6,
          urineCalcium24hrMg: 310,
          egfr: 86,
          doseIuAtTest: 64_000,
        },
        {
          testDate: '2026-05-20',
          serum25ohdNgMl: 134,
          pth: 6,
          serumCalcium: 10.4,
          urineCalcium24hrMg: 340,
          egfr: 84,
          doseIuAtTest: 68_000,
        },
      ],
      micronutrientLogged: [
        'd3-k2',
        'b5',
        'b12',
        'magnesium-glycinate',
        'omega-3',
        'riboflavin-b2',
        'magnesium-citrate',
      ],
      calciumCascade: {
        serumCalcium: 'alert',
        urineCalcium: 'hold',
        egfr: 'watch',
      },
      cohortTriageStatus: 'red',
      nextReviewDate: '2026-05-28',
      titrationLocked: true,
      lockReason: 'PTH floor alert and calcium cascade — clinician note required before any dose change',
      consentOnFile: true,
    }),
    daysSinceLastScan: 5,
    scanCompliancePercent7d: 28,
    adherenceConfirmed: false,
    urgentFlag: 'PTH floor alert · calcium cascade flagged · 5 missed morning scans',
    urgency: 1,
  },
  {
    id: 'demo-patient-amber',
    displayName: 'Marcus H.',
    age: 44,
    profile: buildProfile({
      recordId: 'AMB-001',
      zoneId: 3,
      indicationLabel: 'Rheumatoid arthritis — moderate autoimmune',
      bodyWeightKg: 79,
      currentDoseIu: 42_000,
      doseRangeMinIu: 30_000,
      doseRangeMaxIu: 60_000,
      labHistory: [
        {
          testDate: '2025-11-18',
          serum25ohdNgMl: 72,
          pth: 54,
          serumCalcium: 9.3,
          urineCalcium24hrMg: 210,
          egfr: 91,
          doseIuAtTest: 36_000,
        },
        {
          testDate: '2026-02-12',
          serum25ohdNgMl: 88,
          pth: 48,
          serumCalcium: 9.4,
          urineCalcium24hrMg: 225,
          egfr: 90,
          doseIuAtTest: 40_000,
        },
        {
          testDate: '2026-04-22',
          serum25ohdNgMl: 94,
          pth: 46,
          serumCalcium: 9.2,
          urineCalcium24hrMg: 218,
          egfr: 89,
          doseIuAtTest: 42_000,
        },
      ],
      micronutrientLogged: ['d3-k2', 'b5', 'b12', 'magnesium-glycinate', 'omega-3'],
      calciumCascade: {
        serumCalcium: 'clear',
        urineCalcium: 'clear',
        egfr: 'clear',
      },
      cohortTriageStatus: 'amber',
      nextReviewDate: '2026-05-08',
      titrationLocked: false,
      lockReason: null,
    }),
    daysSinceLastScan: 1,
    scanCompliancePercent7d: 60,
    adherenceConfirmed: true,
    urgentFlag: 'Lab review overdue 3 weeks · PTH still in middle third',
    urgency: 10,
  },
]

export function patientsByTriageColumn(
  patients: CohortTriagePatient[] = COHORT_TRIAGE_DEMO_PATIENTS
): Record<CohortTriageStatus, CohortTriagePatient[]> {
  const sortByUrgency = (list: CohortTriagePatient[]) =>
    [...list].sort((a, b) => a.urgency - b.urgency)

  return {
    red: sortByUrgency(patients.filter((p) => p.profile.cohortTriageStatus === 'red')),
    amber: sortByUrgency(patients.filter((p) => p.profile.cohortTriageStatus === 'amber')),
    green: sortByUrgency(patients.filter((p) => p.profile.cohortTriageStatus === 'green')),
  }
}

export function getCohortTriagePatient(id: string): CohortTriagePatient | null {
  return COHORT_TRIAGE_DEMO_PATIENTS.find((p) => p.id === id) ?? null
}

export function cohortTriageCounts(patients: CohortTriagePatient[] = COHORT_TRIAGE_DEMO_PATIENTS) {
  const columns = patientsByTriageColumn(patients)
  return {
    red: columns.red.length,
    amber: columns.amber.length,
    green: columns.green.length,
    total: patients.length,
  }
}
