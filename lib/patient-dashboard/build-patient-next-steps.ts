import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'
import { isElevatedSeverity } from '@/lib/patient-dashboard/dashboard-indicators'
import {
  RIGHT_SLEEP_D3_TARGET,
  rightSleepBaselineBloodsDetail,
  rightSleepBVitaminsDetail,
  rightSleepD3CorrectionDetail,
  rightSleepLightCurfew,
  rightSleepMorningLight,
} from '@/lib/patient-dashboard/gominak-right-sleep'
import type {
  BloodPanel,
  Medication,
  PatientNextStep,
  PatientNextSteps,
  PatientSnapshot,
  SpectrumNode,
} from '@/lib/patient-dashboard/types'

export type BuildPatientNextStepsInput = {
  medicationsDueTonight: number
  medications: Medication[]
  clockDrift: number
  dlmoEstimate: string
  bloodPanel: BloodPanel
  completenessGaps: number
  spectrumNodes: SpectrumNode[]
  tipTraqNightsCount: number
  hasTipTraq: boolean
  recoveryYears: number
  feedFreshness?: FeedFreshness
  hasRetinomicScan?: boolean
  firstLightDailyStatus?: FirstLightDailyStatus | null
  /** True when entrainment window is open or past — skip before civil dawn */
  firstLightScanActionable?: boolean
}

const MAX_STEPS = 5

function tonightMedDetail(medications: Medication[]): string {
  const tonight = medications.filter((m) => m.status === 'tonight')
  if (tonight.length === 0) {
    return 'Take evening doses in the medication window below — timing still follows your DLMO anchor.'
  }
  const lines = tonight.map((m) => `${m.name} at ${m.time}`)
  return `Tonight: ${lines.join(' · ')}.`
}

function apnoeaNode(nodes: SpectrumNode[]): SpectrumNode | undefined {
  return nodes.find((n) => n.id === 'sleep-apnoea')
}

export function buildNextStepsSummary(input: BuildPatientNextStepsInput): string {
  const daily = input.firstLightDailyStatus
  const apnoea = apnoeaNode(input.spectrumNodes)
  const nights = input.tipTraqNightsCount
  const curfew = rightSleepLightCurfew(input.dlmoEstimate)

  if (daily?.completeToday && daily.riskStatus === 'amber') {
    const missed =
      daily.missedCheckpoints.length > 0
        ? daily.missedCheckpoints.join(', ')
        : 'one or more safety checkpoints'
    return `Morning scan recorded — finish ${missed} before tonight's dose windows. Your clinician sees amber triage until checkpoints clear.`
  }

  if (daily?.completeToday && input.medicationsDueTonight > 0) {
    const tonight = input.medications.filter((m) => m.status === 'tonight')
    const medLine =
      tonight.length > 0
        ? tonight.map((m) => `${m.name} at ${m.time}`).join(' · ')
        : 'evening doses in your script below'
    return `First Light anchored today — hold tonight's windows (${medLine}) and keep your eating window through close.`
  }

  if (daily?.completeToday) {
    return `Morning scan complete — dose windows updated from today's first-light anchor. Hold evening curfew (${curfew}) for tomorrow's scan.`
  }

  if (nights >= 5 && apnoea && isElevatedSeverity(apnoea.severity)) {
    return `Your TipTraQ block shows sleep apnoea and clock slip — keep tonight's curfew (${curfew}), add GP review, and finish your baseline blood panel.`
  }

  if (!input.bloodPanel.collectedAt) {
    return `Start with baseline bloods (D3 target ${RIGHT_SLEEP_D3_TARGET}) — then titrate D and B vitamins while you hold evening light curfew and your DLMO sleep window.`
  }

  if (input.bloodPanel.vitaminDLabel === 'Too low' || input.bloodPanel.vdrFlagUnresolved) {
    return `Bring vitamin D into ${RIGHT_SLEEP_D3_TARGET} with retested labs, then continue the B-vitamin phase while protecting sleep at ${input.dlmoEstimate}.`
  }

  if (input.hasTipTraq && input.clockDrift >= 30) {
    return `Dim by ${curfew} and aim for sleep near ${input.dlmoEstimate} — you are averaging +${input.clockDrift}m late, which blocks D absorption and deep sleep.`
  }

  if (!input.hasTipTraq) {
    return 'Connect TipTraQ and phone streams — sleep grading plus baseline bloods unlock your dose and timing plan.'
  }

  return `On track — hold ${RIGHT_SLEEP_D3_TARGET}, zeitgebers, and retest schedule; about ${input.recoveryYears} chronopathic years may recover in 90 days with consistent nights.`
}

export function buildPatientNextSteps(input: BuildPatientNextStepsInput): PatientNextStep[] {
  const steps: PatientNextStep[] = []
  const daily = input.firstLightDailyStatus
  const apnoea = apnoeaNode(input.spectrumNodes)
  const curfew = rightSleepLightCurfew(input.dlmoEstimate)
  const morningLight = rightSleepMorningLight(input.dlmoEstimate)

  if (!daily?.completeToday && input.firstLightScanActionable !== false) {
    steps.push({
      id: 'first-light-scan',
      priority: 'tonight',
      title: `Run ${FIRST_LIGHT_PROTOCOL.name} scan`,
      detail:
        'Your dose windows anchor at first light — complete the 60s morning scan before 9am for tonight\'s script timing.',
      href: PATIENT_ROUTES.firstLight,
    })
  } else if (daily?.completeToday && daily.riskStatus === 'amber') {
    steps.push({
      id: 'first-light-safety',
      priority: 'tonight',
      title: 'Complete safety checkpoints',
      detail:
        daily.missedCheckpoints.length > 0
          ? `Still open: ${daily.missedCheckpoints.join(' · ')}. Cohort stays amber until all three are confirmed.`
          : 'Confirm fluid intake, low-calcium diet, and activity before tonight\'s dose windows.',
      href: PATIENT_ROUTES.firstLight,
    })
  }

  if (input.feedFreshness === 'stale' || input.feedFreshness === 'none' || input.feedFreshness === 'aging') {
    steps.push({
      id: 'light-check-in',
      priority: 'tonight',
      title: 'Refresh your light ring',
      detail: input.hasRetinomicScan
        ? 'Your eye scan anchors the ceiling — a quick outdoor-light check-in updates today\'s melanopic dose on your snapshot.'
        : 'Run a quick outdoor-light check-in so today\'s light alignment stays honest on your snapshot.',
      prompt: 'How do I refresh my light dose from a check-in?',
    })
  }

  if (!input.bloodPanel.collectedAt) {
    steps.push({
      id: 'right-sleep-bloods',
      priority: 'this-week',
      title: 'Add baseline blood panel',
      detail: rightSleepBaselineBloodsDetail(),
      href: PATIENT_ROUTES.streamsBloods,
    })
  } else if (input.bloodPanel.vitaminDLabel === 'Too low') {
    steps.push({
      id: 'right-sleep-d3',
      priority: 'this-week',
      title: 'Titrate vitamin D to target',
      detail: rightSleepD3CorrectionDetail(input.bloodPanel.vitaminDValue),
      href: PATIENT_ROUTES.streamsBloods,
      prompt: 'How do I titrate vitamin D safely?',
    })
  } else if (input.bloodPanel.vdrFlagUnresolved) {
    steps.push({
      id: 'right-sleep-b-vitamins',
      priority: 'this-week',
      title: 'B-vitamin phase',
      detail: rightSleepBVitaminsDetail(),
      prompt: 'What B-vitamin phase should I be on?',
    })
  }

  if (input.clockDrift >= 30) {
    steps.push({
      id: 'right-sleep-curfew',
      priority: 'tonight',
      title: 'Evening light curfew',
      detail: `Dim screens and room lights by ${curfew} (about 90 minutes before your DLMO window at ${input.dlmoEstimate}). Late light keeps D and melatonin out of phase.`,
      prompt: 'How does evening light affect my vitamin D plan?',
    })
    steps.push({
      id: 'right-sleep-sleep-window',
      priority: 'tonight',
      title: 'Hit your sleep window',
      detail: `Aim to be in bed near ${input.dlmoEstimate}. TipTraQ shows +${input.clockDrift}m average slip — grade tonight's sleep in your workbook.`,
      prompt: 'How can I align sleep onset with my DLMO?',
    })
  }

  if (input.medicationsDueTonight > 0) {
    steps.push({
      id: 'meds-tonight',
      priority: 'tonight',
      title: 'Take tonight\'s meds on schedule',
      detail: tonightMedDetail(input.medications),
    })
  }

  if (apnoea && isElevatedSeverity(apnoea.severity)) {
    const band =
      apnoea.severity === 'severe' || apnoea.severity === 'moderate'
        ? 'raised'
        : 'mild'
    steps.push({
      id: 'gp-apnoea',
      priority: 'this-week',
      title: 'Discuss sleep apnoea with your GP',
      detail: `Sleep depth improves once breathing is addressed — bring TipTraQ (${band} OSA on your spectrum).`,
      prompt: 'What did my latest TipTraQ night show about my breathing?',
    })
  }

  if (!input.hasTipTraq) {
    steps.push({
      id: 'tiptraq-upload',
      priority: 'this-week',
      title: 'Upload TipTraQ nights',
      detail: 'At least five nights give sleep grading, breathing flags, and clock drift for your D dose and curfew timing.',
      href: PATIENT_ROUTES.streams,
    })
  }

  if (
    steps.length < MAX_STEPS &&
    !daily?.completeToday &&
    (input.clockDrift >= 30 || input.bloodPanel.collectedAt) &&
    !steps.some((s) => s.id === 'right-sleep-morning-light')
  ) {
    const rhythm = input.spectrumNodes.find((n) => n.id === 'sleep-rhythm')
    if (!rhythm || isElevatedSeverity(rhythm.severity) || input.clockDrift >= 30) {
      steps.push({
        id: 'right-sleep-morning-light',
        priority: 'this-week',
        title: 'Morning light anchor',
        detail: `Get outdoor light before ${morningLight}. Morning zeitgeber sets melatonin timing for the next night.`,
        prompt: 'Why is morning light important for sleep recovery?',
      })
    }
  }

  if (
    input.bloodPanel.collectedAt &&
    input.bloodPanel.vitaminDLabel === 'In range' &&
    !input.bloodPanel.vdrFlagUnresolved &&
    steps.length < MAX_STEPS &&
    !steps.some((s) => s.id === 'right-sleep-b-vitamins')
  ) {
    steps.push({
      id: 'right-sleep-retest',
      priority: 'this-week',
      title: 'Keep vitamin D in range',
      detail: `Retest vitamin D on the workbook schedule (every 4–12 weeks) and stay within ${RIGHT_SLEEP_D3_TARGET} through winter and summer dosing changes.`,
      href: PATIENT_ROUTES.streamsBloods,
    })
  }

  if (
    steps.length < MAX_STEPS &&
    input.completenessGaps > 0 &&
    !steps.some((s) => s.id === 'right-sleep-bloods' || s.id === 'tiptraq-upload')
  ) {
    steps.push({
      id: 'streams',
      priority: 'this-week',
      title: 'Complete data streams',
      detail: `${input.completenessGaps} gap${input.completenessGaps === 1 ? '' : 's'} still block calibrated D dosing and sleep grading.`,
      href: PATIENT_ROUTES.streams,
    })
  }

  const priorityOrder: Record<PatientNextStep['priority'], number> = {
    tonight: 0,
    'this-week': 1,
  }

  return steps
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, MAX_STEPS)
}

export function buildPatientNextStepsBlock(input: BuildPatientNextStepsInput): PatientNextSteps {
  return {
    summary: buildNextStepsSummary(input),
    steps: buildPatientNextSteps(input),
  }
}

/** Rebuild next steps when client-side First Light status differs from the server snapshot. */
export function nextStepsFromSnapshotContext(
  snapshot: PatientSnapshot,
  overrides: Partial<BuildPatientNextStepsInput> = {}
): PatientNextSteps {
  const tiptraq = snapshot.measureTiles.find((t) => t.id === 'tiptraq')
  const hasTipTraq = Boolean(tiptraq && tiptraq.badge !== 'Pending' && tiptraq.value !== '—')
  return buildPatientNextStepsBlock({
    medicationsDueTonight: snapshot.medicationsDueTonight,
    medications: snapshot.medications,
    clockDrift: snapshot.clockDrift,
    dlmoEstimate: snapshot.dlmoEstimate,
    bloodPanel: snapshot.bloodPanel,
    completenessGaps: snapshot.completenessGaps,
    spectrumNodes: snapshot.spectrumNodes,
    tipTraqNightsCount: hasTipTraq ? 5 : 0,
    hasTipTraq,
    recoveryYears: snapshot.recoveryYears,
    hasRetinomicScan: snapshot.retinomicBaseline != null,
    ...overrides,
  })
}
