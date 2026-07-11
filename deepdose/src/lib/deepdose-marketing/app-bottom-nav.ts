/** Native-style bottom nav — Nextdoor-style tabs + post control. */

export type AppBottomNavItem = {
  id: 'home' | 'friends' | 'bank'
  label: string
  href: string
}

/** Home · Friends · Bank — profile via top-right avatar; Post is the black circle. */
export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'home', label: 'Home', href: '/grid' },
  { id: 'friends', label: 'Friends', href: '/connect' },
  { id: 'bank', label: 'Bank', href: '/bank' },
] as const

/** Stamp a dose — floating black circle to the right of the pill. */
export const APP_POST_FAB = {
  href: '/dose',
  label: 'Post',
} as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  // Chat lives under Friends
  if (href === '/connect' && (pathname === '/chat' || pathname.startsWith('/chat/'))) {
    return true
  }
  // Home owns the tribe feed
  if (href === '/grid' && (pathname === '/grid' || pathname.startsWith('/grid/'))) {
    return true
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
