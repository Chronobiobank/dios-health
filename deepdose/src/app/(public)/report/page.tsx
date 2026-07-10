import type { Metadata } from 'next'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { REPORT_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${REPORT_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: REPORT_PAGE.lede,
  alternates: { canonical: '/report' },
}

export default function ReportPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Safety</p>
        <h1 className="seco-page__title">{REPORT_PAGE.title}</h1>
        <p className="seco-page__lede">{REPORT_PAGE.lede}</p>
        <section className="seco-app-card mt-8 space-y-3 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-ink-muted">{REPORT_PAGE.body}</p>
          <p className="text-sm">
            <a className="font-medium text-accent hover:underline" href={`mailto:${REPORT_PAGE.email}`}>
              {REPORT_PAGE.email}
            </a>
          </p>
        </section>
        <p className="mt-10 text-sm text-ink-muted">
          <Link href="/safety" className="text-accent hover:underline">
            Safety Policy
          </Link>
          {' · '}
          <Link href="/take-it-down" className="text-accent hover:underline">
            Take It Down Act Policy
          </Link>
        </p>
      </div>
    </article>
  )
}
