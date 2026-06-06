/** Must match Supabase Auth → URL configuration redirect allowlist */
export const OAUTH_CALLBACK_PATH = '/auth/callback' as const

export const OAUTH_CALLBACK_URL = 'https://dios.health/auth/callback'

/** OAuth return URL — uses current origin in the browser (localhost, preview, production). */
export function resolveOAuthCallbackUrl(origin?: string): string {
  if (origin) {
    return `${origin.replace(/\/$/, '')}${OAUTH_CALLBACK_PATH}`
  }
  return OAUTH_CALLBACK_URL
}
