import {
  computeSunZenithData,
  vitaminD3InTargetRange,
  vitaminD3MicroDoseAdjustmentIu,
} from '@/src/lib/engine/sun-zenith'
import type {
  DailyIntervention,
  DiosUserState,
  InterventionTask,
  SunZenithData,
} from '@/src/lib/engine/types'

const PANDA_TRE_DELAYED_HOURS = 10
const PANDA_TRE_DEFAULT_HOURS = 12
const REM_EFFICIENCY_LOW_PCT = 70
const MICRO_AROUSAL_HIGH = 10

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

function formatMinutesAsTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function addMinutes(time: string, deltaMinutes: number): string {
  const base = parseTimeToMinutes(time)
  if (base == null) return time
  return formatMinutesAsTime(base + deltaMinutes)
}

function resolveTreHours(chronotype: DiosUserState['chronotype']): number {
  return chronotype === 'delayed' ? PANDA_TRE_DELAYED_HOURS : PANDA_TRE_DEFAULT_HOURS
}

function detectAcetylcholineShortage(userState: DiosUserState): boolean {
  const tip = userState.tipTraq
  if (!tip) return false

  const remLow =
    tip.remSleepEfficiencyPercent != null &&
    tip.remSleepEfficiencyPercent < REM_EFFICIENCY_LOW_PCT
  const arousalsHigh =
    tip.microArousalsCount != null && tip.microArousalsCount >= MICRO_AROUSAL_HIGH

  return remLow && arousalsHigh && userState.eveningLightDisciplineOptimal
}

export function generateDailyIntervention(
  userState: DiosUserState,
  localSunData: SunZenithData,
  now = new Date()
): DailyIntervention {
  const treWindowHours = resolveTreHours(userState.chronotype)
  const firstMealTime = userState.firstMealTime
  const treCloseTime = addMinutes(firstMealTime, treWindowHours * 60)
  const acetylcholineShortageFlag = detectAcetylcholineShortage(userState)

  const tasks: InterventionTask[] = []
  const clinicalFlags: string[] = []

  tasks.push({
    id: 'tre-open',
    timeLabel: firstMealTime,
    pillar: 'photic',
    title: 'TRE window opens',
    directive: `First bite at ${firstMealTime}. ${treWindowHours}-hour Time-Restricted Eating window — peripheral liver clocks align to Panda protocol.`,
    priority: 'required',
  })

  tasks.push({
    id: 'b-complex-sync',
    timeLabel: firstMealTime,
    pillar: 'fuel',
    title: 'B-Complex with first bite',
    directive:
      'Take morning Vitamin B-Complex / B5 exactly with your first calorie — not before, not after the meal. Off-window B vitamins disrupt peripheral clock alignment.',
    priority: 'required',
  })

  const morningPhoticMinutes = userState.morningMluxTargetDurationMinutes
  tasks.push({
    id: 'photic-anchor',
    timeLabel: addMinutes(firstMealTime, -30),
    pillar: 'photic',
    title: 'Morning photic anchor',
    directive: `480nm melanopic exposure target: ${morningPhoticMinutes} minutes before first bite. Anchor SCN before peripheral TRE clocks fire.`,
    priority: 'required',
  })

  let photicVsD3Mode: DailyIntervention['photicVsD3Mode'] = 'solar_walk'

  if (localSunData.uvbAvailable) {
    tasks.push({
      id: 'solar-zenith-walk',
      timeLabel: 'Solar zenith',
      pillar: 'photic',
      title: 'Solar zenith walk',
      directive:
        'Step outside for 15 minutes. Solar zenith allows simultaneous melanopsin clock reset and natural cutaneous Vitamin D3 production.',
      priority: 'required',
    })
  } else {
    photicVsD3Mode = 'supplement_adjust'
    const d3Nmol = userState.vitaminD3NmolL
    if (!vitaminD3InTargetRange(d3Nmol)) {
      const iu = vitaminD3MicroDoseAdjustmentIu(d3Nmol)
      tasks.push({
        id: 'd3-compensate',
        timeLabel: firstMealTime,
        pillar: 'fuel',
        title: 'D3 micro-dose adjustment',
        directive:
          iu > 0
            ? `UVB unavailable at current solar zenith (${localSunData.solarZenithDegrees}° proxy). Liquid Vitamin D3: ${iu} IU today to compensate absent cutaneous synthesis. Target 60–80 ng/mL (150–200 nmol/L).`
            : 'Vitamin D3 above target band — hold supplemental D3; maintain photic timing only.',
        priority: 'adjustment',
      })
      if (d3Nmol != null && d3Nmol < 150) {
        clinicalFlags.push('Vitamin D3 below Gominak band — quarterly lab refresh recommended')
      }
    } else {
      tasks.push({
        id: 'd3-maintain',
        timeLabel: firstMealTime,
        pillar: 'fuel',
        title: 'D3 in band',
        directive:
          'No UVB at zenith today; serum D3 within target — maintain titrated dose. Recheck at next quarterly panel.',
        priority: 'verify',
      })
    }
  }

  const blueLightCutoff = addMinutes(treCloseTime, -150)
  tasks.push({
    id: 'evening-melatonin-guard',
    timeLabel: blueLightCutoff,
    pillar: 'photic',
    title: 'Blue-light cutoff',
    directive:
      'Drop 480nm exposure to zero within 2–3 hours of bed. Sleep drive must peak before REM assembly.',
    priority: 'required',
  })

  if (acetylcholineShortageFlag) {
    clinicalFlags.push('Acetylcholine Shortage')
    tasks.push({
      id: 'acetylcholine-trap',
      timeLabel: 'Overnight',
      pillar: 'telemetry',
      title: 'Acetylcholine bottleneck',
      directive:
        'TipTraQ: low REM efficiency with high micro-arousals despite evening light discipline. Verify B5 compliance tonight; request blood lab update if D3 remains outside 60–80 ng/mL band.',
      priority: 'adjustment',
    })
  } else if (userState.tipTraq) {
    tasks.push({
      id: 'tiptraq-verify',
      timeLabel: 'Morning review',
      pillar: 'telemetry',
      title: 'TipTraQ verification',
      directive:
        'Overnight stream within tolerance — maintain current B5 titration and photic sequence.',
      priority: 'verify',
    })
  }

  tasks.sort((a, b) => {
    const am = parseTimeToMinutes(a.timeLabel) ?? 9999
    const bm = parseTimeToMinutes(b.timeLabel) ?? 9999
    return am - bm
  })

  return {
    generatedAt: now.toISOString(),
    treWindowHours,
    firstMealTime,
    firstBiteBComplexSync: true,
    acetylcholineShortageFlag,
    photicVsD3Mode,
    tasks,
    clinicalFlags,
  }
}

export type BuildDiosUserStateInput = {
  tier: DiosUserState['tier']
  chronotypeLabel: string
  chronotypeWakeTime: string | null
  vitaminD3NmolL: number | null
  vitaminB5UmolL: number | null
  remSleepEfficiencyPercent: number | null
  microArousalsCount: number | null
  eveningLightDisciplineOptimal: boolean
  morningMluxTargetDurationMinutes: number
}

export function resolveChronotypePhase(label: string): DiosUserState['chronotype'] {
  const normalized = label.toLowerCase()
  if (normalized.includes('night') || normalized.includes('owl') || normalized.includes('evening')) {
    return 'delayed'
  }
  if (normalized.includes('early') || normalized.includes('morning') || normalized.includes('bird')) {
    return 'advanced'
  }
  return 'intermediate'
}

export function estimateFirstMealTime(wakeTime: string | null, chronotype: DiosUserState['chronotype']): string {
  if (wakeTime && parseTimeToMinutes(wakeTime) != null) {
    return addMinutes(wakeTime, 60)
  }
  if (chronotype === 'delayed') return '10:00'
  if (chronotype === 'advanced') return '07:30'
  return '08:30'
}

export function buildDiosUserState(input: BuildDiosUserStateInput): DiosUserState {
  const chronotype = resolveChronotypePhase(input.chronotypeLabel)
  const firstMealTime = estimateFirstMealTime(input.chronotypeWakeTime, chronotype)

  const hasTipTraq =
    input.remSleepEfficiencyPercent != null || input.microArousalsCount != null

  return {
    tier: input.tier,
    chronotype,
    firstMealTime,
    vitaminD3NmolL: input.vitaminD3NmolL,
    vitaminB5UmolL: input.vitaminB5UmolL,
    tipTraq: hasTipTraq
      ? {
          remSleepEfficiencyPercent: input.remSleepEfficiencyPercent,
          microArousalsCount: input.microArousalsCount,
        }
      : null,
    eveningLightDisciplineOptimal: input.eveningLightDisciplineOptimal,
    morningMluxTargetDurationMinutes: input.morningMluxTargetDurationMinutes,
  }
}

export function buildDailyInterventionForPatient(
  input: BuildDiosUserStateInput & {
    locationCity: string | null
    locationCountry: string | null
  },
  when = new Date()
): DailyIntervention {
  const userState = buildDiosUserState(input)
  const sunData = computeSunZenithData(input.locationCity, input.locationCountry, when)
  return generateDailyIntervention(userState, sunData, when)
}
