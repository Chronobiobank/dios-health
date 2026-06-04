import Link from 'next/link'
import type { Metadata } from 'next'

import { EvidenceSpectrumSection } from '@/components/sections/evidence-spectrum-section'
import {
  EvidenceDiosBridgeSection,
  EvidenceHero,
  EvidenceSpectrumIntro,
  RecentClinicalEvidenceSection,
  UkBiobankFindingsSection,
} from '@/components/sections/evidence/circadian-model-sections'

export const metadata: Metadata = {
  title: 'Clinical evidence — DIOS Health',
  description:
    'UK Biobank wrist-sensor studies (PNAS & Lancet 2024) link light–dark cycles to metabolic health — and how DIOS applies that evidence personally.',
}

export default function EvidencePage() {
  return (
    <main id="evidence" className="marketing-detail">
      <div className="mx-auto max-w-[76rem] px-5 pb-4 sm:px-6">
        <EvidenceHero />
      </div>

      <UkBiobankFindingsSection />

      <EvidenceDiosBridgeSection />

      <section
        id="spectrum"
        className="scroll-mt-[calc(var(--dios-site-nav-height)+1rem)] border-t border-black/[0.06] py-14 sm:py-20"
      >
        <div className="mx-auto max-w-[76rem] px-5 sm:px-6">
          <EvidenceSpectrumIntro />
          <div className="mt-8">
            <EvidenceSpectrumSection />
          </div>
        </div>
      </section>

      <RecentClinicalEvidenceSection />

      <p className="type-body border-t border-black/[0.06] py-10 text-center text-[#0D0D0D]">
        <Link href="/" className="underline-offset-4 hover:underline">
          ← Back to homepage
        </Link>
        <span className="mx-2 text-black/30" aria-hidden>
          ·
        </span>
        <Link href="/contact" className="underline-offset-4 hover:underline">
          Contact the team
        </Link>
      </p>
    </main>
  )
}
