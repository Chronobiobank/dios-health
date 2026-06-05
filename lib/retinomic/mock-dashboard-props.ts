import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'
import {
  DAY_ONE_LOCKED_COPY,
  dayOneInterventionIntro,
  morningMluxMinutesFromBaseline,
  tailorDailyInterventionForBaseline,
} from '@/lib/retinomic/day-one-dashboard'
import type { BaselineScanSummary } from '@/lib/retinomic/baseline-scan-summary'
import {
  estimateInitialVdrFromBaseline,
  resolveLiveMluxFeed,
} from '@/lib/retinomic/live-mlux-feed'
import type { RetinomicDashboardProps } from '@/lib/retinomic/types'
import { resolvePhoticDayPhase } from '@/lib/retinomic/photic-dose'
import { buildDailyInterventionForPatient, resolveChronotypePhase } from '@/src/lib/engine/intervention'
import { buildMedicationTimingFromIntervention } from '@/src/lib/engine/medication-timing'
import type { DailyIntervention } from '@/src/lib/engine/types'
import type { HardwareBaseline } from '@/src/types'

const MOCK_BASELINE_SCAN: BaselineScanSummary = {
  irisPigment: 'LIGHT',
  skinITA: 41.2,
  fitzpatrickRoman: 'III',
  locationLabel: 'Auckland, New Zealand',
  lat: -36.8485,
  lng: 174.7633,
  solarZenithDegrees: 58,
}

const MOCK_HARDWARE_BASELINE: HardwareBaseline & {
  onboardingGeo: { lat: number; lng: number; solarZenithDegrees: number }
} = {
  irisPigment: 'LIGHT',
  skinITA: 41.2,
  gclIplThicknessMicrons: { leftEye: null, rightEye: null },
  onboardingGeo: {
    lat: MOCK_BASELINE_SCAN.lat,
    lng: MOCK_BASELINE_SCAN.lng,
    solarZenithDegrees: MOCK_BASELINE_SCAN.solarZenithDegrees ?? 58,
  },
}

const MOCK_MELANOPIC_CEILING = 420
const MOCK_PHOTIC_PHASE = resolvePhoticDayPhase()
const MOCK_MORNING_MLUX = morningMluxMinutesFromBaseline(
  MOCK_BASELINE_SCAN.irisPigment,
  MOCK_BASELINE_SCAN.skinITA
)

const MOCK_VDR = estimateInitialVdrFromBaseline(MOCK_BASELINE_SCAN.irisPigment, MOCK_PHOTIC_PHASE)

const mockLiveMluxFeedInput = {
  melanopicLuxCeiling: MOCK_MELANOPIC_CEILING,
  photicPhase: MOCK_PHOTIC_PHASE,
  mluxScore: null as number | null,
  smartphoneFeed: {
    observedAt: new Date().toISOString(),
    vdrDoseToday: MOCK_VDR,
    outdoorLightBefore10am: MOCK_VDR >= 50,
    confidenceScore: 38,
  },
  smartphoneActive: true,
  hardwareBaseline: MOCK_HARDWARE_BASELINE,
}

const mockLiveMluxFeed = resolveLiveMluxFeed(mockLiveMluxFeedInput)

const mockDailyIntervention = tailorDailyInterventionForBaseline(
  buildDailyInterventionForPatient({
    tier: 'FREE_SCREENING',
    chronotypeLabel: 'Night owl',
    chronotypeWakeTime: '08:00',
    vitaminD3NmolL: null,
    vitaminB5UmolL: null,
    remSleepEfficiencyPercent: null,
    microArousalsCount: null,
    eveningLightDisciplineOptimal: false,
    morningMluxTargetDurationMinutes: MOCK_MORNING_MLUX,
    locationCity: 'Auckland',
    locationCountry: 'New Zealand',
  }),
  MOCK_BASELINE_SCAN,
  'FREE_SCREENING',
  MOCK_MORNING_MLUX,
  mockLiveMluxFeed.source
)

export const MOCK_RETINOMIC_DASHBOARD: RetinomicDashboardProps & {
  fullName: string
  avatarUrl: string
  dailyIntervention: DailyIntervention
} = {
  greeting: 'Kia ora, Sean.',
  firstName: 'Sean',
  fullName: 'Sean James',
  avatarUrl: DEFAULT_DASHBOARD_AVATAR,
  tier: 'FREE_SCREENING' as const,
  baselineScan: MOCK_BASELINE_SCAN,
  dayOneIntro: dayOneInterventionIntro(MOCK_BASELINE_SCAN, mockLiveMluxFeed.source),
  photicDoseSourceCaption: mockLiveMluxFeed.caption,
  liveMluxFeedInput: mockLiveMluxFeedInput,
  bloodLockedCopy: DAY_ONE_LOCKED_COPY.blood,
  sleepLockedCopy: DAY_ONE_LOCKED_COPY.sleep,
  melanopicLuxToday: mockLiveMluxFeed.melanopicLuxToday,
  melanopicLuxCeiling: MOCK_MELANOPIC_CEILING,
  photicPhase: MOCK_PHOTIC_PHASE,
  lightIrisDetected: true,
  vitaminD3NmolL: null,
  vitaminB5UmolL: null,
  remCycleEfficiency: null,
  autonomicStrain: null,
  dailyIntervention: mockDailyIntervention,
  medicationTiming: buildMedicationTimingFromIntervention({
    intervention: mockDailyIntervention,
    chronotype: resolveChronotypePhase('Night owl'),
    currentMedications: null,
  }),
}
