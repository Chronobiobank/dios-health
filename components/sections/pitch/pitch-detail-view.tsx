import Image from 'next/image'
import Link from 'next/link'

import { CARD } from '@/components/sections/layout'
import type { PitchDetailPage } from '@/lib/pitch/pitch-minimal'
import { cn } from '@/lib/utils'

import { PitchFounderOrigin } from './pitch-founder-origin'

type PitchDetailViewProps = {
  page: PitchDetailPage
  showFounderOrigin?: boolean
}

/** Skim-and-dive detail page — glass hero + section cards, aligned with landing deck */
export function PitchDetailView({ page, showFounderOrigin = false }: PitchDetailViewProps) {
  return (
    <article className="pitch-detail mx-auto w-full max-w-[76rem] px-5 pb-16 sm:px-6">
      <header className="pitch-detail__head max-w-[var(--pitch-tile-copy-max,40rem)]">
        <p className="type-pitch-eyebrow">{page.eyebrow}</p>
        <h1 className="type-pitch-title mt-3">{page.title}</h1>
        <p className="kz-lead type-pitch-sub mt-3">{page.subtitle}</p>
      </header>

      <div className="pitch-detail__hero dios-glass-outer mt-8">
        <div className="pitch-detail__hero-media dios-glass-inner relative min-h-[220px] overflow-hidden sm:min-h-[320px]">
          <Image
            src={page.image}
            alt={page.imageAlt}
            fill
            priority
            sizes="(max-width: 76rem) 100vw, 76rem"
            className="object-cover object-center"
          />
          <div className="pitch-detail__hero-scrim pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>

      {showFounderOrigin ? <PitchFounderOrigin className="mt-8" /> : null}

      <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5">
        {page.sections.map((section) => (
          <article key={section.title} className={cn(CARD, 'rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}>
            <h2 className="text-lg font-semibold tracking-tight text-black sm:text-xl">{section.title}</h2>
            <p className="type-body mt-3 text-sm leading-relaxed text-black/72 sm:text-[15px]">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-4 flex flex-col gap-2.5 border-l border-[#C9973A]/35 pl-4">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="type-body text-sm leading-relaxed text-black/72 sm:text-[15px]">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      {page.sources && page.sources.length > 0 ? (
        <section className={cn(CARD, 'mt-8 rounded-[var(--calm-radius-card,8px)] p-5 sm:mt-10 sm:p-6')}>
          <p className="type-pitch-eyebrow">Sources</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {page.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target={source.href.startsWith('http') ? '_blank' : undefined}
                  rel={source.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm text-black/80 underline underline-offset-4 transition-colors hover:text-black sm:text-[15px]"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="dios-btn-on-light">
          Back to landing
        </Link>
        <Link href="/onboarding" className="dios-btn-on-light--secondary">
          Free baseline scan
        </Link>
      </div>
    </article>
  )
}
