export type PthTargetResult = {
  targetCeiling: number
  lowerThirdFloor: number
  referenceLower: number
  referenceUpper: number
  inLowerThird: boolean
  inUpperTwoThirds: boolean
  nearFloor: boolean
}

/** Lower third ceiling of lab reference range — Coimbra primary endpoint. */
export function calculatePthTarget(
  currentPth: number,
  referenceLower: number,
  referenceUpper: number,
  floorThreshold = 8
): PthTargetResult {
  const rangeWidth = referenceUpper - referenceLower
  const lowerThirdCeiling = referenceLower + rangeWidth / 3

  return {
    targetCeiling: lowerThirdCeiling,
    lowerThirdFloor: referenceLower,
    referenceLower,
    referenceUpper,
    inLowerThird: currentPth <= lowerThirdCeiling,
    inUpperTwoThirds: currentPth > lowerThirdCeiling,
    nearFloor: currentPth <= floorThreshold,
  }
}

export type CalciumCascadeStatus = 'clear' | 'watch' | 'hold' | 'alert'

export function serumCalciumStatus(
  value: number,
  referenceUpper: number
): CalciumCascadeStatus {
  if (value > referenceUpper) return 'alert'
  if (value > referenceUpper * 0.95) return 'watch'
  return 'clear'
}

export function urineCalciumStatus(
  valueMg: number,
  biologicalSex: 'female' | 'male' | null
): CalciumCascadeStatus {
  const threshold = biologicalSex === 'male' ? 300 : 250
  if (valueMg > threshold) return 'hold'
  if (valueMg > threshold * 0.85) return 'watch'
  return 'clear'
}
