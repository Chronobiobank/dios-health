import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import {
  bodyClockScoreFromProfile,
  buildPatientMelatoninProfile,
} from '@/lib/patient/patient-landing-melatonin'
import { resolvePolyPlanMeds, syncStateForRisk } from '@/lib/medications/poly-plan-meds'
import { DeepdoseLocalEngine, sleepBlocksFromLogs } from '@/lib/unmed/local-engine'
import { sriTone, type SriTone } from '@/lib/unmed/product-philosophy'
import { timeToMinutes } from '@/lib/utils/time'

export type SleepDisorderRiskLevel = 'low' | 'watch' | 'elevated'

export type LandingRiskInput = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
}

export type LandingRiskAnalysis = {
  sriProxy: number
  sriTone: SriTone
  medCount: number
  polypharmacyTier: 'standard' | 'polypharmacy' | 'hyperpolypharmacy'
  timingConflictCount: number
  highRiskTimingCount: number
  sleepCascadeMedCount: number
  sleepDisorderRisk: SleepDisorderRiskLevel
  sleepDisorderHeadline: string
  sleepDisorderDetail: string
  suggestGpReview: boolean
  suggestTipTraq: boolean
  gpSummaryBullets: string[]
  wakeLabel: string
  sleepOnsetLabel: string
  generatedAt: string
}

/** Medicines often involved in sleep disruption / prescribing cascades (SMR-relevant). */
const SLEEP_CASCADE_CODES = new Set([
  'zopiclone',
  'zolpidem',
  'temazepam',
  'diazepam',
  'lorazepam',
  'mirtazapine',
  'amitriptyline',
  'pregabalin',
  'gabapentin',
  'codeine',
  'tramadol',
  'morphine',
  'oxycodone',
  'sertraline',
  'citalopram',
  'fluoxetine',
  'ramipril',
  'amlodipine',
  'atorvastatin',
])

const PROXY_NIGHTS = 7

function polypharmacyTier(count: number): LandingRiskAnalysis['polypharmacyTier'] {
  if (count >= 10) return 'hyperpolypharmacy'
  if (count >= 5) return 'polypharmacy'
  return 'standard'
}

function syntheticSleepLogs(wakeLabel: string, sleepOnsetLabel: string, nights: number) {
  const wakeM = timeToMinutes(wakeLabel)
  const sleepM = timeToMinutes(sleepOnsetLabel)
  const logs: { sleepOnset: string; wake: string }[] = []

  for (let nightsAgo = 0; nightsAgo < nights; nightsAgo++) {
    const wakeDt = new Date()
    wakeDt.setHours(0, 0, 0, 0)
    wakeDt.setDate(wakeDt.getDate() - nightsAgo)
    wakeDt.setHours(Math.floor(wakeM / 60), wakeM % 60, 0, 0)

    const sleepDt = new Date(wakeDt)
    if (sleepM >= wakeM) {
      sleepDt.setDate(sleepDt.getDate() - 1)
    }
    sleepDt.setHours(Math.floor(sleepM / 60), sleepM % 60, 0, 0)

    logs.push({
      sleepOnset: sleepDt.toISOString(),
      wake: wakeDt.toISOString(),
    })
  }

  return logs
}

function computeSriProxy(
  wake: string | null,
  medTimes: string[],
  medCodes: string[],
  fallbackScore: number
): number {
  const bodyClock = inferLandingBodyClock(wake, medTimes)
  const logs = syntheticSleepLogs(bodyClock.wakeLabel, bodyClock.sleepOnsetLabel, PROXY_NIGHTS)
  const engine = new DeepdoseLocalEngine()
  let base = engine.calculateWindowSRI(sleepBlocksFromLogs(logs), PROXY_NIGHTS)

  if (base == null) {
    base = fallbackScore
  }

  const meds = resolvePolyPlanMeds(medCodes)
  let penalty = 0
  for (const med of meds) {
    const sync = syncStateForRisk(med.meta.risk)
    if (sync === 'conflict') penalty += 12
    else if (sync === 'review') penalty += 6
  }

  const count = medCodes.length
  if (count >= 10) penalty += 14
  else if (count >= 5) penalty += 8

  const cascadeHits = medCodes.filter((c) => SLEEP_CASCADE_CODES.has(c.toLowerCase())).length
  penalty += Math.min(cascadeHits * 4, 16)

  return Math.round(Math.max(28, Math.min(99, base - penalty)))
}

function deriveSleepDisorderRisk(input: {
  sriProxy: number
  timingConflictCount: number
  highRiskTimingCount: number
  medCount: number
  sleepCascadeMedCount: number
}): Pick<
  LandingRiskAnalysis,
  'sleepDisorderRisk' | 'sleepDisorderHeadline' | 'sleepDisorderDetail' | 'suggestGpReview' | 'suggestTipTraq'
> {
  const tone = sriTone(input.sriProxy)
  const elevated =
    tone === 'critical' ||
    input.highRiskTimingCount >= 2 ||
    input.medCount >= 10 ||
    (input.timingConflictCount >= 2 && input.sriProxy < 55)

  const watch =
    !elevated &&
    (tone === 'warning' ||
      input.timingConflictCount >= 1 ||
      input.highRiskTimingCount >= 1 ||
      input.medCount >= 5 ||
      input.sleepCascadeMedCount >= 2)

  const sleepDisorderRisk: SleepDisorderRiskLevel = elevated ? 'elevated' : watch ? 'watch' : 'low'

  const sleepDisorderHeadline =
    sleepDisorderRisk === 'elevated'
      ? 'Sleep disorder risk. Discuss with your GP'
      : sleepDisorderRisk === 'watch'
        ? 'Sleep rhythm may need a GP review'
        : 'No urgent sleep disorder flags from this check'

  const sleepDisorderDetail =
    sleepDisorderRisk === 'elevated'
      ? 'UK Biobank linked low SRI to higher disease risk and earlier death. Mistimed meds can make nights worse. Share this with your GP. A home sleep test can confirm the picture.'
      : sleepDisorderRisk === 'watch'
        ? 'Your SRI and medicine timings suggest sleep may be under strain. Raise SRI with the six-dose protocol, and share this summary with your GP if nights stay broken.'
        : 'Hold a regular sleep–wake pattern and your six daily doses. Re-check SRI if your medicines change or sleep worsens.'

  return {
    sleepDisorderRisk,
    sleepDisorderHeadline,
    sleepDisorderDetail,
    suggestGpReview: sleepDisorderRisk !== 'low',
    suggestTipTraq: sleepDisorderRisk !== 'low',
  }
}

function buildGpSummaryBullets(analysis: Omit<LandingRiskAnalysis, 'gpSummaryBullets' | 'generatedAt'>): string[] {
  const bullets: string[] = [
    `Sleep Regularity Index (proxy): ${analysis.sriProxy}/100, estimated from wake time and medicine schedule (no wearable data yet).`,
    `Medicines on file: ${analysis.medCount}${
      analysis.polypharmacyTier === 'hyperpolypharmacy'
        ? ' (hyperpolypharmacy, SMR-eligible cohort)'
        : analysis.polypharmacyTier === 'polypharmacy'
          ? ' (polypharmacy; consider structured medication review)'
          : ''
    }.`,
    `Target sleep ${analysis.sleepOnsetLabel} → wake ${analysis.wakeLabel}.`,
  ]

  if (analysis.timingConflictCount > 0) {
    bullets.push(
      `${analysis.timingConflictCount} medicine${
        analysis.timingConflictCount === 1 ? '' : 's'
      } may be taken at the wrong time of day for circadian safety.`
    )
  }

  if (analysis.sleepCascadeMedCount > 0) {
    bullets.push(
      `${analysis.sleepCascadeMedCount} medicine${
        analysis.sleepCascadeMedCount === 1 ? '' : 's'
      } in classes commonly linked to sleep disruption or cascades.`
    )
  }

  if (analysis.suggestTipTraq) {
    bullets.push(
      'Patient may benefit from GP-advised 3-night TipTraQ home sleep test to confirm breathing and sleep-staging risk before deprescribing decisions.'
    )
  }

  bullets.push(
    'This is decision support only, not a diagnosis. Shared decision-making and SMR documentation remain with the GP.'
  )

  return bullets
}

export function buildLandingRiskAnalysis(input: LandingRiskInput): LandingRiskAnalysis {
  const medTimes = input.medTimes ?? []
  const wakeClock = input.wake?.slice(0, 5) ?? '07:30'
  const bodyClock = inferLandingBodyClock(input.wake, medTimes)
  const melatoninProfile = buildPatientMelatoninProfile(wakeClock, input.medCodes, medTimes)
  const fallbackScore = bodyClockScoreFromProfile(melatoninProfile)
  const sriProxy = computeSriProxy(input.wake, medTimes, input.medCodes, fallbackScore)

  const meds = resolvePolyPlanMeds(input.medCodes)
  let timingConflictCount = 0
  let highRiskTimingCount = 0
  for (const med of meds) {
    const sync = syncStateForRisk(med.meta.risk)
    if (sync === 'conflict') {
      timingConflictCount++
      highRiskTimingCount++
    } else if (sync === 'review') {
      timingConflictCount++
    }
  }

  const sleepCascadeMedCount = input.medCodes.filter((c) =>
    SLEEP_CASCADE_CODES.has(c.toLowerCase())
  ).length

  const medCount = input.medCodes.length
  const riskFields = deriveSleepDisorderRisk({
    sriProxy,
    timingConflictCount,
    highRiskTimingCount,
    medCount,
    sleepCascadeMedCount,
  })

  const partial = {
    sriProxy,
    sriTone: sriTone(sriProxy),
    medCount,
    polypharmacyTier: polypharmacyTier(medCount),
    timingConflictCount,
    highRiskTimingCount,
    sleepCascadeMedCount,
    wakeLabel: bodyClock.wakeLabel,
    sleepOnsetLabel: bodyClock.sleepOnsetLabel,
    ...riskFields,
  }

  return {
    ...partial,
    gpSummaryBullets: buildGpSummaryBullets(partial),
    generatedAt: new Date().toISOString(),
  }
}
