'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { PublicMarketingShell } from '@/components/deepdose/PublicMarketingShell'

const SPLASH_PATHS = new Set(['/'])

type SplashRouteShellProps = {
  children: ReactNode
}

/** Fullscreen splash routes skip marketing nav/footer and lock scroll. */
export function SplashRouteShell({ children }: SplashRouteShellProps) {
  const pathname = usePathname()
  const isSplash = SPLASH_PATHS.has(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('splash-route', isSplash)
    return () => {
      document.documentElement.classList.remove('splash-route')
    }
  }, [isSplash])

  if (isSplash) {
    return <>{children}</>
  }

  return <PublicMarketingShell>{children}</PublicMarketingShell>
}
