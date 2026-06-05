import type { RetinomicDashboardProps } from '@/lib/retinomic/types'
import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'
import { buildDailyInterventionForPatient } from '@/src/lib/engine/intervention'
import type { DailyIntervention } from '@/src/lib/engine/types'

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
  baselineScan: {
    irisPigment: 'LIGHT',
    skinITA: 41.2,
    fitzpatrickRoman: 'III',
    locationLabel: 'Auckland, New Zealand',
    lat: -36.8485,
    lng: 174.7633,
    solarZenithDegrees: 58,
  },
  melanopicLuxToday: 248,
  melanopicLuxCeiling: 420,
  photicPhase: 'morning',
  lightIrisDetected: true,
  vitaminD3NmolL: 142,
  vitaminB5UmolL: 1.8,
  remCycleEfficiency: 86,
  autonomicStrain: 0.34,
  dailyIntervention: buildDailyInterventionForPatient({
    tier: 'FREE_SCREENING',
    chronotypeLabel: 'Night owl',
    chronotypeWakeTime: '08:00',
    vitaminD3NmolL: 142,
    vitaminB5UmolL: 1.8,
    remSleepEfficiencyPercent: 86,
    microArousalsCount: 4,
    eveningLightDisciplineOptimal: true,
    morningMluxTargetDurationMinutes: 90,
    locationCity: 'Auckland',
    locationCountry: 'New Zealand',
  }),
}
