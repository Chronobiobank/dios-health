import type { Metadata } from 'next'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { SAFETY_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${SAFETY_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: SAFETY_PAGE.lede,
  alternates: { canonical: '/safety' },
}

export default function SafetyPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Policies</p>
        <h1 className="seco-page__title">{SAFETY_PAGE.title}</h1>
        <p className="seco-page__lede">{SAFETY_PAGE.lede}</p>
        <div className="mt-8 space-y-6">
          {SAFETY_PAGE.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink-muted">
          <Link href="/report" className="text-accent hover:underline">
            Report or request removal
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
