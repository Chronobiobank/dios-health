/** Native-style bottom nav — five primary consumer destinations. */

export type AppBottomNavItem = {
  id: 'home' | 'profile' | 'dosage' | 'chat' | 'connect'
  label: string
  href: string
}

export const APP_BOTTOM_NAV: readonly AppBottomNavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'profile', label: 'Profile', href: '/profile' },
  { id: 'dosage', label: 'Dosage', href: '/dosage' },
  { id: 'chat', label: 'Chat', href: '/chat' },
  { id: 'connect', label: 'Connect', href: '/connect' },
] as const

export function isAppBottomNavActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
