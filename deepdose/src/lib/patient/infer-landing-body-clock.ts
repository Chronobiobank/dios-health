import { earliestTakeTime } from '@/lib/medications/home-to-onboarding'
import { buildSixDoseStrip, type SixDoseStripItem } from '@/lib/patient/six-dose-strip'
import { timeToMinutes } from '@/lib/utils/time'
import {
  phenotypeFromWakeMinutes,
  phenotypeHintLine,
  type ChemicalPhenotype,
} from '@/lib/brand/chemical-phenotypes'

const TYPICAL_SLEEP_HOURS = 8
const WIND_DOWN_MINUTES = 90
const SLEEP_ONSET_TO_DLMO = 120

function minutesToClock(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export type LandingBodyClockProfile = {
  dlmoEstimateHours: number
  dlmoLabel: string
  wakeLabel: string
  sleepOnsetLabel: string
  sleepTargetLabel: string
  /** @deprecated Prefer phenotypeHint / phenotype */
  chronotypeHint: string
  phenotype: ChemicalPhenotype
  phenotypeHint: string
  profileLine: string
}

/** Body-clock anchor from wake + medicine times only — no wearable sync yet. */
export function inferLandingBodyClock(
  wake: string | null,
  medTimes: string[]
): LandingBodyClockProfile {
  const wakeClock = wake?.trim()?.slice(0, 5) ?? earliestTakeTime(medTimes) ?? '07:30'
  const wakeMin = timeToMinutes(wakeClock)

  const eveningTimes = medTimes
    .map((t) => t.trim().slice(0, 5))
    .filter(Boolean)
    .map(timeToMinutes)
    .filter((m) => m >= 17 * 60 || m < 4 * 60)

  const latestCue = eveningTimes.length
    ? Math.max(...eveningTimes.map((m) => (m < 4 * 60 ? m + 1440 : m)))
    : null

  const defaultSleepOnset = wakeMin - TYPICAL_SLEEP_HOURS * 60
  const sleepOnsetMin = latestCue != null ? latestCue + WIND_DOWN_MINUTES : defaultSleepOnset
  const dlmoMin = sleepOnsetMin - SLEEP_ONSET_TO_DLMO
  const dlmoEstimateHours = ((Math.round(dlmoMin) / 60) % 24 + 24) % 24
  const sleepTargetMin = sleepOnsetMin + 30

  const morningTimes = medTimes
    .map((t) => timeToMinutes(t.trim().slice(0, 5)))
    .filter((m) => m >= wakeMin - 60 && m <= wakeMin + 180)

  const phenotype = phenotypeFromWakeMinutes(wakeMin)
  const phenotypeHint = phenotypeHintLine(phenotype)

  const profileLine =
    morningTimes.length > 0
      ? `Your morning medicines cluster around ${minutesToClock(Math.min(...morningTimes))} — we've anchored your chemical phenotype from that pattern and your wake time.`
      : `We've anchored your chemical phenotype from your ${wakeClock} wake time and medicine schedule.`

  return {
    dlmoEstimateHours,
    dlmoLabel: minutesToClock(dlmoMin),
    wakeLabel: wakeClock,
    sleepOnsetLabel: minutesToClock(sleepOnsetMin),
    sleepTargetLabel: minutesToClock(sleepTargetMin),
    chronotypeHint: phenotypeHint,
    phenotype,
    phenotypeHint,
    profileLine,
  }
}

export type OnboardingDoseItem = Pick<
  SixDoseStripItem,
  'id' | 'label' | 'timeLabel' | 'note'
> & { instruction: string }

/** Six daily doses for onboarding — reuses member strip schedule. */
export function buildOnboardingDoseSchedule(
  dlmoEstimateHours: number
): OnboardingDoseItem[] {
  return buildSixDoseStrip(dlmoEstimateHours).map((item) => ({
    id: item.id,
    label: item.shortLabel,
    timeLabel: item.timeLabel,
    note: item.note,
    instruction: item.note,
  }))
}
