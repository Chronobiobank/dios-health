import { PRGC_THRESHOLDS } from '@/lib/clinic/prgc-monitoring'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'
import { INTELLIGENCE_CADENCES } from '@/lib/product/intelligence-cadence'

export const HOW_IT_WORKS_ENGINE = {
  eyebrow: 'Intelligence stack',
  headline: 'From signal to schedule.',
  lede: 'Four read frequencies feed one engine. Patients get timing guidance. Clinicians get a safety-gated queue.',
} as const

export const HOW_IT_WORKS_D3_TREE = {
  eyebrow: 'Coimbra safety gate',
  headline: 'D3 decisions in three gates.',
  lede: 'Every 90-day draw runs the same tree — calcium first, then iPTH, then morning-window adherence. Halt, bridge cofactors, or escalate only when bloods and sleep agree.',
  scenarioLabel: 'See a real mock patient path',
  prgcLink: { label: 'pRGC four-column readout', href: MARKETING_ROUTES.cliniciansTriagePrgc },
} as const

export type EngineFlowNode = {
  id: string
  step: string
  title: string
  detail: string
  outputs?: readonly string[]
}

/** Left-to-right pipeline — inputs through learning loop */
export const ENGINE_FLOW_NODES: readonly EngineFlowNode[] = [
  {
    id: 'inputs',
    step: '01',
    title: 'Biomarker inputs',
    detail: 'TipTraQ sleep, phone light scans, blood panel, and daily dose taps — each on its own cadence.',
    outputs: [
      INTELLIGENCE_CADENCES.tiptraq.label,
      INTELLIGENCE_CADENCES.mlux_camera.label,
      INTELLIGENCE_CADENCES.blood_panel.label,
      INTELLIGENCE_CADENCES.dose_adherence.label,
    ],
  },
  {
    id: 'mlux',
    step: '02',
    title: 'MLux body-clock estimate',
    detail: INTELLIGENCE_CADENCES.mlux_camera.description,
    outputs: INTELLIGENCE_CADENCES.mlux_camera.outputs,
  },
  {
    id: 'matrix',
    step: '03',
    title: 'Dose window matrix',
    detail:
      'TipTraQ calibration sets personalised windows. DINA maps each medicine to the open slot — conflicts resolved before the patient wakes.',
    outputs: ['personalised_dose_windows', 'conflict_resolution', 'adherence_pct'],
  },
  {
    id: 'outputs',
    step: '04',
    title: 'Dual output',
    detail:
      'Patients see DINA coaching and dashboard windows. Clinicians see cohort triage and pRGC readouts — same engine, two views.',
    outputs: ['patient_coach', 'clinician_triage', 'bti_payload'],
  },
  {
    id: 'loop',
    step: '05',
    title: 'Chronobiobank loop',
    detail:
      'De-identified timing telemetry feeds research — optional consent, revocable. Each patient-month sharpens population baselines.',
    outputs: ['anonymised_telemetry', 'governance_weight'],
  },
] as const

export type D3DecisionOutcome = 'halt' | 'bridge' | 'escalate' | 'hold'

export type D3DecisionGate = {
  id: string
  label: string
  question: string
  branches: readonly {
    id: string
    condition: string
    nextGateId?: string
    outcome?: D3DecisionOutcome
    action: string
  }[]
}

export const D3_DECISION_GATES: readonly D3DecisionGate[] = [
  {
    id: 'calcium',
    label: 'Gate 1',
    question: 'Serum calcium above lab range?',
    branches: [
      {
        id: 'calcium-yes',
        condition: `Yes — above reference`,
        outcome: 'halt',
        action: 'Halt D3 today. Hydrate. Clinician review before any restart.',
      },
      {
        id: 'calcium-no',
        condition: 'No — within range',
        nextGateId: 'pth',
        action: 'Proceed to iPTH gate.',
      },
    ],
  },
  {
    id: 'pth',
    label: 'Gate 2',
    question: 'iPTH position in reference range?',
    branches: [
      {
        id: 'pth-lower',
        condition: `Suppressed — below ${PRGC_THRESHOLDS.pthPgMl.suppressedBelow} pg/mL`,
        nextGateId: 'timing',
        action: 'VDR activation progressing — confirm timing adherence.',
      },
      {
        id: 'pth-middle-improving',
        condition: 'Middle third — trending down',
        nextGateId: 'timing',
        action: 'Trajectory improving — hold dose unless timing fails.',
      },
      {
        id: 'pth-middle-static',
        condition: 'Middle third — flat or rising',
        outcome: 'bridge',
        action: 'Bridge cofactors (B12, ferritin). Fix timing before escalating IU.',
      },
      {
        id: 'pth-upper',
        condition: 'Upper range — unsuppressed',
        nextGateId: 'timing',
        action: 'Calcium clear — timing gate decides escalate vs educate.',
      },
    ],
  },
  {
    id: 'timing',
    label: 'Gate 3',
    question: 'D3 taken in the morning window?',
    branches: [
      {
        id: 'timing-poor',
        condition: `Below ${PRGC_THRESHOLDS.d3TimingPct.poorBelow}% morning adherence`,
        outcome: 'bridge',
        action: 'DINA timing education — do not escalate D3 until window is fixed.',
      },
      {
        id: 'timing-good-suppressed',
        condition: `Above ${PRGC_THRESHOLDS.d3TimingPct.excellent}% and PTH suppressed`,
        outcome: 'hold',
        action: 'On track — hold protocol. Next 90-day draw confirms.',
      },
      {
        id: 'timing-good-improving',
        condition: `Above ${PRGC_THRESHOLDS.d3TimingPct.excellent}% and PTH trending down`,
        outcome: 'hold',
        action: 'Hold dose — trajectory is the insight before the next draw.',
      },
      {
        id: 'timing-good-high',
        condition: `Above ${PRGC_THRESHOLDS.d3TimingPct.excellent}% and PTH still high`,
        outcome: 'escalate',
        action: 'Escalate D3 per protocol — bloods and sleep architecture agree.',
      },
    ],
  },
] as const

export const D3_OUTCOME_LABELS: Record<D3DecisionOutcome, string> = {
  halt: 'Halt',
  bridge: 'Bridge',
  escalate: 'Escalate',
  hold: 'Hold',
}

export const D3_OUTCOME_ACTIONS: Record<D3DecisionOutcome, string> = {
  halt: 'Stop D3. Safety gate — calcium or clinician hold.',
  bridge: 'Fix timing or cofactors before changing dose.',
  escalate: 'Raise D3 IU when PTH, calcium, and sleep agree.',
  hold: 'Protocol working — maintain dose and windows.',
}

export type D3ScenarioId = 'sarah-mitchell' | 'sean-001' | 'ngozi-eze'

export type D3Scenario = {
  id: D3ScenarioId
  name: string
  recordId: string
  branchIds: readonly string[]
  outcome: D3DecisionOutcome
  summary: string
}

/** Paths through the tree — aligned with PRGC_MONITORING_PATIENTS */
export const D3_SCENARIOS: readonly D3Scenario[] = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    recordId: 'SM-014',
    branchIds: ['calcium-no', 'pth-upper', 'timing-poor'],
    outcome: 'bridge',
    summary:
      'PTH unsuppressed and D3 taken in the evening — cause is timing, not dose. DINA education; do not escalate.',
  },
  {
    id: 'sean-001',
    name: 'Sean James',
    recordId: 'SEAN-001',
    branchIds: ['calcium-no', 'pth-middle-improving', 'timing-good-improving'],
    outcome: 'hold',
    summary:
      'PTH still in the middle third but trending down. Morning adherence excellent — hold dose; trajectory is the insight.',
  },
  {
    id: 'ngozi-eze',
    name: 'Ngozi Eze',
    recordId: 'NE-022',
    branchIds: ['calcium-no', 'pth-lower', 'timing-good-suppressed'],
    outcome: 'hold',
    summary:
      'PTH suppressed, morning window every day, sleep architecture green — two pathways confirm pRGC function.',
  },
] as const
