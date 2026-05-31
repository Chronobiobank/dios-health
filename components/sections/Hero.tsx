import { HeroBackground } from '@/components/HeroBackground'
import { HashLink } from '@/components/sections/HashLink'

import { BTN_HERO, CONTAINER } from './layout'
import { SectionLabel } from './SectionLabel'

const HERO_VIDEO = {
  src: '/chronotherapy.mp4',
  poster: '/hero.jpg',
  label: 'Chronotherapy and dose timing — body clock entrainment through light',
} as const

export function Hero() {
  return (
    <section id="why-dios" className="w-full py-14 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        <div className="relative flex min-h-[min(100dvh,32rem)] items-end overflow-hidden rounded-lg sm:min-h-[28rem] sm:items-center lg:min-h-[32rem] lg:rounded-xl">
          <div className="absolute inset-0">
            <HeroBackground
              poster={HERO_VIDEO.poster}
              video={HERO_VIDEO.src}
              alt={HERO_VIDEO.label}
            />
          </div>

          <div className="absolute inset-0 z-[1] bg-black/55" aria-hidden />

          <div className="relative z-[2] max-w-3xl px-6 py-10 text-left text-white sm:px-10 sm:py-12 lg:max-w-4xl lg:px-14 lg:py-16">
            <SectionLabel title="The science" light />

            <h1 className="type-hero-overlay mt-4 !text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[1.05] text-white">
              The right medication at the wrong time is the wrong medication.
            </h1>

            <p className="type-hero-meta mt-6 max-w-2xl !text-[clamp(1.125rem,2.2vw,1.625rem)] leading-snug text-white/85">
              Tell DIOS what you take. It tells you exactly when — timed to your body clock.
            </p>

            <HashLink href="#demo" className={`${BTN_HERO} mt-8`}>
              See live demo →
            </HashLink>
          </div>
        </div>
      </div>
    </section>
  )
}
