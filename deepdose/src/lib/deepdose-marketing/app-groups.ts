/** Product top-bar feed groups — one group per chemical chronotype. */

import {
  CHEMICAL_PHENOTYPES,
  isChemicalPhenotypeId,
  type ChemicalPhenotypeId,
} from '@/lib/brand/chemical-phenotypes'

export type AppGroupId = ChemicalPhenotypeId

export type AppGroup = {
  id: AppGroupId
  label: string
  href: string
}

export const APP_FEED_GROUPS: readonly AppGroup[] = CHEMICAL_PHENOTYPES.map((p) => ({
  id: p.id,
  label: p.label,
  href: `/grid?clock=${p.id}`,
}))

export const APP_GROUP_STORAGE_KEY = 'deepdose_feed_group'
export const APP_GROUP_DEFAULT: AppGroupId = 'early_explorer'

/** Map legacy lark/owl storage + URLs onto chronotypes. */
const LEGACY_CLOCK: Record<string, AppGroupId> = {
  lark: 'early_explorer',
  owl: 'night_creator',
}

export function parseAppGroupId(value: string | null | undefined): AppGroupId | null {
  if (!value) return null
  if (isChemicalPhenotypeId(value)) return value
  return LEGACY_CLOCK[value] ?? null
}

export function resolveAppGroup(id: AppGroupId | null | undefined): AppGroup {
  return APP_FEED_GROUPS.find((g) => g.id === id) ?? APP_FEED_GROUPS[0]!
}
