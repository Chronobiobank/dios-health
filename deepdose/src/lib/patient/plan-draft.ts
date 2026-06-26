/** Browser-local draft plan from home splash → patient landing (no account). */

import { getCatalogEntry } from '@/lib/medications/catalog'
import { earliestTakeTime, type MedsPathOptions } from '@/lib/medications/home-to-onboarding'
import { verdictForMedCodes } from '@/lib/medications/polypharmacy-timing'

export type PlanDraft = {
  medCodes: string[]
  medTimes: string[]
  wake?: string | null
  savedAt?: string
}

export type PlanContextFromDraft = {
  medCodes: string[]
  medNames: string[]
  medTimes?: string[]
  wake: string | null
  verdict: string
}

const STORAGE_KEY = 'deepdose-plan-draft'

export function readPlanDraft(): PlanDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PlanDraft
    if (!Array.isArray(parsed.medCodes) || parsed.medCodes.length === 0) return null
    return parsed
  } catch {
    return null
  }
}

export function savePlanDraft(draft: Omit<PlanDraft, 'savedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const wake =
      draft.wake?.trim()?.slice(0, 5) ??
      earliestTakeTime(draft.medTimes ?? []) ??
      null
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        medCodes: draft.medCodes,
        medTimes: draft.medTimes,
        wake,
        savedAt: new Date().toISOString(),
      } satisfies PlanDraft)
    )
  } catch {
    /* quota or private mode */
  }
}

export function planDraftToMedsOptions(draft: PlanDraft): MedsPathOptions {
  return {
    medCodes: draft.medCodes,
    medTimes: draft.medTimes,
    wake: draft.wake ?? earliestTakeTime(draft.medTimes) ?? undefined,
  }
}

export function buildPlanContextFromDraft(draft: PlanDraft): PlanContextFromDraft {
  const wake =
    draft.wake?.trim()?.slice(0, 5) ??
    earliestTakeTime(draft.medTimes ?? []) ??
    null
  return {
    medCodes: draft.medCodes,
    medNames: draft.medCodes.map(
      (code) =>
        getCatalogEntry(code)?.displayName ??
        code.charAt(0).toUpperCase() + code.slice(1)
    ),
    medTimes: draft.medTimes.length ? draft.medTimes : undefined,
    wake,
    verdict: verdictForMedCodes(draft.medCodes),
  }
}
