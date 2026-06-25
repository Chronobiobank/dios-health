import { buildMedicationRecommendation, searchMedicationCatalog } from '@/lib/medications/catalog'
import { getPolyMedMeta, type PolyMedMeta, type RiskLevel } from '@/lib/medications/polypharmacy-timing'

export type PolyPlanMed = {
  code: string
  name: string
  meta: PolyMedMeta
}

export function resolvePolyPlanMeds(medCodes: string[]): PolyPlanMed[] {
  return medCodes.map((code) => {
    const results = searchMedicationCatalog(code, { limit: 1 })
    const rec = results.length ? buildMedicationRecommendation(results[0], 0) : null
    const meta = getPolyMedMeta(code)
    const name = rec?.displayName ?? code.charAt(0).toUpperCase() + code.slice(1)
    return { code, name, meta }
  })
}

export function syncStateForRisk(risk: RiskLevel): 'synced' | 'review' | 'conflict' {
  if (risk === 'high') return 'conflict'
  if (risk === 'medium') return 'review'
  return 'synced'
}

export const SYNC_DOT_COLOR: Record<'synced' | 'review' | 'conflict', string> = {
  synced: 'var(--status-green)',
  review: 'var(--status-amber)',
  conflict: 'var(--status-red)',
}

export const SYNC_LABEL: Record<'synced' | 'review' | 'conflict', string> = {
  synced: 'On track',
  review: 'Worth a look',
  conflict: 'Needs a change',
}
