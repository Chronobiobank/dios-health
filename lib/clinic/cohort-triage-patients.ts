import { buildSeanJamesChronoimmuneProfile } from '@/lib/chronoimmune/sean-james-demo'
import { getChronoimmuneZone } from '@/lib/chronoimmune/indication-zones'
import { calculatePthTarget } from '@/lib/chronoimmune/pth-target'
import {
  getPrgcMonitoringPatient,
  PRGC_MONITORING_PATIENTS,
} from '@/lib/clinic/prgc-monitoring'
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
    consentOnFile: true,
    cohortTriageStatus: input.cohortTriageStatus,
    nextReviewDate: input.nextReviewDate,
    titrationLocked: input.titrationLocked,
    lockReason: input.lockReason,
  }
}

const seanJamesProfile = buildSeanJamesChronoimmuneProfile()

function cohortStatusFromPrgc(id: string): CohortTriageStatus {
  const row = getPrgcMonitoringPatient(id)
  if (!row) return 'amber'
  const red =
    row.sleepEfficiency.status === 'red' ||
    row.remLatency.status === 'red' ||
    row.pth.status === 'red' ||
    row.d3Timing.status === 'red'
  if (red) return 'red'
  const allGreen =
    row.sleepEfficiency.status === 'green' &&
    row.remLatency.status === 'green' &&
    row.pth.status === 'green' &&
    row.d3Timing.status === 'green'
  return allGreen ? 'green' : 'amber'
}

/** Minimal Chronoimmune profiles aligned with pRGC monitoring demo rows. */
export const COHORT_TRIAGE_DEMO_PATIENTS: CohortTriagePatient[] = [
  {
    id: 'sarah-mitchell',
    displayName: 'Sarah Mitchell',
    age: 51,
    profile: buildProfile({
      recordId: 'SM-014',
      zoneId: 2,
      indicationLabel: 'Vitamin D protocol — timing failure pattern',
      bodyWeightKg: 72,
      currentDoseIu: 28_000,
      doseRangeMinIu: 20_000,
      doseRangeMaxIu: 40_000,
      labHistory: [
        {
          testDate: '2026-03-18',
          serum25ohdNgMl: 58,
          pth: 38,
          serumCalcium: 9.4,
          urineCalcium24hrMg: 198,
          egfr: 92,
          doseIuAtTest: 28_000,
        },
      ],
      micronutrientLogged: ['d3-k2'],
      calciumCascade: { serumCalcium: 'clear', urineCalcium: 'clear', egfr: 'clear' },
      cohortTriageStatus: 'red',
      nextReviewDate: '2026-06-18',
      titrationLocked: false,
      lockReason: null,
    }),
    daysSinceLastScan: 2,
    scanCompliancePercent7d: 71,
    adherenceConfirmed: false,
    urgentFlag: 'D3 timing 29% in window — evening dosing pattern',
    urgency: 1,
  },
  {
    id: 'ngozi-eze',
    displayName: 'Ngozi Eze',
    age: 44,
    profile: buildProfile({
      recordId: 'NE-022',
      zoneId: 2,
      indicationLabel: 'Autoimmune — protocol concordant',
      bodyWeightKg: 68,
      currentDoseIu: 24_000,
      doseRangeMinIu: 18_000,
      doseRangeMaxIu: 36_000,
      labHistory: [
        {
          testDate: '2026-04-02',
          serum25ohdNgMl: 72,
          pth: 16,
          serumCalcium: 9.2,
          urineCalcium24hrMg: 175,
          egfr: 94,
          doseIuAtTest: 24_000,
        },
      ],
      micronutrientLogged: ['d3-k2', 'b5', 'b12', 'magnesium-glycinate', 'omega-3'],
      calciumCascade: { serumCalcium: 'clear', urineCalcium: 'clear', egfr: 'clear' },
      cohortTriageStatus: 'green',
      nextReviewDate: '2026-07-02',
      titrationLocked: false,
      lockReason: null,
    }),
    daysSinceLastScan: 0,
    scanCompliancePercent7d: 100,
    adherenceConfirmed: true,
    urgentFlag: null,
    urgency: 30,
  },
  {
    id: 'sean-001',
    displayName: 'Sean James',
    age: 47,
    profile: {
      ...seanJamesProfile,
      labHistory: [
        ...seanJamesProfile.labHistory.slice(0, -1),
        {
          ...seanJamesProfile.labHistory[seanJamesProfile.labHistory.length - 1],
          pth: 27,
        },
      ],
      cohortTriageStatus: 'amber',
      titrationLocked: false,
      lockReason: null,
    },
    daysSinceLastScan: 0,
    scanCompliancePercent7d: 93,
    adherenceConfirmed: true,
    urgentFlag: null,
    urgency: 15,
  },
].map((row) => ({
  ...row,
  profile: {
    ...row.profile,
    cohortTriageStatus: cohortStatusFromPrgc(row.id),
  },
}))

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

/** @deprecated Use PRGC_MONITORING_PATIENTS — kept for imports during transition. */
export { PRGC_MONITORING_PATIENTS }
