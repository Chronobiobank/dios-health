/** Native-style bottom nav — product shell. */

export type AppBottomNavItem = {
  id: 'grid' | 'dose' | 'friends' | 'bank' | 'me'
  label: string
  href: string
}

export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'grid', label: 'Feed', href: '/grid' },
  { id: 'dose', label: 'Log', href: '/dose' },
  { id: 'friends', label: 'Friends', href: '/connect' },
  { id: 'bank', label: 'Score', href: '/bank' },
  { id: 'me', label: 'Me', href: '/profile' },
] as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  // Account is reached via Me gear — keep Me tab active
  if (href === '/profile' && (pathname === '/account' || pathname.startsWith('/account/'))) {
    return true
  }
  // Chat lives under Friends
  if (href === '/connect' && (pathname === '/chat' || pathname.startsWith('/chat/'))) {
    return true
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
