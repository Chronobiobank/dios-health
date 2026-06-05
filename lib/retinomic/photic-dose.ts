import type { PhoticDayPhase } from '@/lib/retinomic/types'

const NMOL_TO_NG_ML = 0.4

export function vitaminD3NmolToNgMl(nmol: number): number {
  return Math.round(nmol * NMOL_TO_NG_ML * 10) / 10
}

export function resolvePhoticDayPhase(now = new Date()): PhoticDayPhase {
  const hour = now.getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 16) return 'midday'
  return 'evening'
}

export function photicContextBanner(
  phase: PhoticDayPhase,
  lightIrisDetected: boolean
): string {
  if (phase === 'morning') {
    if (lightIrisDetected) {
      return 'Light iris detected. Your eyes require immediate 480nm ambient light to anchor your master clock.'
    }
    return 'Melanopic deficit. Deploy 480nm ambient photons within 90 minutes of wake.'
  }
  if (phase === 'midday') {
    return 'Solar zenith is optimal for UVB. Expose skin for 10 minutes to generate natural D3 fuel.'
  }
  return 'Photopic load declining. Shield 480nm after solar zenith to protect DLMO onset.'
}

export function estimateMelanopicLuxCeiling(
  fitzpatrickType: number | null,
  latitudeHint = 51.5
): number {
  const skinFactor = fitzpatrickType != null ? 1 + (fitzpatrickType - 3) * 0.08 : 1
  const latFactor = 1 + Math.min(0.25, Math.abs(latitudeHint - 45) / 180)
  return Math.round(420 * skinFactor * latFactor)
}

export function estimateMelanopicLuxToday(
  smartphoneActive: boolean,
  mluxScore: number | null,
  phase: PhoticDayPhase
): number {
  const base = mluxScore != null ? Math.min(380, mluxScore * 4.2) : smartphoneActive ? 180 : 95
  const phaseBoost = phase === 'morning' ? 1.15 : phase === 'midday' ? 1.35 : 0.72
  return Math.round(base * phaseBoost)
}

export function detectLightIris(eyeColorLabel: string | null | undefined): boolean {
  if (!eyeColorLabel) return false
  const normalized = eyeColorLabel.toLowerCase()
  return (
    normalized.includes('blue') ||
    normalized.includes('grey') ||
    normalized.includes('gray') ||
    normalized.includes('green')
  )
}
