import type { SpectrumScore } from '@/lib/spectrum/spectrum-types'

type BuildInput = {
  mluxScore: number
  chronotype: string | null
  hasTipTraqData: boolean
  hasBloodData: boolean
  currentMedications: string[]
}

export function buildSpectrumScores(input: BuildInput): SpectrumScore[] {
  const { mluxScore, chronotype, hasTipTraqData, hasBloodData, currentMedications } =
    input

  const isEvening = chronotype?.toLowerCase().includes('evening') ?? false
  const isMorning = chronotype?.toLowerCase().includes('morning') ?? false
  const mluxRatio = Math.min(mluxScore / 250, 1.0)

  const layer = hasTipTraqData ? 'L3' : hasBloodData ? 'L2' : 'L1'

  const confidence = hasTipTraqData ? 'CONFIRMED' : hasBloodData ? 'PRECISION' : 'ESTIMATED'

  const hasAntihypertensive = currentMedications.some((m) =>
    /ramipril|amlodipine|losartan|bisoprolol/i.test(m)
  )
  const hasAntidepressant = currentMedications.some((m) =>
    /sertraline|escitalopram|fluoxetine|venlafaxine/i.test(m)
  )

  return [
    {
      nodeId: 'body-clock',
      score: isEvening ? 0.35 : isMorning ? 0.75 : 0.55,
      confidence,
      layer,
    },
    {
      nodeId: 'sleep-quality',
      score: Math.max(0.2, mluxRatio * 0.8),
      confidence,
      layer,
    },
    {
      nodeId: 'blood-sugar',
      score: isEvening ? 0.32 : mluxRatio * 0.75,
      confidence,
      layer,
    },
    {
      nodeId: 'blood-pressure',
      score:
        hasAntihypertensive && isEvening
          ? 0.28
          : hasAntihypertensive
            ? 0.45
            : isEvening
              ? 0.5
              : 0.7,
      confidence,
      layer,
    },
    {
      nodeId: 'immune-flare',
      score: mluxRatio < 0.5 ? 0.38 : mluxRatio * 0.75,
      confidence: hasBloodData ? 'PRECISION' : 'ESTIMATED',
      layer: hasBloodData ? 'L2' : 'L1',
    },
    {
      nodeId: 'brain-health',
      score:
        hasAntidepressant && isEvening ? 0.3 : isEvening ? 0.45 : mluxRatio * 0.8,
      confidence,
      layer,
    },
    {
      nodeId: 'cancer-risk',
      score: mluxRatio < 0.4 ? 0.32 : mluxRatio * 0.7,
      confidence: 'ESTIMATED',
      layer: 'L1',
    },
  ]
}

export const DEMO_SPECTRUM_SCORES: SpectrumScore[] = buildSpectrumScores({
  mluxScore: 87,
  chronotype: 'Evening type',
  hasTipTraqData: false,
  hasBloodData: false,
  currentMedications: ['Ramipril 5mg', 'Simvastatin 20mg'],
})
