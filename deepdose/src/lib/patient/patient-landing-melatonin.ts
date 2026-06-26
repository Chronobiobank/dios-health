import { getCatalogEntry } from '@/lib/medications/catalog'
import { timeToMinutes } from '@/lib/utils/time'

export type MedDotColor = 'red' | 'amber' | 'green'
export type MedRiskLevel = 'high' | 'medium' | 'low'

export type MedTimingAssessment = {
  code: string
  displayName: string
  takeTime: string
  optimalWindow: string
  timingDetail: string
  risk: MedRiskLevel
  riskLabel: 'High risk' | 'Minor shift' | 'Well timed'
  suppressionMin: number
  dotColor: MedDotColor
  dotHour: number
  interferenceTag?: string
  isMoodEnergy: boolean
}

export type MelatoninCurvePoint = { hour: number; level: number }

export type PatientMelatoninProfile = {
  baseDlmoLabel: string
  adjustedDlmoLabel: string
  suppressionDeltaMin: number
  curvePoints: MelatoninCurvePoint[]
  medDots: MedTimingAssessment[]
  interferenceTags: { label: string; tone: 'red' | 'amber' }[]
}

const SSRI_CODES = new Set([
  'sertraline',
  'citalopram',
  'fluoxetine',
  'escitalopram',
  'paroxetine',
  'venlafaxine',
  'duloxetine',
  'mirtazapine',
])

const STIMULANT_MPH = new Set(['methylphenidate', 'dexamfetamine'])
const STIMULANT_AMP = new Set(['lisdexamfetamine', 'lisdexamphetamine'])
const MOOD_ENERGY = new Set([
  ...SSRI_CODES,
  ...STIMULANT_MPH,
  ...STIMULANT_AMP,
  'atomoxetine',
  'modafinil',
  'bupropion',
])

function minutesToClock(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function clockToHour(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  return h + (m ?? 0) / 60
}

function medCategory(code: string): string {
  const key = code.toLowerCase()
  if (SSRI_CODES.has(key)) return 'ssri'
  if (STIMULANT_MPH.has(key)) return 'stimulant_mph'
  if (STIMULANT_AMP.has(key)) return 'stimulant_amp'
  if (key === 'atomoxetine') return 'atomoxetine'
  if (['ramipril', 'perindopril', 'lisinopril', 'enalapril'].includes(key)) return 'ace'
  if (key.includes('statin') || key === 'atorvastatin' || key === 'rosuvastatin') return 'statin'
  if (key === 'metformin') return 'metformin'
  if (key === 'amlodipine') return 'amlodipine'
  if (key === 'prednisolone') return 'prednisolone'
  if (key === 'levothyroxine') return 'levothyroxine'
  if (['bisoprolol', 'propranolol', 'atenolol'].includes(key)) return 'beta_blocker'
  return 'other'
}

function inWindow(takeMin: number, start: string, end: string): boolean {
  const s = timeToMinutes(start)
  const e = timeToMinutes(end)
  if (s <= e) return takeMin >= s && takeMin <= e
  return takeMin >= s || takeMin <= e
}

function assessMedication(code: string, takeTime: string): MedTimingAssessment {
  const displayName =
    getCatalogEntry(code)?.displayName ?? code.charAt(0).toUpperCase() + code.slice(1)
  const takeMin = timeToMinutes(takeTime.slice(0, 5))
  const category = medCategory(code)
  const isMoodEnergy = MOOD_ENERGY.has(code.toLowerCase())

  let risk: MedRiskLevel = 'low'
  let riskLabel: MedTimingAssessment['riskLabel'] = 'Well timed'
  let optimalWindow = 'Follow your GP plan'
  let suppressionMin = 0
  let dotColor: MedDotColor = 'green'
  let interferenceTag: string | undefined

  switch (category) {
    case 'ssri': {
      optimalWindow = '07:00–09:00'
      if (!inWindow(takeMin, '07:00', '09:00')) {
        risk = takeMin >= timeToMinutes('11:00') ? 'high' : 'medium'
        riskLabel = risk === 'high' ? 'High risk' : 'Minor shift'
        suppressionMin = takeMin >= timeToMinutes('12:00') ? -52 : -34
        dotColor = risk === 'high' ? 'red' : 'amber'
        interferenceTag = `${displayName.split(' ')[0]} delaying onset`
      }
      break
    }
    case 'stimulant_mph': {
      optimalWindow = '06:30–08:00'
      if (!inWindow(takeMin, '06:30', '08:00')) {
        risk = takeMin >= timeToMinutes('12:00') ? 'high' : 'medium'
        riskLabel = risk === 'high' ? 'High risk' : 'Minor shift'
        suppressionMin = takeMin >= timeToMinutes('12:00') ? -78 : -45
        dotColor = 'red'
        interferenceTag = `${displayName.includes('Ritalin') ? 'Ritalin' : displayName.split(' ')[0]} suppressing peak`
      }
      break
    }
    case 'stimulant_amp': {
      optimalWindow = '07:00'
      if (takeMin > timeToMinutes('09:00')) {
        risk = 'high'
        riskLabel = 'High risk'
        suppressionMin = -85
        dotColor = 'red'
        interferenceTag = `${displayName.split(' ')[0]} suppressing peak`
      } else if (takeMin > timeToMinutes('07:30')) {
        risk = 'medium'
        riskLabel = 'Minor shift'
        suppressionMin = -40
        dotColor = 'amber'
      }
      break
    }
    case 'atomoxetine': {
      optimalWindow = '07:00–08:00'
      if (takeMin > timeToMinutes('10:00')) {
        risk = 'high'
        riskLabel = 'High risk'
        suppressionMin = -55
        dotColor = 'red'
        interferenceTag = 'Atomoxetine delaying onset'
      }
      break
    }
    case 'ace': {
      optimalWindow = '21:00–22:00'
      if (!inWindow(takeMin, '20:30', '22:30')) {
        risk = takeMin < timeToMinutes('18:00') ? 'high' : 'medium'
        riskLabel = risk === 'high' ? 'High risk' : 'Minor shift'
        suppressionMin = risk === 'high' ? -28 : -14
        dotColor = risk === 'high' ? 'red' : 'amber'
        interferenceTag = `${displayName.split(' ')[0]} mistimed`
      }
      break
    }
    case 'statin': {
      optimalWindow = '20:00–21:00'
      if (takeMin < timeToMinutes('18:00')) {
        risk = 'medium'
        riskLabel = 'Minor shift'
        suppressionMin = -18
        dotColor = 'amber'
      }
      break
    }
    case 'metformin': {
      optimalWindow = 'With breakfast'
      if (takeMin > timeToMinutes('11:00')) {
        risk = 'medium'
        riskLabel = 'Minor shift'
        suppressionMin = -8
        dotColor = 'amber'
      }
      break
    }
    case 'amlodipine': {
      optimalWindow = 'Morning'
      if (takeMin >= timeToMinutes('18:00')) {
        risk = 'medium'
        riskLabel = 'Minor shift'
        suppressionMin = -12
        dotColor = 'amber'
      }
      break
    }
    case 'prednisolone': {
      optimalWindow = '07:00–08:00'
      if (!inWindow(takeMin, '07:00', '08:30')) {
        risk = 'high'
        riskLabel = 'High risk'
        suppressionMin = -48
        dotColor = 'red'
        interferenceTag = 'Prednisolone mistimed'
      }
      break
    }
    case 'beta_blocker': {
      optimalWindow = 'Morning or bedtime'
      if (inWindow(takeMin, '12:00', '17:00')) {
        risk = 'high'
        riskLabel = 'High risk'
        suppressionMin = -35
        dotColor = 'red'
      }
      break
    }
    default:
      break
  }

  const timingDetail = `Taken ${takeTime.slice(0, 5)} · optimal ${optimalWindow}`

  return {
    code,
    displayName,
    takeTime: takeTime.slice(0, 5),
    optimalWindow,
    timingDetail,
    risk,
    riskLabel,
    suppressionMin,
    dotColor,
    dotHour: clockToHour(takeTime),
    interferenceTag,
    isMoodEnergy,
  }
}

function melatoninLevelAtHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24
  if (h >= 6 && h < 18) return 0.08
  if (h >= 18 && h < 21) return 0.08 + ((h - 18) / 3) * 0.55
  if (h >= 21 || h < 2) return 0.88
  if (h >= 2 && h < 6) return 0.88 - ((h - 2) / 4) * 0.8
  return 0.1
}

function buildCurvePoints(): MelatoninCurvePoint[] {
  const points: MelatoninCurvePoint[] = []
  for (let h = 6; h <= 30; h += 0.5) {
    const hour = h >= 24 ? h - 24 : h
    points.push({ hour, level: melatoninLevelAtHour(hour) })
  }
  return points
}

export function buildPatientMelatoninProfile(
  wake: string,
  medCodes: string[],
  medTimes: string[]
): PatientMelatoninProfile {
  const wakeMin = timeToMinutes(wake.slice(0, 5))
  const baseDlmoMin = wakeMin + 15 * 60

  const medDots = medCodes.map((code, i) =>
    assessMedication(code, medTimes[i] ?? '08:00')
  )

  const totalSuppression = medDots.reduce((sum, m) => sum + m.suppressionMin, 0)
  const adjustedDlmoMin = baseDlmoMin - totalSuppression

  const interferenceTags = medDots
    .filter((m) => m.interferenceTag && m.risk !== 'low')
    .map((m) => ({
      label: m.interferenceTag!,
      tone: (m.dotColor === 'red' ? 'red' : 'amber') as 'red' | 'amber',
    }))

  return {
    baseDlmoLabel: minutesToClock(baseDlmoMin),
    adjustedDlmoLabel: minutesToClock(adjustedDlmoMin),
    suppressionDeltaMin: totalSuppression,
    curvePoints: buildCurvePoints(),
    medDots,
    interferenceTags,
  }
}

/** Map clock hour to x position on 6am→6am axis (0–1). */
export function hourToAxisPosition(hour: number): number {
  const fromSix = ((hour - 6 + 24) % 24) / 24
  return fromSix
}

export function clockLabelToHour(clock: string): number {
  return clockToHour(clock)
}

/** Body Clock Score /100 from proxy DLMO stack and medication suppression. */
export function bodyClockScoreFromProfile(profile: PatientMelatoninProfile): number {
  const highCount = profile.medDots.filter((m) => m.risk === 'high').length
  const mediumCount = profile.medDots.filter((m) => m.risk === 'medium').length
  const raw =
    100 +
    profile.suppressionDeltaMin * 0.3375 -
    highCount * 6.75 -
    mediumCount * 3
  return Math.round(Math.max(35, Math.min(99, raw)))
}

export function recommendedTakeTime(optimalWindow: string, wake: string): string {
  const match = optimalWindow.match(/(\d{1,2}:\d{2})/)
  if (match) return match[1]
  if (/morning|breakfast/i.test(optimalWindow)) return wake.slice(0, 5)
  return optimalWindow.split(/[–—-]/)[0]?.trim() || optimalWindow
}
