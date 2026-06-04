import type {
  RiskLevel,
  SpectrumConfidence,
  SpectrumNode,
} from '@/components/dashboard/circadian-risk-spectrum'

type SpectrumInput = {
  mluxScore: number
  chronotype: string | null
  hasTipTraqData: boolean
  hasBloodData: boolean
  currentMedications: string[]
}

function scoreToRisk(score: number, invert = false): RiskLevel {
  let value = score
  if (invert) value = 100 - value
  if (value < 25) return 'low'
  if (value < 50) return 'moderate'
  if (value < 75) return 'elevated'
  return 'high'
}

function resolveConfidence(hasTipTraq: boolean, hasBlood: boolean): SpectrumConfidence {
  if (hasTipTraq) return 'CONFIRMED'
  if (hasBlood) return 'PRECISION'
  return 'ESTIMATED'
}

function normalizeChronotype(chronotype: string | null): {
  isEvening: boolean
  isMorning: boolean
} {
  const label = chronotype?.toLowerCase() ?? ''
  return {
    isEvening: label.includes('evening'),
    isMorning: label.includes('morning'),
  }
}

function readMedications(medications: string[]): {
  hasAntihypertensive: boolean
} {
  return {
    hasAntihypertensive: medications.some((m) => /ramipril|amlodipine/i.test(m)),
  }
}

export function buildSpectrumNodes(input: SpectrumInput): SpectrumNode[] {
  const mluxScore = Number.isFinite(input.mluxScore) ? Math.max(0, input.mluxScore) : 0
  const chronotype = input.chronotype?.trim() || null
  const currentMedications = input.currentMedications.filter(
    (m): m is string => typeof m === 'string' && m.trim().length > 0
  )

  const { isEvening, isMorning } = normalizeChronotype(chronotype)
  const { hasAntihypertensive } = readMedications(currentMedications)

  const confidence = resolveConfidence(input.hasTipTraqData, input.hasBloodData)

  const mluxAdequacy = Math.round((mluxScore / 250) * 100)
  const phaseRisk = isEvening ? 65 : isMorning ? 30 : 45

  return [
    {
      id: 'body-clock',
      label: 'Body clock',
      riskLevel: scoreToRisk(phaseRisk),
      confidence,
      differentials: ['DSPD', 'ASPD', 'Shift work disorder'],
      description: isEvening
        ? 'Evening chronotype detected — body clock running delayed'
        : isMorning
          ? 'Morning chronotype — body clock running advanced'
          : 'Intermediate chronotype — estimated from DIOS Coach session',
    },
    {
      id: 'sleep-quality',
      label: 'Sleep quality',
      riskLevel: scoreToRisk(100 - mluxAdequacy),
      confidence,
      differentials: ['OSA', 'Insomnia disorder', 'REM behaviour disorder'],
      description:
        mluxScore < 100
          ? 'Low morning light score — sleep architecture likely disrupted'
          : mluxScore < 250
            ? 'Below target morning light — sleep quality may be compromised'
            : 'Morning light adequate — sleep quality baseline supported',
    },
    {
      id: 'blood-sugar',
      label: 'Blood sugar',
      riskLevel: scoreToRisk(isEvening ? 70 : 45),
      confidence: input.hasBloodData ? 'PRECISION' : 'ESTIMATED',
      differentials: ['T2DM', 'Metabolic syndrome', 'Insulin resistance'],
      description:
        'Evening chronotype and low morning light are independent T2DM risk factors per UK Biobank (89,000 participants)',
    },
    {
      id: 'blood-pressure',
      label: 'Blood pressure',
      riskLevel: hasAntihypertensive
        ? scoreToRisk(phaseRisk + 15)
        : scoreToRisk(phaseRisk),
      confidence,
      differentials: ['Non-dipping HTN', 'AF', 'Morning MACE risk'],
      description: hasAntihypertensive
        ? 'Antihypertensive detected — chronodosing timing is clinically significant'
        : 'Blood pressure node — add medication data for precision scoring',
    },
    {
      id: 'immune-flare',
      label: 'Immune flare risk',
      riskLevel: scoreToRisk(mluxAdequacy < 50 ? 60 : 35),
      confidence: input.hasBloodData ? 'PRECISION' : 'ESTIMATED',
      differentials: ['MS', 'RA', 'SLE', 'Psoriasis', "Crohn's"],
      description:
        'VDR activation depends on morning UVB and vitamin D status — estimated from light score',
    },
    {
      id: 'brain-health',
      label: 'Brain health',
      riskLevel: scoreToRisk(isEvening ? 60 : 40),
      confidence,
      differentials: ['MCI', "Alzheimer's", 'MDD', 'Generalised anxiety'],
      description:
        'Delayed circadian phase is an independent risk factor for cognitive decline and mood disorders',
    },
    {
      id: 'cancer-risk',
      label: 'Cancer risk',
      riskLevel: scoreToRisk(mluxAdequacy < 50 ? 55 : 30),
      confidence: 'ESTIMATED',
      differentials: ['Breast', 'Colorectal', 'Prostate', 'NHL'],
      description:
        'Light-dark pattern disruption is associated with elevated cancer risk — estimated from MLux profile',
    },
  ]
}
