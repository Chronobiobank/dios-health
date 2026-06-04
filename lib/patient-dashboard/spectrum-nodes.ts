import type { NightFlagsRow } from '@/lib/dashboard/insights-data'
import type { BloodPanel, SpectrumNode, SpectrumSeverity } from '@/lib/patient-dashboard/types'

type BuildChronosomaticSpectrumInput = {
  clockDrift: number
  darkYearsHours: number
  lightAlignment: number
  bloodPanel: BloodPanel
  latestNight: NightFlagsRow | null
  hasTipTraq: boolean
  currentMedications: string[] | null | undefined
  chronotypeEvening: boolean
}

function scoreForSeverity(severity: SpectrumSeverity): number {
  switch (severity) {
    case 'normal':
      return 22
    case 'watch':
      return 42
    case 'elevated':
      return 58
    case 'high':
      return 74
    case 'critical':
      return 92
  }
}

function hasAntihypertensive(medications: string[] | null | undefined): boolean {
  return (medications ?? []).some((m) => /ramipril|amlodipine|losartan|bisoprolol/i.test(m))
}

export function buildChronosomaticSpectrumNodes(
  input: BuildChronosomaticSpectrumInput
): SpectrumNode[] {
  const sleepRhythmSeverity: SpectrumSeverity =
    input.clockDrift >= 30 || input.darkYearsHours >= 1.2 ? 'watch' : 'normal'

  let sleepApnoeaSeverity: SpectrumSeverity = 'normal'
  if (input.latestNight?.apnea_confound_flag) {
    sleepApnoeaSeverity = 'critical'
  } else if (input.latestNight?.high_sympathetic_flag) {
    sleepApnoeaSeverity = 'high'
  } else if (input.hasTipTraq && input.latestNight?.non_dipper_flag) {
    sleepApnoeaSeverity = 'elevated'
  } else if (input.hasTipTraq) {
    sleepApnoeaSeverity = 'watch'
  }

  const bloodSugarSeverity: SpectrumSeverity =
    input.chronotypeEvening || input.darkYearsHours >= 1.2 ? 'elevated' : 'watch'

  const bloodPressureSeverity: SpectrumSeverity =
    input.latestNight?.non_dipper_flag || hasAntihypertensive(input.currentMedications)
      ? 'high'
      : input.clockDrift >= 30
        ? 'watch'
        : 'normal'

  const immuneSeverity: SpectrumSeverity = input.bloodPanel.vdrFlagUnresolved ? 'watch' : 'normal'

  const brainSeverity: SpectrumSeverity =
    input.latestNight?.rem_delay_flag || input.clockDrift >= 30 ? 'watch' : 'normal'

  const cancerSeverity: SpectrumSeverity = input.lightAlignment >= 70 ? 'normal' : 'watch'

  const nodes: Omit<SpectrumNode, 'score'>[] = [
    {
      id: 'sleep-rhythm',
      label: 'Sleep rhythm',
      severity: sleepRhythmSeverity,
      reason:
        sleepRhythmSeverity === 'normal'
          ? 'Your sleep onset is close to your estimated body-clock window.'
          : `Your sleep slipped ${input.clockDrift} minutes last night — your rhythm is running behind schedule.`,
      action:
        sleepRhythmSeverity === 'normal'
          ? 'Keep your morning light routine steady to hold this pattern.'
          : 'Shift evening light earlier and protect your DLMO window tonight.',
    },
    {
      id: 'sleep-apnoea',
      label: 'Sleep apnoea',
      severity: sleepApnoeaSeverity,
      reason:
        sleepApnoeaSeverity === 'critical'
          ? 'TipTraQ shows a high AHI proxy — breathing disruption is driving autonomic load and Dark Years.'
          : sleepApnoeaSeverity === 'normal'
            ? 'No breathing disruption flagged on your latest sleep study.'
            : 'TipTraQ autonomic and breathing signals suggest airway load is affecting your clock recovery.',
      action:
        sleepApnoeaSeverity === 'critical'
          ? 'Ask your GP about a formal sleep study — treating apnoea can recover Dark Years fastest.'
          : 'Monitor overnight breathing on your next TipTraQ block.',
    },
    {
      id: 'blood-sugar',
      label: 'Blood sugar',
      severity: bloodSugarSeverity,
      reason:
        bloodSugarSeverity === 'elevated'
          ? 'Evening chronotype and clock drift raise independent insulin resistance risk in UK Biobank cohorts.'
          : 'Glucose timing risk is lower while your light-dark cycle stays aligned.',
      action:
        bloodSugarSeverity === 'elevated'
          ? 'Take metformin with breakfast and protect morning light — both align with peripheral clock phase.'
          : 'Keep meal timing within your zeitgeber windows.',
    },
    {
      id: 'blood-pressure',
      label: 'Blood pressure',
      severity: bloodPressureSeverity,
      reason:
        bloodPressureSeverity === 'high'
          ? hasAntihypertensive(input.currentMedications)
            ? 'You take blood pressure medicine — bedtime dosing may protect dipping during sleep.'
            : 'TipTraQ shows a non-dipping overnight pattern — cardiovascular load is elevated.'
          : 'No non-dipping pattern flagged on your latest overnight read.',
      action:
        bloodPressureSeverity === 'high'
          ? 'Discuss chronotherapy timing for ramipril or amlodipine with your clinician.'
          : 'Maintain evening wind-down to support nocturnal BP dipping.',
    },
    {
      id: 'immune-system',
      label: 'Immune system',
      severity: immuneSeverity,
      reason:
        immuneSeverity === 'watch'
          ? 'Vitamin D is not absorbing properly — VDR activation stays suppressed and adds Dark Years.'
          : 'Vitamin D and cofactor markers support normal immune clock signalling.',
      action:
        immuneSeverity === 'watch'
          ? 'Show your GP the vitamin D panel — higher dose plus iron may recover immune Dark Years.'
          : 'Retest bloods on schedule to keep immune precision confirmed.',
    },
    {
      id: 'brain-health',
      label: 'Brain health',
      severity: brainSeverity,
      reason:
        brainSeverity === 'watch'
          ? 'Delayed phase and REM timing reduce glymphatic clearance windows overnight.'
          : 'Sleep architecture supports brain clearance on your latest tracked nights.',
      action:
        brainSeverity === 'watch'
          ? 'Protect deep sleep with earlier dim light and consistent wake time.'
          : 'Keep sleep regularity to maintain brain health precision.',
    },
    {
      id: 'cancer-risk',
      label: 'Cancer risk',
      severity: cancerSeverity,
      reason:
        cancerSeverity === 'watch'
          ? 'Light alignment is below target — sustained circadian disruption raises long-horizon risk.'
          : 'Light-dark alignment is within a protective range for DNA repair timing.',
      action:
        cancerSeverity === 'watch'
          ? 'Increase morning melanopic light and reduce late-evening exposure.'
          : 'Maintain consistent light-dark cycles across the week.',
    },
  ]

  return nodes.map((node) => ({
    ...node,
    score: scoreForSeverity(node.severity),
  }))
}
