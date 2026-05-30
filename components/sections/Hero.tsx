import Link from 'next/link'

import { BTN_HERO, CONTAINER } from './layout'
import { SectionLabel } from './SectionLabel'

const HERO_VIDEO = {
  src: '/chronotherapy.mp4',
  poster: '/hero.jpg',
  label: 'Chronotherapy and dose timing — body clock entrainment through light',
} as const

export function Hero() {
  return (
    <section id="our-edge" className="w-full py-14 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        <div className="relative flex min-h-[min(100dvh,32rem)] items-end overflow-hidden rounded-lg sm:min-h-[28rem] sm:items-center lg:min-h-[32rem] lg:rounded-xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_VIDEO.poster}
            aria-label={HERO_VIDEO.label}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={HERO_VIDEO.src} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <div className="relative z-10 max-w-3xl px-6 py-10 text-left text-white sm:px-10 sm:py-12 lg:max-w-4xl lg:px-14 lg:py-16">
            <SectionLabel title="Our Edge" light />

            <h1 className="type-hero-overlay mt-4 !text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[1.05] text-white">
              Your body clock decides
              <br />
              when every dose works.
            </h1>

            <p className="type-hero-meta mt-6 max-w-2xl !text-[clamp(1.125rem,2.2vw,1.625rem)] leading-snug text-white/85">
              DIOS reads your body clock and finds the right time for every dose.
            </p>

            <Link href="#demo" className={`${BTN_HERO} mt-8`}>
              See live demo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
