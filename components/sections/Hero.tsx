import Link from 'next/link'

import { HeroBackground } from '@/components/HeroBackground'
import { SITE_IMAGES } from '@/lib/site-images'

import { BTN_HERO, CONTAINER } from './layout'
import { SectionLabel } from './SectionLabel'

export function Hero() {
  return (
    <div
      id="our-edge"
      className="relative flex min-h-[min(100dvh,640px)] w-full flex-col justify-center overflow-hidden py-20 sm:min-h-[85vh] sm:py-28"
    >
      <HeroBackground
        poster={SITE_IMAGES.hero.poster}
        video={SITE_IMAGES.hero.video}
        alt="Patient wearable used for medicine timing"
      />

      <div className="absolute inset-0 z-10 bg-black/60" aria-hidden />

      <div className={`relative z-20 ${CONTAINER} max-w-2xl text-left text-white`}>
        <SectionLabel title="Our Edge" light />

        <h1 className="type-hero-overlay mt-4 text-white">
          The World&apos;s First
          <br />
          Dose Intelligence Platform
        </h1>

        <ul className="type-hero-meta mt-8 space-y-2 text-white/90">
          <li>Light sets your clock.</li>
          <li>Food feeds your rhythm.</li>
          <li>Medicine needs your window.</li>
        </ul>

        <p className="type-hero-meta mt-6 max-w-xl text-white/85">
          DIOS reads your body clock to find the exact right time for every treatment.
        </p>

        <Link href="#demo" className={`${BTN_HERO} mt-8`}>
          See it in action in 30 minutes →
        </Link>
      </div>
    </div>
  )
}
