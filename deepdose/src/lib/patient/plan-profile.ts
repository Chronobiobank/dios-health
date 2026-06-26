/** Browser-local profile from patient landing (name, avatar, wake). */

export type PlanProfile = {
  firstName?: string
  familyName?: string
  /** @deprecated migrated to firstName */
  displayName?: string
  avatarUrl?: string | null
  wake?: string | null
}

export const PLAN_PROFILE_STORAGE_KEY = 'deepdose-plan-profile'

export function readPlanProfile(): PlanProfile {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PLAN_PROFILE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PlanProfile) : {}
  } catch {
    return {}
  }
}

export function writePlanProfile(next: PlanProfile): void {
  if (typeof window === 'undefined') return
  try {
    const { displayName: _legacy, ...rest } = next
    localStorage.setItem(PLAN_PROFILE_STORAGE_KEY, JSON.stringify(rest))
  } catch {
    /* quota or private mode */
  }
}

export function planProfileDisplayName(profile: PlanProfile = readPlanProfile()): string {
  const first = profile.firstName?.trim() || profile.displayName?.trim() || ''
  const family = profile.familyName?.trim() || ''
  return [first, family].filter(Boolean).join(' ')
}
