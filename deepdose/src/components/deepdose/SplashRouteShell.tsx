'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { PublicMarketingShell } from '@/components/deepdose/PublicMarketingShell'
import { ScrollToTopOnMount } from '@/components/deepdose/ScrollToTopOnMount'

/** Orbit match gate — light splash, no marketing chrome. */
const SPLASH_PATHS = new Set(['/match'])
/** Sleep Lab home — full-bleed chamber, owns its own chrome. */
const CHROMELESS_PATHS = new Set(['/'])

type SplashRouteShellProps = {
  children: ReactNode
}

/** Chromeless home / match splash; other public pages use light shell + bottom nav. */
export function SplashRouteShell({ children }: SplashRouteShellProps) {
  const pathname = usePathname() ?? '/'
  const isSplash = SPLASH_PATHS.has(pathname)
  const isChromeless = CHROMELESS_PATHS.has(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('splash-route', isSplash)
    return () => {
      document.documentElement.classList.remove('splash-route')
    }
  }, [isSplash])

  // SplashFrame / Sleep Lab own their shells — do not nest PublicMarketingShell.
  if (isSplash || isChromeless) {
    return (
      <>
        <ScrollToTopOnMount />
        {children}
      </>
    )
  }

  return (
    <PublicMarketingShell>
      <ScrollToTopOnMount />
      {children}
    </PublicMarketingShell>
  )
}
