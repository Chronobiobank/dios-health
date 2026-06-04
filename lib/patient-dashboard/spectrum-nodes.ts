import type { NightFlagsRow } from '@/lib/dashboard/insights-data'
import { severityFromMeanAhi } from '@/lib/patient-dashboard/dashboard-indicators'
import type { BloodPanel, SpectrumNode, SpectrumSeverity } from '@/lib/patient-dashboard/types'

type BuildChronosomaticSpectrumInput = {
  clockDrift: number
  darkYearsHours: number
  lightAlignment: number
  bloodPanel: BloodPanel
  latestNight: NightFlagsRow | null
  hasTipTraq: boolean
  meanAhi?: number | null
  tipTraqNightsCount?: number
  currentMedications: string[] | null | undefined
  chronotypeEvening: boolean
}

function scoreForSeverity(severity: SpectrumSeverity): number {
  switch (severity) {
    case 'weak':
      return 22
    case 'mild':
      return 42
    case 'moderate':
      return 68
    case 'severe':
      return 92
  }
}

function hasAntihypertensive(medications: string[] | null | undefined): boolean {
  return (medications ?? []).some((m) => /ramipril|amlodipine|losartan|bisoprolol/i.test(m))
}

function apnoeaReason(
  severity: SpectrumSeverity,
  meanAhi: number | null,
  nights: number,
  hasTipTraq: boolean,
  highSympathetic: boolean
): string {
  if (!hasTipTraq) return 'No TipTraQ nights linked yet — sleep apnoea risk cannot be scored.'
  if (meanAhi == null) return 'TipTraQ breathing data is pending aggregation across your study nights.'

  const span =
    nights >= 5 ? 'Five-night' : nights === 1 ? 'Latest' : `${nights}-night`
  const sns =
    highSympathetic && severity !== 'weak'
      ? ' High overnight sympathetic load is adding clock drag alongside breathing disruption.'
      : ''

  switch (severity) {
    case 'weak':
      return `${span} TipTraQ mean AHI ${meanAhi} — below clinical OSA threshold (<5 events/hour).${sns}`
    case 'mild':
      return `${span} TipTraQ mean AHI ${meanAhi} — mild obstructive sleep apnoea (5–15 events/hour).${sns}`
    case 'moderate':
      return `${span} TipTraQ mean AHI ${meanAhi} — moderate OSA (15–30 events/hour).${sns}`
    case 'severe':
      return `${span} TipTraQ mean AHI ${meanAhi} — severe OSA (≥30 events/hour).${sns}`
  }
}

export function buildChronosomaticSpectrumNodes(
  input: BuildChronosomaticSpectrumInput
): SpectrumNode[] {
  const nights = input.tipTraqNightsCount ?? (input.hasTipTraq ? 1 : 0)
  const meanAhi = input.meanAhi ?? null

  const sleepRhythmSeverity: SpectrumSeverity =
    input.clockDrift >= 30 || input.darkYearsHours >= 1.2 ? 'mild' : 'weak'

  const sleepApnoeaSeverity = severityFromMeanAhi(meanAhi, input.hasTipTraq)

  const bloodSugarSeverity: SpectrumSeverity =
    input.chronotypeEvening && input.darkYearsHours >= 1.2
      ? 'moderate'
      : input.chronotypeEvening || input.darkYearsHours >= 1.2
        ? 'mild'
        : 'weak'

  const bloodPressureSeverity: SpectrumSeverity =
    input.latestNight?.non_dipper_flag || hasAntihypertensive(input.currentMedications)
      ? 'moderate'
      : input.clockDrift >= 30
        ? 'mild'
        : 'weak'

  const immuneSeverity: SpectrumSeverity = input.bloodPanel.vdrFlagUnresolved ? 'mild' : 'weak'

  const brainSeverity: SpectrumSeverity =
    input.latestNight?.rem_delay_flag || input.clockDrift >= 30 ? 'mild' : 'weak'

  const cancerSeverity: SpectrumSeverity = input.lightAlignment >= 70 ? 'weak' : 'mild'

  const nodes: Omit<SpectrumNode, 'score'>[] = [
    {
      id: 'sleep-rhythm',
      label: 'Sleep rhythm',
      severity: sleepRhythmSeverity,
      reason:
        sleepRhythmSeverity === 'weak'
          ? 'Your sleep onset is close to your estimated body-clock window.'
          : `Your mean sleep onset is about ${input.clockDrift} minutes after your DLMO window — your rhythm is running behind schedule.`,
      action:
        sleepRhythmSeverity === 'weak'
          ? 'Keep your morning light routine steady to hold this pattern.'
          : 'Shift evening light earlier and protect your DLMO window tonight.',
    },
    {
      id: 'sleep-apnoea',
      label: 'Sleep apnoea',
      severity: sleepApnoeaSeverity,
      reason: apnoeaReason(
        sleepApnoeaSeverity,
        meanAhi,
        nights,
        input.hasTipTraq,
        Boolean(input.latestNight?.high_sympathetic_flag)
      ),
      action:
        sleepApnoeaSeverity === 'severe' || sleepApnoeaSeverity === 'moderate'
          ? 'Ask your GP about a formal sleep study — treating apnoea can recover Dark Years fastest.'
          : sleepApnoeaSeverity === 'mild'
            ? 'Discuss mild OSA with your clinician and keep monitoring on your next TipTraQ block.'
            : 'Monitor overnight breathing on your next TipTraQ block.',
    },
    {
      id: 'blood-sugar',
      label: 'Blood sugar',
      severity: bloodSugarSeverity,
      reason:
        bloodSugarSeverity === 'moderate'
          ? 'Evening chronotype and sustained clock drift raise independent insulin resistance risk in UK Biobank cohorts.'
          : bloodSugarSeverity === 'mild'
            ? 'Evening timing or clock drift is nudging glucose rhythm risk upward.'
            : 'Glucose timing risk stays lower while your light-dark cycle stays aligned.',
      action:
        bloodSugarSeverity !== 'weak'
          ? 'Take metformin with breakfast and protect morning light — both align with peripheral clock phase.'
          : 'Keep meal timing within your zeitgeber windows.',
    },
    {
      id: 'blood-pressure',
      label: 'Blood pressure',
      severity: bloodPressureSeverity,
      reason:
        bloodPressureSeverity === 'moderate'
          ? hasAntihypertensive(input.currentMedications)
            ? 'You take blood pressure medicine — bedtime dosing may protect dipping during sleep.'
            : 'TipTraQ shows a non-dipping overnight pattern — cardiovascular load is elevated.'
          : bloodPressureSeverity === 'mild'
            ? 'Clock drift is nudging nocturnal blood pressure rhythm out of phase.'
            : 'No non-dipping pattern flagged on your latest overnight read.',
      action:
        bloodPressureSeverity !== 'weak'
          ? 'Discuss chronotherapy timing for ramipril or amlodipine with your clinician.'
          : 'Maintain evening wind-down to support nocturnal BP dipping.',
    },
    {
      id: 'immune-system',
      label: 'Immune system',
      severity: immuneSeverity,
      reason:
        immuneSeverity === 'mild'
          ? input.bloodPanel.collectedAt
            ? 'Vitamin D is not absorbing properly — VDR activation stays suppressed and adds Dark Years.'
            : 'No blood panel yet — vitamin D and VDR are unconfirmed; immune risk is provisional until GP bloods.'
          : 'Vitamin D and cofactor markers support immune clock signalling on available labs.',
      action:
        immuneSeverity === 'mild'
          ? 'Show your GP the vitamin D panel — higher dose plus iron may recover immune Dark Years.'
          : 'Retest bloods on schedule to keep immune precision confirmed.',
    },
    {
      id: 'brain-health',
      label: 'Brain health',
      severity: brainSeverity,
      reason:
        brainSeverity === 'mild'
          ? 'Delayed phase and REM timing reduce glymphatic clearance windows overnight.'
          : 'Sleep architecture supports brain clearance on your latest tracked nights.',
      action:
        brainSeverity === 'mild'
          ? 'Protect deep sleep with earlier dim light and consistent wake time.'
          : 'Keep sleep regularity to maintain brain health precision.',
    },
    {
      id: 'cancer-risk',
      label: 'Cancer risk',
      severity: cancerSeverity,
      reason:
        cancerSeverity === 'mild'
          ? 'Light alignment is below target — sustained circadian disruption raises long-horizon risk.'
          : 'Light-dark alignment is within a protective range for DNA repair timing.',
      action:
        cancerSeverity === 'mild'
          ? 'Increase morning melanopic light and reduce late-evening exposure.'
          : 'Maintain consistent light-dark cycles across the week.',
    },
  ]

  return nodes.map((node) => ({
    ...node,
    score: scoreForSeverity(node.severity),
  }))
}
