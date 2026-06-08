import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CARD } from '@/components/sections/layout'
import { TIPTRAQ_PRODUCT_PAGE } from '@/lib/pitch/tiptraq-product-content'
import { cn } from '@/lib/utils'

const page = TIPTRAQ_PRODUCT_PAGE

export const metadata: Metadata = {
  title: `${page.title} — TipTraQ | DIOS`,
  description: page.subtitle,
}

export default function TipTraqProductPage() {
  return (
    <main className="mx-auto w-full max-w-[76rem] px-5 pb-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">{page.eyebrow}</p>
      <h1 className="type-section mt-4 max-w-3xl">{page.title}</h1>
      <p className="kz-lead mt-4 max-w-3xl text-black/70">{page.subtitle}</p>

      <div className="mt-8 overflow-hidden rounded-[var(--calm-radius-card,8px)] border border-black/10">
        <Image
          src={page.image}
          alt={page.imageAlt}
          width={1200}
          height={675}
          className="aspect-[16/9] w-full object-cover object-center"
          priority
        />
      </div>

      <p className="type-body mt-4 max-w-3xl text-sm text-black/60 sm:text-[15px]">{page.clearance}</p>

      <section
        aria-labelledby="tiptraq-eligibility"
        className="mt-8 rounded-[var(--calm-radius-card,8px)] border border-black/10 bg-black/[0.02] p-5 sm:p-6"
      >
        <h2 id="tiptraq-eligibility" className="text-lg font-medium text-black">
          {page.eligibility.headline}
        </h2>
        <p className="type-body mt-2 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-[15px]">
          {page.eligibility.summary}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-black/50">Suited for</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-black/70">
              {page.eligibility.suited.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-black/50">Not the first step for</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-black/70">
              {page.eligibility.notSuited.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-black/60">{page.eligibility.alternative}</p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-2 md:gap-5">
        {page.tiles.map((tile) => (
          <article
            key={tile.id}
            className={cn(CARD, 'flex h-full flex-col rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}
          >
            <h2 className="text-lg font-medium text-black">{tile.title}</h2>
            <p className="type-body mt-2 flex-1 text-sm leading-relaxed text-black/70 sm:text-[15px]">
              {tile.body}
            </p>
            {tile.detail ? (
              <p className="mt-3 text-sm leading-relaxed text-black/50">{tile.detail}</p>
            ) : null}
          </article>
        ))}
      </div>

      <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {page.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-black/80 underline underline-offset-4 hover:text-black sm:text-[15px]"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="dios-btn-on-light">
          Back to landing
        </Link>
        <Link href="/signup/clinician" className="dios-btn-on-light--secondary">
          Clinician demo
        </Link>
      </div>
    </main>
  )
}
