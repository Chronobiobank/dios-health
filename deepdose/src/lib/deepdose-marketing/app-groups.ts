/** Product top-bar “neighborhood” groups — chronotype feeds (Nextdoor-style switcher). */

export type AppGroupId = 'lark' | 'owl'

export type AppGroup = {
  id: AppGroupId
  label: string
  href: string
}

export const APP_FEED_GROUPS: readonly AppGroup[] = [
  { id: 'lark', label: 'Early birds', href: '/grid?clock=lark' },
  { id: 'owl', label: 'Night owls', href: '/grid?clock=owl' },
] as const

export const APP_GROUP_STORAGE_KEY = 'deepdose_feed_group'

export function parseAppGroupId(value: string | null | undefined): AppGroupId | null {
  if (value === 'lark' || value === 'owl') return value
  return null
}

export function resolveAppGroup(id: AppGroupId | null | undefined): AppGroup {
  return APP_FEED_GROUPS.find((g) => g.id === id) ?? APP_FEED_GROUPS[0]
}
