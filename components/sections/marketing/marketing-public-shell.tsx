import type { ReactNode } from 'react'

import { MarketingFontScope } from '@/components/sections/marketing/marketing-font-scope'
import {
  MarketingKawasakiFooter,
  MarketingKawasakiNav,
} from '@/components/sections/marketing/marketing-kawasaki-chrome'
import {
  CORPORATE_BRAND,
  CORPORATE_FOOTER,
  CORPORATE_NAV,
} from '@/lib/pitch/corporate-landing-content'

import '@/app/styles/marketing-landing.css'

type MarketingPublicShellProps = {
  children: ReactNode
}

/** CLOQ chrome for public pages outside the scroll-snap landing deck. */
export function MarketingPublicShell({ children }: MarketingPublicShellProps) {
  return (
    <MarketingFontScope className="marketing-v2-root--corporate marketing-v2-root--detail">
      <MarketingKawasakiNav config={CORPORATE_NAV} brand={CORPORATE_BRAND} />
      {children}
      <MarketingKawasakiFooter config={CORPORATE_FOOTER} brand={CORPORATE_BRAND} />
    </MarketingFontScope>
  )
}
