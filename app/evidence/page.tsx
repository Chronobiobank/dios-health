import Link from 'next/link'

import { DisruptionSpectrum } from '@/components/sections/DisruptionSpectrum'
import { EvidenceCards } from '@/components/sections/EvidenceCards'
import { Footer } from '@/components/sections/Footer'
import { Nav } from '@/components/sections/Nav'

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <Nav />

      <main id="evidence" className="mx-auto max-w-[76rem] px-5 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">Evidence</p>
        <h1 className="type-section mt-4 max-w-3xl">The science behind dose timing</h1>
        <p className="type-body mt-4 max-w-3xl">
          Chronodosing is not emerging science. It is Oxford-validated, trial-evidenced, and
          untranslated into clinical practice. DIOS closes that gap.
        </p>

        <EvidenceCards showCta />

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
