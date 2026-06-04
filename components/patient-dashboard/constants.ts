export const LOGO_PATH = '/DIOS Health logo black.png'

/** Fallback portrait when no Supabase avatar is set (public/grant-munro.jpeg). */
export const DEFAULT_DASHBOARD_AVATAR = '/grant-munro.jpeg'

export function resolveDashboardAvatar(avatarUrl: string | null | undefined): string {
  const trimmed = avatarUrl?.trim()
  return trimmed || DEFAULT_DASHBOARD_AVATAR
}
