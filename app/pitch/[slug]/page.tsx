import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CARD } from '@/components/sections/layout'
import { getPitchDetailPage, PITCH_DETAIL_PAGES } from '@/lib/pitch/pitch-minimal'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return PITCH_DETAIL_PAGES.map((page) => ({ slug: page.slug }))
}

type PitchDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PitchDetailPage({ params }: PitchDetailPageProps) {
  const { slug } = await params
  const page = getPitchDetailPage(slug)

  if (!page) notFound()

  return (
    <main className="mx-auto w-full max-w-[76rem] px-5 pb-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">{page.eyebrow}</p>
      <h1 className="type-section mt-4 max-w-4xl">{page.title}</h1>
      <p className="type-body mt-4 max-w-3xl text-black/70">{page.subtitle}</p>

      <div
        className="mt-8 h-[220px] w-full rounded-[var(--calm-radius-card,8px)] border border-black/10 bg-cover bg-center sm:h-[320px]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgb(247 250 252 / 0.1), rgb(13 13 13 / 0.35)), url(${page.image})`,
        }}
        aria-label={page.imageAlt}
        role="img"
      />

      <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5">
        {page.sections.map((section) => (
          <article key={section.title} className={cn(CARD, 'rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}>
            <h2 className="text-lg font-medium text-black sm:text-xl">{section.title}</h2>
            <p className="type-body mt-2 text-sm text-black/70 sm:text-base">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-3 flex flex-col gap-2 text-sm text-black/65 sm:text-base">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-[#C9973A]" aria-hidden>
                      —
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      {page.sources && page.sources.length > 0 ? (
        <section className={cn(CARD, 'mt-8 rounded-[var(--calm-radius-card,8px)] p-5 sm:mt-10 sm:p-6')}>
          <p className="font-mono text-xs uppercase tracking-widest text-black/50">Sources</p>
          <ul className="mt-3 flex flex-col gap-2">
            {page.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-black/80 underline underline-offset-4 hover:text-black sm:text-base"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Back to landing
        </Link>
        <Link
          href="/contact?intent=clinical-briefing"
          className="inline-flex items-center rounded-full border border-black/15 bg-white/80 px-5 py-2 text-sm font-medium text-black hover:bg-white"
        >
          Request briefing
        </Link>
      </div>
    </main>
  )
}
