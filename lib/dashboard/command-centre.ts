import { buildBodyClockFromMLuxProfile, type MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { LAYER_BIT_BLOOD, LAYER_BIT_SMARTPHONE, LAYER_BIT_TIPTRAQ } from '@/lib/dashboard/dlmo-merge'
import { buildBodyClockModel } from '@/lib/dashboard/body-clock'
import { buildInsightsData, type NightFlagsRow } from '@/lib/dashboard/insights-data'
import { formatMinutesLabel } from '@/lib/dashboard/time-utils'
import { buildSpectrumScores } from '@/lib/spectrum/spectrum-builder'
import { SPECTRUM_NODES } from '@/lib/spectrum/spectrum-data'
import type { SpectrumScore } from '@/lib/spectrum/spectrum-types'

export type DiagnosticLayerStatus = {
  id: 'l1' | 'l2' | 'l3'
  label: string
  title: string
  status: string
  connected: boolean
  href?: string
}

export type OrganCallout = {
  id: string
  organ: string
  detail: string
  tone: 'neutral' | 'warn' | 'alert'
}

export type ProtocolStep = {
  id: string
  timeLabel: string
  title: string
  detail: string
  state: 'active' | 'locked' | 'pending'
}

export type CommandCentreViewModel = {
  greeting: string
  fullName: string
  avatarUrl: string | null
  dlmoTime: string
  dlmoSummary: string
  dlmoPopulationNote: string
  mluxScore: number
  mluxMorningLabel: string
  mluxEveningLabel: string
  mluxSummary: string
  spectrumNodes: { label: string; shortLabel: string }[]
  layers: DiagnosticLayerStatus[]
  organCallouts: OrganCallout[]
  alignmentScore: number
  alignmentTarget: number
  alignmentStateLabel: string
  alignmentTargetLabel: string
  protocolNote: string
  protocolSteps: ProtocolStep[]
  showGpReport: boolean
}

type CommandCentreMluxProfile = MLuxProfileRow & { mlux_score?: number | null }

type BuildCommandCentreInput = {
  greeting: string
  fullName: string
  avatarUrl: string | null
  firstName: string
  chronotypeQ1: string
  chronotypeQ3: string
  chronotypeLabel: string
  currentMedications: string[] | null
  mluxProfile: CommandCentreMluxProfile | null
  tipTraqNightsCount: number
  bloodPanelsCount: number
  smartphoneActive: boolean
  latestNight: NightFlagsRow | null
}

function mluxExposureLabels(
  morning: 'low' | 'none' | 'good',
  evening: 'low' | 'none' | 'good'
): { morning: string; evening: string; summary: string } {
  const label = (value: 'low' | 'none' | 'good') =>
    value === 'good' ? 'Normal' : value === 'low' ? 'Low' : 'Unknown'

  const morningLabel = label(morning)
  const eveningLabel = label(evening)
  const reversed = morning === 'low' && (evening === 'good' || evening === 'low')

  return {
    morning: morningLabel,
    evening: eveningLabel,
    summary: reversed
      ? 'Your light exposure is reversed — too low in the morning and too high in the evening.'
      : 'Light exposure pattern is being tracked from your connected streams.',
  }
}

function buildSpectrumStrip(scores: SpectrumScore[]): { label: string; shortLabel: string }[] {
  const preferred = [
    'body-clock',
    'blood-sugar',
    'blood-pressure',
    'immune-flare',
    'brain-health',
    'cancer-risk',
  ]
  return preferred
    .map((id) => {
      const node = SPECTRUM_NODES.find((n) => n.id === id)
      const score = scores.find((s) => s.nodeId === id)
      if (!node || !score) return null
      return { label: node.label, shortLabel: node.shortLabel }
    })
    .filter((row): row is { label: string; shortLabel: string } => row != null)
}

function buildOrganCallouts(input: {
  chronotypeLabel: string
  latestNight: NightFlagsRow | null
  hasTipTraq: boolean
  bloodConnected: boolean
  medicationsCount: number
}): OrganCallout[] {
  const callouts: OrganCallout[] = [
    {
      id: 'brain',
      organ: 'Brain / SCN',
      detail: input.chronotypeLabel.includes('evening')
        ? 'Circadian phase: Delayed'
        : input.chronotypeLabel.includes('morning')
          ? 'Circadian phase: Advanced'
          : 'Circadian phase: Intermediate',
      tone: 'warn',
    },
  ]

  if (input.latestNight?.apnea_confound_flag) {
    callouts.push({
      id: 'airway',
      organ: 'Airway',
      detail: 'Apnoea signal detected — review with your clinician',
      tone: 'alert',
    })
  } else if (input.hasTipTraq) {
    callouts.push({
      id: 'airway',
      organ: 'Airway',
      detail: 'RDI within monitoring range',
      tone: 'neutral',
    })
  }

  if (input.latestNight?.high_sympathetic_flag) {
    callouts.push({
      id: 'heart',
      organ: 'Heart',
      detail: 'Autonomic load elevated overnight',
      tone: 'alert',
    })
  } else if (input.hasTipTraq) {
    callouts.push({
      id: 'heart',
      organ: 'Heart',
      detail: 'Autonomic balance tracking active',
      tone: 'neutral',
    })
  }

  callouts.push({
    id: 'liver',
    organ: 'Liver',
    detail:
      input.medicationsCount > 0
        ? 'Chronopharmacology timing adjusting'
        : 'Add medications in profile for timing guidance',
    tone: input.medicationsCount > 0 ? 'neutral' : 'warn',
  })

  callouts.push({
    id: 'gi',
    organ: 'GI tract',
    detail: input.bloodConnected
      ? 'Circadian eating timing ready to calibrate'
      : 'Circadian eating timing pending layer connection',
    tone: input.bloodConnected ? 'neutral' : 'warn',
  })

  return callouts
}

function buildProtocolSteps(input: {
  insights: ReturnType<typeof buildInsightsData>
  tipTraqNightsCount: number
  bloodPanelsCount: number
  phaseTimeLabel: string | null
}): ProtocolStep[] {
  const steps: ProtocolStep[] = []
  const light = input.insights.zeitgebers.find((z) => z.id === 'light')
  const food = input.insights.zeitgebers.find((z) => z.id === 'food')
  const movement = input.insights.zeitgebers.find((z) => z.id === 'movement')

  steps.push({
    id: 'morning-med',
    timeLabel: light?.timeLabel ?? '07:15',
    title: 'Morning medication review',
    detail: input.bloodPanelsCount > 0
      ? 'Personalised windows available from your profile'
      : 'Connect blood panel (L2) to unlock medication timing',
    state: input.bloodPanelsCount > 0 ? 'active' : 'locked',
  })

  if (light) {
    steps.push({
      id: 'light',
      timeLabel: light.timeLabel,
      title: 'Morning light cue',
      detail: light.instruction,
      state: 'active',
    })
  }

  if (input.bloodPanelsCount === 0) {
    steps.push({
      id: 'blood',
      timeLabel: '—',
      title: 'Blood panel calibration needed',
      detail: 'Connect L2 to unlock supplement and medication dose calibration',
      state: 'pending',
    })
  }

  if (food) {
    steps.push({
      id: 'food',
      timeLabel: food.timeLabel,
      title: 'First meal',
      detail: food.instruction,
      state: 'active',
    })
  }

  if (input.tipTraqNightsCount < 3) {
    steps.push({
      id: 'nights',
      timeLabel: '10:00',
      title: `Upload nights ${Math.min(input.tipTraqNightsCount + 1, 3)}–3`,
      detail: `${input.tipTraqNightsCount} of 3 TipTraQ nights uploaded`,
      state: 'pending',
    })
  }

  if (movement) {
    steps.push({
      id: 'movement',
      timeLabel: movement.timeLabel,
      title: 'Moderate exercise',
      detail: movement.instruction,
      state: 'active',
    })
  }

  steps.push({
    id: 'evening-med',
    timeLabel: '18:30',
    title: 'Evening medication review',
    detail:
      input.insights.medicationWindows.length > 0
        ? 'Review evening windows with your clinician'
        : 'Add medications and connect streams to unlock',
    state: input.insights.medicationWindows.length > 0 ? 'active' : 'locked',
  })

  return steps
}

export function buildCommandCentreViewModel(input: BuildCommandCentreInput): CommandCentreViewModel {
  const hasTipTraq = input.tipTraqNightsCount > 0
  const bloodConnected = input.bloodPanelsCount > 0
  const profile = input.mluxProfile

  const bodyClock =
    profile && hasTipTraq
      ? buildBodyClockFromMLuxProfile(profile)
      : buildBodyClockModel(input.chronotypeQ1, input.chronotypeQ3, input.chronotypeLabel)

  const mluxScore = Math.round(profile?.mlux_score ?? (profile?.confidence_score ?? 20) * 3.5)
  const mluxLabels = mluxExposureLabels(
    input.smartphoneActive ? 'low' : 'none',
    hasTipTraq ? 'good' : 'none'
  )

  const spectrumScores = buildSpectrumScores({
    mluxScore,
    chronotype: profile?.chronotype ?? input.chronotypeLabel,
    hasTipTraqData: hasTipTraq,
    hasBloodData: bloodConnected,
    currentMedications: input.currentMedications ?? [],
  })

  const insights = buildInsightsData({
    profile: profile
      ? {
          ...profile,
          dominant_layer: hasTipTraq ? 'tiptraq' : bloodConnected ? 'blood' : 'smartphone',
          layers_active:
            (hasTipTraq ? LAYER_BIT_TIPTRAQ : 0) |
            (bloodConnected ? LAYER_BIT_BLOOD : 0) |
            (input.smartphoneActive ? LAYER_BIT_SMARTPHONE : 0),
        }
      : null,
    latestNight: input.latestNight,
    nightsCount: input.tipTraqNightsCount,
    currentMedications: input.currentMedications,
    fallbackSleepTime: input.chronotypeQ3,
    latestBloodPanel: null,
  })

  const dlmoTime =
    profile?.mlux_phase_time?.slice(0, 5) ??
    formatMinutesLabel(bodyClock.phaseMinutes)

  const alignmentScore = Math.round(
    (spectrumScores.reduce((sum, s) => sum + s.score, 0) / spectrumScores.length) * 100
  )
  const alignmentTarget = Math.min(100, Math.max(alignmentScore + 28, 72))

  return {
    greeting: input.greeting,
    fullName: input.fullName,
    avatarUrl: input.avatarUrl,
    dlmoTime,
    dlmoSummary: hasTipTraq
      ? `DLMO proxy from ${input.tipTraqNightsCount} TipTraQ night${input.tipTraqNightsCount === 1 ? '' : 's'}`
      : 'DLMO estimate from your chronotype answers',
    dlmoPopulationNote: 'Population median typically 21:00–22:00',
    mluxScore,
    mluxMorningLabel: mluxLabels.morning,
    mluxEveningLabel: mluxLabels.evening,
    mluxSummary: mluxLabels.summary,
    spectrumNodes: buildSpectrumStrip(spectrumScores),
    layers: [
      {
        id: 'l1',
        label: 'L1',
        title: 'Sleep sensor',
        status: hasTipTraq
          ? `Connected · ${input.tipTraqNightsCount} of 3 nights`
          : 'Not connected',
        connected: hasTipTraq,
        href: '/dashboard/streams',
      },
      {
        id: 'l2',
        label: 'L2',
        title: 'Blood panel',
        status: bloodConnected ? 'Connected' : 'Not connected',
        connected: bloodConnected,
        href: '/dashboard/streams/bloods',
      },
      {
        id: 'l3',
        label: 'L3',
        title: 'Phone camera',
        status: input.smartphoneActive ? 'Active' : 'Not connected',
        connected: input.smartphoneActive,
        href: '/dashboard/streams',
      },
    ],
    organCallouts: buildOrganCallouts({
      chronotypeLabel: input.chronotypeLabel,
      latestNight: input.latestNight,
      hasTipTraq,
      bloodConnected,
      medicationsCount: input.currentMedications?.length ?? 0,
    }),
    alignmentScore,
    alignmentTarget,
    alignmentStateLabel:
      alignmentScore < 45 ? 'Hibernation state' : alignmentScore < 65 ? 'Re-entrainment' : 'Spring alignment',
    alignmentTargetLabel: 'Spring target',
    protocolNote: 'Re-entrainment protocol · no new medications',
    protocolSteps: buildProtocolSteps({
      insights,
      tipTraqNightsCount: input.tipTraqNightsCount,
      bloodPanelsCount: input.bloodPanelsCount,
      phaseTimeLabel: insights.phaseTimeLabel,
    }),
    showGpReport: hasTipTraq && Boolean(profile),
  }
}
