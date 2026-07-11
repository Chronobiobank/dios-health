'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { PublicMarketingShell } from '@/components/deepdose/PublicMarketingShell'

const SPLASH_PATHS = new Set(['/'])

type SplashRouteShellProps = {
  children: ReactNode
}

/** Home splash: light gate, no chrome. Other public pages use light shell + bottom nav. */
export function SplashRouteShell({ children }: SplashRouteShellProps) {
  const pathname = usePathname()
  const isSplash = SPLASH_PATHS.has(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('splash-route', isSplash)
    return () => {
      document.documentElement.classList.remove('splash-route')
    }
  }, [isSplash])

  // SplashFrame already owns the light splash shell — do not nest another layout
  // (nested 100dvh shells are what create a home scrollbar).
  if (isSplash) {
    return <>{children}</>
  }

  return <PublicMarketingShell>{children}</PublicMarketingShell>
}
