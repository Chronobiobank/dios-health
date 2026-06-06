import type { Metadata } from 'next'

import { CliniciansLanding } from '@/components/sections/clinicians/clinicians-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { CLINICIANS_LANDING_META } from '@/lib/pitch/clinicians-landing-content'

import '@/app/styles/clinicians-landing.css'

export const metadata: Metadata = {
  title: CLINICIANS_LANDING_META.title,
  description: CLINICIANS_LANDING_META.description,
}

export default function CliniciansPage() {
  return (
    <MarketingShell showFooter={false}>
      <CliniciansLanding />
    </MarketingShell>
  )
}
