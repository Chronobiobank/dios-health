// lib/circadian/score.ts
// Circadian Health Index (CHI) — composite 0-100 summary for clinician triage

export interface CCSInput {
  dlmoEstimateHours: number     // from MCTQ or proxy
  sjlHours: number              // social jet lag
  vitaminD?: number             // 25-OH-D in ng/mL (optional L2)
  fitbitScore?: number          // optional L1 device quality score 0-100
}

export interface CCSResult {
  score: number                 // 0–100, higher = better aligned
  phaseOffsetMinutes: number    // deviation from population mean DLMO (21:00 = 1260 min)
  components: {
    phaseScore: number          // 0-40: how close DLMO is to population mean
    sjlScore: number            // 0-30: penalty for social jet lag
    vitaminDScore: number       // 0-20: nutritional circadian support
    dataQualityScore: number    // 0-10: confidence in estimate
  }
  version: string
}

const POPULATION_MEAN_DLMO_HOURS = 21.0  // 9pm population average

export function calculateCCS(input: CCSInput): CCSResult {
  // Phase score: max 40, penalise deviation from population mean
  const phaseDevHours = Math.abs(input.dlmoEstimateHours - POPULATION_MEAN_DLMO_HOURS)
  const phaseScore = Math.max(0, 40 - phaseDevHours * 6)

  // SJL score: max 30, penalise social jet lag > 0.5h
  const sjlPenalty = Math.max(0, input.sjlHours - 0.5) * 8
  const sjlScore = Math.max(0, 30 - sjlPenalty)

  // Vitamin D score: max 20
  // Optimal range: 60-80 ng/mL (Gominak protocol)
  let vitaminDScore = 10  // default if not measured
  if (input.vitaminD !== undefined) {
    if (input.vitaminD >= 60 && input.vitaminD <= 80) vitaminDScore = 20
    else if (input.vitaminD >= 40 && input.vitaminD < 60) vitaminDScore = 12
    else if (input.vitaminD >= 80 && input.vitaminD <= 100) vitaminDScore = 15
    else vitaminDScore = 5
  }

  // Data quality score: max 10
  const dataQualityScore = input.fitbitScore !== undefined
    ? Math.round(input.fitbitScore / 10)
    : 6  // smartphone L3 default

  const score = Math.min(100, Math.round(phaseScore + sjlScore + vitaminDScore + dataQualityScore))

  // Phase offset from population mean in minutes (for medication timing adjustment)
  const phaseOffsetMinutes = Math.round(
    (input.dlmoEstimateHours - POPULATION_MEAN_DLMO_HOURS) * 60
  )

  return {
    score,
    phaseOffsetMinutes,
    components: { phaseScore, sjlScore, vitaminDScore, dataQualityScore },
    version: process.env.CIRCADIAN_SCORE_VERSION ?? 'v1',
  }
}
