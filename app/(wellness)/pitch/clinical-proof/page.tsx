import type { Metadata } from 'next'
import Link from 'next/link'

import { CARD } from '@/components/sections/layout'
import { PitchFounderOrigin } from '@/components/sections/pitch/pitch-founder-origin'
import { CLINICAL_PROOF_PAGE } from '@/lib/pitch/clinical-proof-content'
import { cn } from '@/lib/utils'

const page = CLINICAL_PROOF_PAGE

export const metadata: Metadata = {
  title: `${page.title} — DIOS Clinical Proof`,
  description: page.subtitle,
}

export default function ClinicalProofPage() {
  return (
    <main className="pitch-detail mx-auto w-full max-w-[76rem] px-5 pb-16 sm:px-6">
      <header className="max-w-[var(--pitch-tile-copy-max,40rem)]">
        <p className="type-pitch-eyebrow">{page.eyebrow}</p>
        <h1 className="type-pitch-title mt-3">{page.title}</h1>
        <p className="kz-lead type-pitch-sub mt-3">{page.subtitle}</p>
      </header>

      <PitchFounderOrigin className="mt-8" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
        {page.tiles.map((tile) => (
          <article
            key={tile.id}
            className={cn(CARD, 'dios-glass-pillar flex h-full flex-col rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}
          >
            <h2 className="text-lg font-semibold tracking-tight text-black sm:text-xl">{tile.title}</h2>
            <p className="type-body mt-3 flex-1 text-sm leading-relaxed text-black/72 sm:text-[15px]">
              {tile.body}
            </p>
            <div className="mt-4 border-t border-black/8 pt-4">
              <p className="type-pitch-eyebrow text-[0.625rem]">Source</p>
              <ul className="mt-2 flex flex-col gap-2">
                {tile.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm leading-snug text-black/75 underline underline-offset-4 hover:text-black"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="dios-btn-on-light">
          Back to landing
        </Link>
        <Link href="/evidence" className="dios-btn-on-light--secondary">
          All evidence
        </Link>
        <Link href="/pitch/problem" className="dios-btn-on-light--secondary">
          Founder paper
        </Link>
      </div>
    </main>
  )
}
