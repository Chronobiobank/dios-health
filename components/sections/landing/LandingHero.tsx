import Link from 'next/link'

import { HashLink } from '@/components/sections/HashLink'
import { BTN_PRIMARY, LANDING_COLUMN } from '@/components/sections/layout'
import { SectionLabel } from '@/components/sections/SectionLabel'

import { GeometricBg } from './GeometricBg'

export function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0D0D0D] text-white">
      <GeometricBg variant="hero" />

      <div className={`${LANDING_COLUMN} relative py-16 sm:py-20 lg:py-24`}>
        <SectionLabel title="Your doctor told you what to take." light className="tracking-[0.06em]" />

        <h1 className="type-hero-overlay mt-5 text-[clamp(2.5rem,8vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-white">
          DIʘS tells you when.
        </h1>

        <p className="type-body mt-6 max-w-md text-[17px] leading-relaxed text-white/80">
          Personalised medication timing built around your body clock. Never take your meds at the
          wrong time again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className={`${BTN_PRIMARY} h-12 px-6 text-[15px]`}>
            Get started free →
          </Link>
          <HashLink
            href="/#how-it-works"
            className="type-button inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-[15px] text-white transition-colors hover:border-white/50 hover:bg-white/10"
          >
            See how it works →
          </HashLink>
        </div>
      </div>
    </section>
  )
}
