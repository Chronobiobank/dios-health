import type { Metadata } from 'next'
import Link from 'next/link'

import { CARD } from '@/components/sections/layout'
import { CLINICAL_PROOF_PAGE } from '@/lib/pitch/clinical-proof-content'
import { cn } from '@/lib/utils'

const page = CLINICAL_PROOF_PAGE

export const metadata: Metadata = {
  title: `${page.title} — DIOS Clinical Proof`,
  description: page.subtitle,
}

export default function ClinicalProofPage() {
  return (
    <main className="mx-auto w-full max-w-[76rem] px-5 pb-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">{page.eyebrow}</p>
      <h1 className="type-section mt-4 max-w-3xl">{page.title}</h1>
      <p className="type-body mt-4 max-w-3xl text-black/70">{page.subtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 md:grid-cols-3 md:gap-5">
        {page.tiles.map((tile) => (
          <article
            key={tile.id}
            className={cn(CARD, 'flex h-full flex-col rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}
          >
            <h2 className="text-lg font-medium text-black">{tile.title}</h2>
            <p className="type-body mt-2 flex-1 text-sm leading-relaxed text-black/70 sm:text-[15px]">
              {tile.body}
            </p>
            <div className="mt-4 border-t border-black/8 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">Source</p>
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
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Back to landing
        </Link>
        <Link
          href="/evidence"
          className="inline-flex items-center rounded-full border border-black/15 bg-white/80 px-5 py-2 text-sm font-medium text-black hover:bg-white"
        >
          Full evidence overview
        </Link>
      </div>
    </main>
  )
}
