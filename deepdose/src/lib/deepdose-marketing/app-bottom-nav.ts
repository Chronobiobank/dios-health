/** Native-style bottom nav — five primary consumer destinations. */

export type AppBottomNavItem = {
  id: 'real' | 'friends' | 'post' | 'chat' | 'profile'
  label: string
  href: string
}

export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'real', label: 'Real', href: '/real' },
  { id: 'friends', label: 'Friends', href: '/connect' },
  { id: 'post', label: 'Post', href: '/real/post' },
  { id: 'chat', label: 'Chat', href: '/chat' },
  { id: 'profile', label: 'Profile', href: '/profile' },
] as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  if (href === '/real/post') {
    return pathname === '/real/post' || pathname.startsWith('/real/post/')
  }
  if (href === '/real') {
    return pathname === '/real'
  }
  // Account is reached via Profile gear — keep Profile tab active
  if (href === '/profile' && (pathname === '/account' || pathname.startsWith('/account/'))) {
    return true
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
