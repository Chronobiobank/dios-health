/** Native-style bottom nav — Home · Post · Sync. Profile via top-bar avatar. */

export type AppBottomNavItem = {
  id: 'home' | 'post' | 'sync'
  label: string
  href: string
}

/** Home · Post · Sync — Profile is top-bar avatar only. */
export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'home', label: 'Home', href: '/grid' },
  { id: 'post', label: 'Post', href: '/dose' },
  { id: 'sync', label: 'Sync', href: '/connect' },
] as const

/** @deprecated Post lives in APP_BOTTOM_NAV — kept for older imports. */
export const APP_POST_FAB = {
  href: '/dose',
  label: 'Post',
} as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  // Chat + matches live under Sync
  if (
    href === '/connect' &&
    (pathname === '/chat' ||
      pathname.startsWith('/chat/') ||
      pathname === '/matches' ||
      pathname.startsWith('/matches/'))
  ) {
    return true
  }
  // Home owns the share feed
  if (href === '/grid' && (pathname === '/grid' || pathname.startsWith('/grid/'))) {
    return true
  }
  // Post owns dose stamp
  if (href === '/dose' && (pathname === '/dose' || pathname.startsWith('/dose/'))) {
    return true
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
