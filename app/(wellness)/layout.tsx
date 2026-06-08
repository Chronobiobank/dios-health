import type { ReactNode } from 'react'

import { SiteChromeGate } from '@/components/sections/marketing/site-chrome-gate'
import { Nav } from '@/components/sections/Nav'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { ScrollToHash } from '@/components/sections/ScrollToHash'

import '@/app/styles/wellness-globals.css'

type WellnessLayoutProps = {
  children: ReactNode
}

/** Marketing, patient dashboard, and public product routes — Calm UI wellness layer. */
export default function WellnessLayout({ children }: WellnessLayoutProps) {
  return (
    <>
      <ScrollToHash />
      <SiteChromeGate>
        <Nav />
      </SiteChromeGate>
      <div className="dios-app-shell relative z-10 flex min-h-full flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteChromeGate>
          <PitchFooter />
        </SiteChromeGate>
      </div>
    </>
  )
}
