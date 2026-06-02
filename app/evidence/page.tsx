import Link from 'next/link'
import type { Metadata } from 'next'

import { DisruptionSpectrum } from '@/components/sections/DisruptionSpectrum'
import { EvidenceCards } from '@/components/sections/EvidenceCards'
import {
  CircadianModelHero,
  DrugsDontWorkSection,
  PersonalisationPayoffSection,
} from '@/components/sections/evidence/circadian-model-sections'
import { EvidenceSpectrumSection } from '@/components/sections/evidence-spectrum-section'

export const metadata: Metadata = {
  title: 'Our circadian model — DIOS Evidence',
  description:
    'Why medicines waste and overprescribing meet a timing problem — and how DIOS personalises dose timing to each patient’s body clock.',
}

export default function EvidencePage() {
  return (
    <main id="evidence">
      <div className="mx-auto max-w-[76rem] px-5 pb-8 sm:px-6">
        <CircadianModelHero />
      </div>

        <DrugsDontWorkSection />
        <PersonalisationPayoffSection />

        <section id="spectrum" className="scroll-mt-[calc(var(--dios-site-nav-height)+1rem)] border-t border-black/[0.06] py-14 sm:py-20">
          <div className="mx-auto max-w-[76rem] px-5 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest text-black/50">
              The circadian model
            </p>
            <h2 className="type-section mt-4 max-w-3xl">Seven nodes. One body clock.</h2>
            <p className="type-body mt-4 max-w-2xl text-black/60">
              Every patient is scored across circadian disease nodes — what a clinician reviews before
              adjusting timing. Tap any node for mechanism, drug clusters, and signals.
            </p>
            <div className="mt-8">
              <EvidenceSpectrumSection />
            </div>
          </div>
        </section>

        <DisruptionSpectrum />

        <div className="mx-auto max-w-[76rem] border-t border-black/[0.06] px-5 py-14 sm:px-6 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">
            Peer-reviewed tiers
          </p>
          <p className="type-body mt-4 max-w-2xl text-black/60">
            Foundational chronotherapy trials and drug-specific timing evidence behind the model.
          </p>
          <EvidenceCards showCta />
        </div>

      <p className="type-body border-t border-black/[0.06] py-10 text-center">
        <Link href="/" className="text-black underline-offset-4 hover:underline">
          ← Back to homepage
        </Link>
      </p>
    </main>
  )
}
