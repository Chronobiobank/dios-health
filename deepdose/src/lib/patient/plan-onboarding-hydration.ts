/** Resolve landing plan meds for onboarding (URL first, then localStorage draft). */

import {
  buildMedicationRecommendation,
  getCatalogEntry,
} from '@/lib/medications/catalog'
import type { MedicationRecommendation } from '@/lib/medications/recommendations'
import {
  earliestTakeTime,
  type MedsPathOptions,
  parseMedsOnboardingParams,
} from '@/lib/medications/home-to-onboarding'
import { readPlanDraft } from '@/lib/patient/plan-draft'

export type OnboardingMedSeed = {
  medCodes: string[]
  medTimes: string[]
  wake: string | null
}

export type OnboardingMedEditorState = {
  selected: Map<string, MedicationRecommendation>
  details: Record<string, { doseValue: string; currentTiming: string }>
  seedKey: string
}

export function resolveOnboardingMedSeedFromUrl(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
): OnboardingMedSeed {
  const fromUrl = parseMedsOnboardingParams(searchParams)
  return {
    medCodes: fromUrl.medCodes,
    medTimes: fromUrl.medTimes,
    wake: fromUrl.wake,
  }
}

export function resolveOnboardingMedSeed(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
): OnboardingMedSeed {
  const fromUrl = resolveOnboardingMedSeedFromUrl(searchParams)
  if (fromUrl.medCodes.length) return fromUrl

  const draft = typeof window !== 'undefined' ? readPlanDraft() : null
  if (draft?.medCodes.length) {
    return {
      medCodes: draft.medCodes,
      medTimes: draft.medTimes ?? [],
      wake:
        draft.wake?.trim()?.slice(0, 5) ??
        earliestTakeTime(draft.medTimes ?? []) ??
        null,
    }
  }

  return fromUrl
}

export function medsPathOptionsFromSeed(seed: OnboardingMedSeed): MedsPathOptions {
  return {
    medCodes: seed.medCodes.length ? seed.medCodes : undefined,
    medTimes: seed.medTimes.length ? seed.medTimes : undefined,
    wake: seed.wake ?? undefined,
    med: seed.medCodes[0],
    time: seed.wake ?? undefined,
  }
}

export function buildOnboardingMedEditorState(
  seed: OnboardingMedSeed,
  phaseOffsetMinutes: number
): OnboardingMedEditorState | null {
  if (!seed.medCodes.length) return null

  const selected = new Map<string, MedicationRecommendation>()
  const details: Record<string, { doseValue: string; currentTiming: string }> = {}

  for (let i = 0; i < seed.medCodes.length; i++) {
    const code = seed.medCodes[i]
    const entry = getCatalogEntry(code)
    if (!entry) continue

    const recommendation = buildMedicationRecommendation(entry, phaseOffsetMinutes)
    selected.set(code, recommendation)
    details[code] = {
      doseValue: '',
      currentTiming:
        seed.medTimes[i]?.slice(0, 5) ??
        recommendation.recommendedStart ??
        '08:00',
    }
  }

  if (selected.size === 0) return null

  return {
    selected,
    details,
    seedKey: `${seed.medCodes.join(',')}|${seed.medTimes.join(',')}`,
  }
}
