import Link from 'next/link'

import { DisruptionSpectrum } from '@/components/sections/DisruptionSpectrum'
import { EvidenceCards } from '@/components/sections/EvidenceCards'
import { EvidenceSpectrumSection } from '@/components/sections/evidence-spectrum-section'
import { Footer } from '@/components/sections/Footer'

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main id="evidence" className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">Evidence</p>
        <h1 className="type-section mt-4 max-w-3xl">The science behind dose timing</h1>
        <p className="type-body mt-4 max-w-3xl">
          Oxford-validated chronodosing is trial-evidenced but still untranslated in everyday practice — DIOS closes that gap
        </p>

        <EvidenceCards showCta />

        <section className="mt-20 border-t border-black/[0.06] pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">
            The clinical framework
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-black/60">
            Every patient Vaya sees is scored across seven circadian disease nodes. This is what
            a clinician sees. Tap any node for the full clinical detail.
          </p>
          <div className="mt-8">
            <EvidenceSpectrumSection />
          </div>
        </section>

        <DisruptionSpectrum />

        <p className="type-body mt-12 text-center">
          <Link href="/" className="text-black underline-offset-4 hover:underline">
            ← Back to homepage
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}
