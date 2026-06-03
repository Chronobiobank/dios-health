import Link from 'next/link'

import { HashLink } from '@/components/sections/HashLink'

import { BTN_HERO, CONTAINER } from './layout'
import { SectionLabel } from './SectionLabel'

export function Hero() {
  return (
    <section className="bg-black pt-14 text-white sm:pt-20 lg:pt-24">
      <div className={CONTAINER}>
        <SectionLabel title="The £500M problem" light />
        <h1 className="type-hero-overlay mt-4 max-w-3xl text-white">Wrong time. Wrong result.</h1>
        <p className="type-hero-meta mt-6 max-w-2xl text-white/85">
          Tell DIOS what you take. It tells you exactly when — timed to your body clock.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <HashLink href="#demo" className={BTN_HERO}>
            Book a clinical demo →
          </HashLink>
          <Link
            href="/technology"
            className="btn-hero type-button inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-2.5 text-white transition-colors hover:bg-white/10"
          >
            See the technology →
          </Link>
        </div>
      </div>
    </section>
  )
}
