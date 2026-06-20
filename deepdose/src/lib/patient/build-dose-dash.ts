import { buildZeitgeberSchedule } from '@/lib/chronobiology/build-zeitgeber-schedule'
import { ZEITGEBER_DOMAINS } from '@/lib/chronobiology/zeitgebers'
import type { BtiPayload } from '@/lib/bti/types'
import { ahiStatus } from '@/lib/clinical/tiptraq/clinical-status'
import { computeTipTraqBlockMetrics } from '@/lib/clinical/tiptraq/metrics'
import type { TipTraqNightInput } from '@/lib/clinical/tiptraq/types'
import { MEDICATION_TIMINGS, type MedicationCode } from '@/lib/circadian/medications'
import type { DlmoProxyResult } from '@/lib/circadian/dlmo'
import { decimalHoursToHHMM } from '@/lib/utils/time'
import type {
  DlmoSource,
  DoseCluster,
  DoseDashModel,
  MetabolicRiskSignal,
  PatientNextStep,
  RiskSeverity,
} from '@/lib/patient/dose-dash-types'

const DOMAIN_COPY = Object.fromEntries(
  ZEITGEBER_DOMAINS.map((d) => [d.id, d.description])
) as Record<string, string>

function severityRank(s: RiskSeverity): number {
  if (s === 'action') return 3
  if (s === 'watch') return 2
  return 1
}

function worstTriage(risks: MetabolicRiskSignal[]): DoseDashModel['triageLabel'] {
  const max = Math.max(...risks.map((r) => severityRank(r.severity)), 1)
  if (max >= 3) return 'Review soon'
  if (max >= 2) return 'Needs attention'
  return 'On track'
}

function buildSleepApnoeaRisk(meanAhi: number | null, nights: number): MetabolicRiskSignal {
  if (nights === 0 || meanAhi == null) {
    return {
      id: 'sleep-apnoea',
      label: 'Sleep breathing',
      severity: 'watch',
      headline: 'Pending home sleep test',
      detail: 'Three nights on TipTraQ set this signal. Your GP orders the kit.',
    }
  }

  const status = ahiStatus(meanAhi)
  const severity: RiskSeverity =
    status === 'red' ? 'action' : status === 'amber' ? 'watch' : 'low'

  const headline =
    status === 'green'
      ? `AHI ${meanAhi} — within normal range`
      : status === 'amber'
        ? `AHI ${meanAhi} — mild sleep apnoea`
        : `AHI ${meanAhi} — moderate+ sleep apnoea`

  const detail =
    status === 'green'
      ? 'Breathing looks stable across your block. Dose timing can follow body-clock cues.'
      : status === 'amber'
        ? 'Mild apnoea can shift night recovery. Worth a GP conversation alongside dose timing.'
        : 'Untreated apnoea raises metabolic and cardiovascular risk. Prioritise GP review.'

  return { id: 'sleep-apnoea', label: 'Sleep breathing', severity, headline, detail }
}

function buildClockDriftRisk(
  driftMinutes: number | null,
  circadianScore: number,
  hasTipTraq: boolean
): MetabolicRiskSignal {
  const drift = driftMinutes ?? 0
  let severity: RiskSeverity = 'low'
  if (drift >= 45 || circadianScore < 45) severity = 'action'
  else if (drift >= 25 || circadianScore < 55) severity = 'watch'

  const headline = hasTipTraq
    ? drift > 0
      ? `+${drift}m late vs sleep target`
      : 'Sleep timing on target'
    : circadianScore > 0
      ? `Circadian score ${circadianScore}`
      : 'Clock baseline pending'

  const detail =
    severity === 'low'
      ? 'Evening light curfew and wake time are holding your rhythm.'
      : severity === 'watch'
        ? 'You are slipping past your DLMO anchor — tighten evening light and bedtime.'
        : 'Large drift blocks recovery and vitamin timing. Shift sleep earlier this week.'

  return { id: 'clock-drift', label: 'Body clock', severity, headline, detail }
}

function buildMetabolicRhythmRisk(
  sjlHours: number,
  circadianScore: number,
  metabolicAlert: boolean
): MetabolicRiskSignal {
  let severity: RiskSeverity = 'low'
  if (metabolicAlert || sjlHours >= 2 || circadianScore < 45) severity = 'action'
  else if (sjlHours >= 1 || circadianScore < 55) severity = 'watch'

  const headline =
    sjlHours >= 1
      ? `Social jet lag ~${sjlHours.toFixed(1)}h`
      : metabolicAlert
        ? 'Metabolic drift flagged'
        : 'Metabolic rhythm steady'

  const detail =
    severity === 'low'
      ? 'Weekday and weekend timing look aligned enough for stable dosing.'
      : severity === 'watch'
        ? 'Irregular sleep–wake timing nudges glucose and lipids off course over months.'
        : 'Strong misalignment correlates with metabolic syndrome risk — hold zeitgeber cues daily.'

  return { id: 'metabolic-rhythm', label: 'Metabolic rhythm', severity, headline, detail }
}

function lightCurfewFromDlmo(dlmoHours: number): string {
  const minutes = Math.round(dlmoHours * 60) - 90
  const normalized = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function buildNextSteps(input: {
  risks: MetabolicRiskSignal[]
  dlmoLabel: string
  dlmoHours: number
  clusters: DoseCluster[]
  hasMeds: boolean
  tiptraqComplete: boolean
}): PatientNextStep[] {
  const steps: PatientNextStep[] = []
  const curfew = lightCurfewFromDlmo(input.dlmoHours)
  const apnoea = input.risks.find((r) => r.id === 'sleep-apnoea')
  const drift = input.risks.find((r) => r.id === 'clock-drift')
  const metabolic = input.risks.find((r) => r.id === 'metabolic-rhythm')

  const openMed = input.clusters.find((c) => c.id === 'meds' && c.activeNow)
  if (openMed) {
    steps.push({
      id: 'med-window',
      title: 'Medicine window is open',
      detail: openMed.summary,
    })
  }

  if (apnoea?.severity !== 'low') {
    steps.push({
      id: 'gp-sleep',
      title: 'Book a GP sleep review',
      detail: apnoea?.detail ?? 'Discuss home sleep results with your doctor.',
    })
  }

  if (drift?.severity !== 'low') {
    steps.push({
      id: 'evening-curfew',
      title: `Dim lights by ${curfew}`,
      detail: `Aim to sleep near ${input.dlmoLabel}. ${drift?.headline ?? ''}`.trim(),
    })
  }

  if (!input.tiptraqComplete) {
    steps.push({
      id: 'tiptraq-kit',
      title: 'Complete your 3-night sleep block',
      detail: 'Your clinician adds nights from the TipTraQ kit — then dose cues sharpen.',
    })
  } else if (metabolic?.severity === 'low' && drift?.severity === 'low') {
    steps.push({
      id: 'hold-cues',
      title: 'Hold today\'s dose cues',
      detail: 'Tap each cluster below for timing. Confirm medicines when your window opens.',
    })
  }

  if (!input.hasMeds) {
    steps.push({
      id: 'add-meds',
      title: 'Add your medicines',
      detail: 'Personalised med windows appear once prescriptions are on file.',
    })
  }

  return steps.slice(0, 4)
}

function trimInstruction(text: string): string {
  const first = text.split('.')[0]
  return first.length < text.length ? `${first}.` : text
}

export function buildDoseDash(input: {
  dlmoEstimateHours: number
  circadianScore: number
  sjlHours: number
  metabolicAlertTriggered: boolean
  btiPayloads: BtiPayload[]
  tiptraqNights: TipTraqNightInput[]
  hasMeds: boolean
  msfScHours?: number | null
  dlmoProxy?: DlmoProxyResult | null
}): DoseDashModel {
  const metrics =
    input.tiptraqNights.length > 0
      ? computeTipTraqBlockMetrics(input.tiptraqNights)
      : null

  const driftMinutes = metrics?.clockDriftMinutes ?? null
  const meanAhi = metrics?.meanAhi ?? null
  const nights = input.tiptraqNights.length

  // Pick the best available DLMO source: clinical TipTraQ block > free-tier
  // smartphone/wearable proxy > chronotype-questionnaire fallback.
  const { dlmoHours, dlmoSource } = resolveDlmoSource(input, metrics, nights)
  const dlmoLabel = decimalHoursToHHMM(dlmoHours)

  const risks: MetabolicRiskSignal[] = [
    buildSleepApnoeaRisk(meanAhi, nights),
    buildClockDriftRisk(driftMinutes, input.circadianScore, nights > 0),
    buildMetabolicRhythmRisk(
      input.sjlHours,
      input.circadianScore,
      input.metabolicAlertTriggered
    ),
  ]

  const schedule = buildZeitgeberSchedule({
    dlmoEstimateHours: dlmoHours,
    msfScHours: input.msfScHours,
    btiPayloads: input.btiPayloads,
  })

  const clusters: DoseCluster[] = schedule.map((item) => ({
    id: item.id,
    label: item.label,
    timeLabel: item.timeLabel,
    activeNow: Boolean(item.activeNow),
    summary: trimInstruction(item.instruction),
    detail: `${DOMAIN_COPY[item.id]} ${item.instruction}`,
  }))

  const nextSteps = buildNextSteps({
    risks,
    dlmoLabel,
    dlmoHours,
    clusters,
    hasMeds: input.hasMeds,
    tiptraqComplete: metrics?.blockComplete ?? false,
  })

  return {
    dlmoLabel,
    dlmoSource,
    clockDriftMinutes: driftMinutes,
    tiptraqNights: nights,
    tiptraqComplete: metrics?.blockComplete ?? false,
    triageLabel: worstTriage(risks),
    risks,
    nextSteps,
    clusters,
  }
}

function parseDlmoHours(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  return h + m / 60
}

const CONFIDENCE_DISPLAY: Record<string, string> = {
  none: 'low',
  low: 'low',
  moderate: 'moderate',
  high: 'high',
}

function resolveDlmoSource(
  input: { dlmoEstimateHours: number; msfScHours?: number | null; dlmoProxy?: DlmoProxyResult | null },
  metrics: ReturnType<typeof computeTipTraqBlockMetrics> | null,
  nights: number
): { dlmoHours: number; dlmoSource: DlmoSource | null } {
  // 1. Clinical-grade TipTraQ block wins outright.
  if (metrics?.dlmoEstimate && nights > 0) {
    return {
      dlmoHours: parseDlmoHours(metrics.dlmoEstimate),
      dlmoSource: {
        label: 'TipTraQ clinical block',
        confidenceLabel: 'high',
        bandMinutes: null,
        detail: `Measured from ${nights} night${nights === 1 ? '' : 's'} of clinical-grade sleep data.`,
      },
    }
  }

  // 2. Free-tier smartphone / wearable proxy.
  const proxy = input.dlmoProxy
  if (proxy?.available && proxy.dlmoMinutes != null) {
    const hasWearable = proxy.nightsUsed > 0
    const hasQuestionnaire = proxy.sources.questionnaire != null
    const detail = hasWearable
      ? `Estimated from ${proxy.nightsUsed} night${proxy.nightsUsed === 1 ? '' : 's'} of phone & wearable sleep data${hasQuestionnaire ? ' and your chronotype answers' : ''}.`
      : 'Estimated from your chronotype answers until phone or wearable data syncs.'

    return {
      dlmoHours: proxy.dlmoMinutes / 60,
      dlmoSource: {
        label: hasWearable ? 'Phone & wearable estimate' : 'Chronotype estimate',
        confidenceLabel: CONFIDENCE_DISPLAY[proxy.confidenceLabel] ?? 'low',
        bandMinutes: proxy.confidenceBandMinutes,
        detail,
      },
    }
  }

  // 3. Chronotype-questionnaire fallback (legacy path).
  return {
    dlmoHours: input.dlmoEstimateHours,
    dlmoSource:
      input.msfScHours != null
        ? {
            label: 'Chronotype estimate',
            confidenceLabel: 'low',
            bandMinutes: 90,
            detail: 'Estimated from your chronotype answers. Connect a wearable to sharpen it.',
          }
        : null,
  }
}

export function medClusterDetail(
  btiPayloads: BtiPayload[]
): string | null {
  if (btiPayloads.length === 0) return null
  return btiPayloads
    .map((p) => {
      const code = p.medication_id as MedicationCode
      const name = MEDICATION_TIMINGS[code]?.displayName ?? p.medication_id
      const start = p.dosing_window_start.slice(11, 16)
      const end = p.dosing_window_end.slice(11, 16)
      return `${name}: ${start}–${end}`
    })
    .join(' · ')
}
