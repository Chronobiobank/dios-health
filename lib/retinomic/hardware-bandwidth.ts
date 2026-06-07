export const DEFAULT_MORNING_MLUX_TARGET_DURATION_MINUTES = 90

/** Morning MLux target duration — baseline from iris pigment and skin ITA only. */
export function applyMorningMluxTargetDuration(
  baseMinutes: number,
  _hardwareBandwidthCoefficient = 1
): number {
  return Math.round(baseMinutes)
}
