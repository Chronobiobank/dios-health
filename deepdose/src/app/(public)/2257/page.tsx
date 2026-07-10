import type { Metadata } from 'next'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { STATEMENT_2257_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${STATEMENT_2257_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: STATEMENT_2257_PAGE.lede,
  alternates: { canonical: '/2257' },
}

export default function Statement2257Page() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Legal</p>
        <h1 className="seco-page__title">{STATEMENT_2257_PAGE.title}</h1>
        <p className="seco-page__lede">{STATEMENT_2257_PAGE.lede}</p>
        <div className="mt-8 space-y-6">
          {STATEMENT_2257_PAGE.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink-muted">
          <Link href="/report" className="text-accent hover:underline">
            Report content
          </Link>
          {' · '}
          <Link href="/terms" className="text-accent hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </article>
  )
}
