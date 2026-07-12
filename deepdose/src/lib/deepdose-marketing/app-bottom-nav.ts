/** Native-style bottom nav — Screen/Score/Share/Sync chrome. */

export type AppBottomNavItem = {
  id: 'home' | 'sync' | 'score'
  label: string
  href: string
}

/** Home · Sync · Score — Dose is the floating black circle (Share). */
export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'home', label: 'Home', href: '/grid' },
  { id: 'sync', label: 'Sync', href: '/connect' },
  { id: 'score', label: 'Score', href: '/bank' },
] as const

/** Dose — floating black circle to the right of the pill. */
export const APP_POST_FAB = {
  href: '/dose',
  label: 'Dose',
} as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  // Chat lives under Sync
  if (href === '/connect' && (pathname === '/chat' || pathname.startsWith('/chat/'))) {
    return true
  }
  // Home owns the share feed
  if (href === '/grid' && (pathname === '/grid' || pathname.startsWith('/grid/'))) {
    return true
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
