import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { isElevatedSeverity } from '@/lib/patient-dashboard/dashboard-indicators'
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
    return 'Take your evening doses in the Medication timing window below.'
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

  if (nights >= 5 && apnoea && isElevatedSeverity(apnoea.severity)) {
    return `Your five TipTraQ nights show ${apnoea.severity === 'moderate' || apnoea.severity === 'severe' ? '' : 'mild '}sleep apnoea and clock slip — bloods and your GP are this week's priority.`
  }

  if (input.hasTipTraq && input.clockDrift >= 30) {
    return `Sleep is running about ${input.clockDrift} minutes late versus your body-clock target — tighten evenings and close data gaps to sharpen your plan.`
  }

  if (!input.bloodPanel.collectedAt) {
    return 'TipTraQ is in — add your Gominak blood panel next so immune and age scores stop running on estimates.'
  }

  if (!input.hasTipTraq) {
    return 'Connect TipTraQ and your phone stream first, then add bloods — each layer tightens medication timing.'
  }

  return `You could recover about ${input.recoveryYears} years in 90 days by holding rhythm, treating flagged risks, and keeping data complete.`
}

export function buildPatientNextSteps(input: BuildPatientNextStepsInput): PatientNextStep[] {
  const steps: PatientNextStep[] = []
  const apnoea = apnoeaNode(input.spectrumNodes)

  if (input.medicationsDueTonight > 0) {
    steps.push({
      id: 'meds-tonight',
      priority: 'tonight',
      title: 'Take tonight\'s meds on schedule',
      detail: tonightMedDetail(input.medications),
    })
  }

  if (input.clockDrift >= 30) {
    steps.push({
      id: 'wind-down',
      priority: 'tonight',
      title: 'Protect your DLMO window',
      detail: `Aim to wind down before ${input.dlmoEstimate}. You are averaging +${input.clockDrift}m past target — dim screens from ~22:00.`,
      prompt: 'How can I reduce my Dark Years and recover my clock tonight?',
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
      title: 'Talk to your GP about sleep apnoea',
      detail: `Bring your TipTraQ summary — ${band} overnight breathing is flagged on the spectrum.`,
      prompt: 'What did my latest TipTraQ night show about my Dark Years?',
    })
  }

  if (!input.bloodPanel.collectedAt) {
    steps.push({
      id: 'bloods',
      priority: 'this-week',
      title: 'Add your Gominak blood panel',
      detail: 'Vitamin D, VDR, and iron unlock immune precision and sharpen Chronosomatic Age.',
      href: PATIENT_ROUTES.streamsBloods,
    })
  }

  if (!input.hasTipTraq) {
    steps.push({
      id: 'tiptraq-upload',
      priority: 'this-week',
      title: 'Upload your TipTraQ nights',
      detail: 'At least five nights let us score breathing, rhythm, and clock drift together.',
      href: PATIENT_ROUTES.streams,
    })
  } else if (input.completenessGaps >= 2 && input.bloodPanel.collectedAt) {
    steps.push({
      id: 'completeness',
      priority: 'this-week',
      title: 'Close remaining data gaps',
      detail: 'Open Data completeness on your dashboard — connect anything still marked missing.',
      prompt: 'Which gaps should I fix first to reduce my Dark Years?',
    })
  }

  if (steps.length < MAX_STEPS) {
    const rhythm = input.spectrumNodes.find((n) => n.id === 'sleep-rhythm')
    if (
      rhythm &&
      isElevatedSeverity(rhythm.severity) &&
      input.clockDrift >= 30 &&
      !steps.some((s) => s.id === 'morning-light')
    ) {
      steps.push({
        id: 'morning-light',
        priority: 'this-week',
        title: 'Hold morning light and wake time',
        detail: rhythm.action,
        prompt: 'Why my clock drifts ↗',
      })
    }
  }

  if (
    steps.length < MAX_STEPS &&
    input.completenessGaps > 0 &&
    !steps.some((s) => s.id === 'bloods' || s.id === 'tiptraq-upload' || s.id === 'completeness')
  ) {
    steps.push({
      id: 'streams',
      priority: 'this-week',
      title: 'Review your data streams',
      detail: `${input.completenessGaps} gap${input.completenessGaps === 1 ? '' : 's'} still reduce Dark Years and medication timing precision.`,
      href: PATIENT_ROUTES.streams,
    })
  }

  return steps.slice(0, MAX_STEPS)
}

export function buildPatientNextStepsBlock(input: BuildPatientNextStepsInput): PatientNextSteps {
  return {
    summary: buildNextStepsSummary(input),
    steps: buildPatientNextSteps(input),
  }
}
