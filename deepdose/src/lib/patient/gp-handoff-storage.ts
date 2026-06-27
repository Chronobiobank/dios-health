import type { LandingRiskAnalysis } from '@/lib/patient/landing-risk-analysis'

export const GP_HANDOFF_STORAGE_KEY = 'unmed_gp_handoff_summary'

export type GpHandoffSnapshot = LandingRiskAnalysis & {
  medNames: string[]
}

export function persistGpHandoffSnapshot(snapshot: GpHandoffSnapshot): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(GP_HANDOFF_STORAGE_KEY, JSON.stringify(snapshot))
}

export function readGpHandoffSnapshot(): GpHandoffSnapshot | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(GP_HANDOFF_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GpHandoffSnapshot
  } catch {
    return null
  }
}
