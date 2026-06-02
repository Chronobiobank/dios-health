import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/sections/Footer'
import { getPitchDetailPage, PITCH_DETAIL_PAGES } from '@/lib/pitch/pitch-minimal'

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
    <div className="min-h-screen bg-[#080808] text-white">
      <main className="mx-auto w-full max-w-[76rem] px-5 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--calm-brand)]/75">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">{page.subtitle}</p>

        <div
          className="mt-8 h-[220px] w-full rounded-2xl border border-white/[0.08] bg-cover bg-center sm:h-[320px]"
          style={{ backgroundImage: `linear-gradient(to bottom, rgb(8 8 8 / 0.15), rgb(8 8 8 / 0.7)), url(${page.image})` }}
          aria-label={page.imageAlt}
          role="img"
        />

        <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white sm:text-xl">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">{section.body}</p>
              {section.bullets ? (
                <ul className="mt-3 flex flex-col gap-2 text-sm text-white/65 sm:text-base">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="text-[var(--calm-brand)]/80" aria-hidden>
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
          <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:mt-10 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--calm-brand)]/75">Sources</p>
            <ul className="mt-3 flex flex-col gap-2">
              {page.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 underline underline-offset-4 hover:text-white sm:text-base"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-medium text-[#080808]">
            Back to landing
          </Link>
          <Link
            href="/contact?intent=clinical-briefing"
            className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/[0.04]"
          >
            Request briefing
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
