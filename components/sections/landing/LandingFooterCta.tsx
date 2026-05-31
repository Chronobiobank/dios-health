import Link from 'next/link'

import { BTN_PRIMARY, LANDING_COLUMN, SECTION, SECTION_TITLE } from '@/components/sections/layout'

import { GeometricBg } from './GeometricBg'

export function LandingFooterCta() {
  return (
    <section className={`${SECTION} relative bg-[#F9F9F9]`}>
      <GeometricBg variant="muted" />
      <div className={`${LANDING_COLUMN} relative text-center`}>
        <h2 className={`${SECTION_TITLE} mx-auto max-w-md`}>
          Your body clock is running. Is your medication keeping up?
        </h2>
        <Link href="/signup" className={`${BTN_PRIMARY} mt-8 inline-flex h-12 px-6`}>
          Get started free →
        </Link>
      </div>
    </section>
  )
}
