'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { KAWASAKI_SHELL_PATHS } from '@/lib/pitch/kawasaki-shell-routes'

function isKawasakiShellPath(pathname: string) {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return KAWASAKI_SHELL_PATHS.some((path) => path === normalized)
}

/** Suppress legacy site nav/footer where Kawasaki chrome owns the page. */
export function SiteChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (isKawasakiShellPath(pathname)) return null
  return children
}
