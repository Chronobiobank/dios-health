import type { ReactNode } from 'react'

import { CloqLandingFooter, CloqLandingNav } from '@/components/sections/marketing/cloq-landing-chrome'
import { unbounded } from '@/lib/fonts/marketing-fonts'

import '@/app/styles/cloq-landing.css'

type MarketingPublicShellProps = {
  children: ReactNode
}

/** CLOQ chrome for contact, privacy, and terms. */
export function MarketingPublicShell({ children }: MarketingPublicShellProps) {
  return (
    <div className={`clq-site ${unbounded.variable}`}>
      <CloqLandingNav />
      <main className="clq-detail">{children}</main>
      <CloqLandingFooter />
    </div>
  )
}
