'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { DeepDoseFooter } from '@/components/deepdose/DeepDoseFooter'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { PublicMarketingShell } from '@/components/deepdose/PublicMarketingShell'

const SPLASH_PATHS = new Set(['/'])

type SplashRouteShellProps = {
  children: ReactNode
}

/** Home splash keeps the footer only; other public pages use bottom nav. */
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
    return (
      <DeepDoseShell variant="dark" nav={null}>
        {children}
        <DeepDoseFooter />
      </DeepDoseShell>
    )
  }

  return <PublicMarketingShell>{children}</PublicMarketingShell>
}
