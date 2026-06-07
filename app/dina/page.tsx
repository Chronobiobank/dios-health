import type { Metadata } from 'next'

import { DinaPage } from '@/components/coach/dina-page'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'

import '@/app/styles/dina-page.css'

export const metadata: Metadata = {
  title: `${COACH_DISPLAY_NAME} — your dose intelligence companion — DIOS`,
  description:
    'See how DINA sequences your morning stack, catches dangerous timing conflicts, and handles missed doses with real chronotherapy intelligence — not generic reminders.',
}

export default function DinaMarketingPage() {
  return (
    <MarketingShell>
      <DinaPage />
    </MarketingShell>
  )
}
