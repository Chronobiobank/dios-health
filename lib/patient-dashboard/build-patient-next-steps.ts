import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { isElevatedSeverity } from '@/lib/patient-dashboard/dashboard-indicators'
import {
  RIGHT_SLEEP_D3_TARGET,
  RIGHT_SLEEP_PROTOCOL_LABEL,
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
  const apnoea = apnoeaNode(input.spectrumNodes)
  const nights = input.tipTraqNightsCount
  const curfew = rightSleepLightCurfew(input.dlmoEstimate)

  if (nights >= 5 && apnoea && isElevatedSeverity(apnoea.severity)) {
    return `${RIGHT_SLEEP_PROTOCOL_LABEL}: your TipTraQ block shows sleep apnoea and clock slip — keep tonight's curfew (${curfew}), add GP review, and finish the Gominak baseline panel.`
  }

  if (!input.bloodPanel.collectedAt) {
    return `${RIGHT_SLEEP_PROTOCOL_LABEL} starts with baseline bloods (D3 target ${RIGHT_SLEEP_D3_TARGET}) — then titrate D and B vitamins while you hold evening light curfew and your DLMO sleep window.`
  }

  if (input.bloodPanel.vitaminDLabel === 'Too low' || input.bloodPanel.vdrFlagUnresolved) {
    return `${RIGHT_SLEEP_PROTOCOL_LABEL}: bring vitamin D into ${RIGHT_SLEEP_D3_TARGET} with retested labs, then continue the B-vitamin phase while protecting sleep at ${input.dlmoEstimate}.`
  }

  if (input.hasTipTraq && input.clockDrift >= 30) {
    return `${RIGHT_SLEEP_PROTOCOL_LABEL}: dim by ${curfew} and aim for sleep near ${input.dlmoEstimate} — you are averaging +${input.clockDrift}m late, which blocks D absorption and deep sleep.`
  }

  if (!input.hasTipTraq) {
    return `Connect TipTraQ and phone streams, then run ${RIGHT_SLEEP_PROTOCOL_LABEL} — sleep grading plus Gominak bloods unlock your dose and timing plan.`
  }

  return `${RIGHT_SLEEP_PROTOCOL_LABEL} on track — hold ${RIGHT_SLEEP_D3_TARGET}, zeitgebers, and retest schedule; about ${input.recoveryYears} chronopathic years may recover in 90 days with consistent nights.`
}

export function buildPatientNextSteps(input: BuildPatientNextStepsInput): PatientNextStep[] {
  const steps: PatientNextStep[] = []
  const apnoea = apnoeaNode(input.spectrumNodes)
  const curfew = rightSleepLightCurfew(input.dlmoEstimate)
  const morningLight = rightSleepMorningLight(input.dlmoEstimate)

  if (!input.bloodPanel.collectedAt) {
    steps.push({
      id: 'right-sleep-bloods',
      priority: 'this-week',
      title: 'RightSleep: Gominak baseline bloods',
      detail: rightSleepBaselineBloodsDetail(),
      href: PATIENT_ROUTES.streamsBloods,
    })
  } else if (input.bloodPanel.vitaminDLabel === 'Too low') {
    steps.push({
      id: 'right-sleep-d3',
      priority: 'this-week',
      title: 'RightSleep: titrate vitamin D to target',
      detail: rightSleepD3CorrectionDetail(input.bloodPanel.vitaminDValue),
      href: PATIENT_ROUTES.streamsBloods,
      prompt: 'How do I titrate vitamin D safely on the Gominak RightSleep protocol?',
    })
  } else if (input.bloodPanel.vdrFlagUnresolved) {
    steps.push({
      id: 'right-sleep-b-vitamins',
      priority: 'this-week',
      title: 'RightSleep: B-vitamin phase',
      detail: rightSleepBVitaminsDetail(),
      prompt: 'What B-vitamin phase should I be on in RightSleep?',
    })
  }

  if (input.clockDrift >= 30) {
    steps.push({
      id: 'right-sleep-curfew',
      priority: 'tonight',
      title: 'RightSleep: evening light curfew',
      detail: `Dim screens and room lights by ${curfew} (about 90 minutes before your DLMO window at ${input.dlmoEstimate}). Late light keeps D and melatonin out of phase.`,
      prompt: 'How does evening light affect my RightSleep vitamin D plan?',
    })
    steps.push({
      id: 'right-sleep-sleep-window',
      priority: 'tonight',
      title: 'RightSleep: hit your sleep window',
      detail: `Aim to be in bed near ${input.dlmoEstimate}. TipTraQ shows +${input.clockDrift}m average slip — grade tonight's sleep in your workbook.`,
      prompt: 'How can I align sleep onset with my DLMO on RightSleep?',
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
      detail: `RightSleep improves sleep depth once breathing is addressed — bring TipTraQ (${band} OSA on your spectrum).`,
      prompt: 'What did my latest TipTraQ night show about my breathing?',
    })
  }

  if (!input.hasTipTraq) {
    steps.push({
      id: 'tiptraq-upload',
      priority: 'this-week',
      title: 'RightSleep: upload TipTraQ nights',
      detail: 'At least five nights give sleep grading, breathing flags, and clock drift for your D dose and curfew timing.',
      href: PATIENT_ROUTES.streams,
    })
  }

  if (
    steps.length < MAX_STEPS &&
    (input.clockDrift >= 30 || input.bloodPanel.collectedAt) &&
    !steps.some((s) => s.id === 'right-sleep-morning-light')
  ) {
    const rhythm = input.spectrumNodes.find((n) => n.id === 'sleep-rhythm')
    if (!rhythm || isElevatedSeverity(rhythm.severity) || input.clockDrift >= 30) {
      steps.push({
        id: 'right-sleep-morning-light',
        priority: 'this-week',
        title: 'RightSleep: morning light anchor',
        detail: `Get outdoor light before ${morningLight}. Morning zeitgeber sets melatonin timing for the next night.`,
        prompt: 'Why is morning light part of Gominak RightSleep?',
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
      title: 'RightSleep: keep D in range',
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
      title: 'Complete RightSleep data streams',
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
