import Image from 'next/image'
import Link from 'next/link'

import { HOW_IT_WORKS_DEMO_COPY, ONBOARDING_COPY } from '@/lib/pitch/retinomic-landing-copy'
import { cn } from '@/lib/utils'

const copy = HOW_IT_WORKS_DEMO_COPY

export function HowItWorksDemoHero() {
  return (
    <header className="how-it-works-demo-hero pt-6 sm:pt-8">
      <div className="how-it-works-demo-hero__panel dios-glass-outer">
        <div className="how-it-works-demo-hero__grid">
          <div className="how-it-works-demo-hero__media dios-glass-inner relative min-h-[9rem] overflow-hidden sm:min-h-[11rem]">
            <Image
              src={ONBOARDING_COPY.image}
              alt={ONBOARDING_COPY.imageAlt}
              fill
              priority
              sizes="(max-width: 40rem) 100vw, 40rem"
              className="object-cover object-center"
            />
            <div className="how-it-works-demo-hero__scrim pointer-events-none absolute inset-0" aria-hidden />
          </div>

          <div className="how-it-works-demo-hero__copy min-w-0">
            <p className="type-pitch-eyebrow">{copy.eyebrow}</p>
            <h1 className="type-pitch-title mt-2">{copy.headline}</h1>
            <p className="type-pitch-sub mt-2">{copy.subheadline}</p>
            <p className="calm-auth-muted mt-3 font-mono text-[10px] uppercase tracking-widest">
              {copy.sampleLabel}
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ONBOARDING_COPY.pillars.map((pillar) => (
                <li
                  key={pillar.id}
                  className={cn(
                    'dios-glass-inner px-2.5 py-2',
                    pillar.active ? 'how-it-works-demo-hero__pillar--active' : 'opacity-70'
                  )}
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]">
                    {pillar.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{pillar.note}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href={copy.primaryHref} className="dios-btn-on-light">
                {copy.primaryCta} →
              </Link>
              <Link href={copy.secondaryHref} className="dios-btn-on-light--secondary">
                {copy.secondaryCta} →
              </Link>
            </div>

            <p className="calm-auth-muted mt-3 text-[11px]">{copy.disclaimer}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
