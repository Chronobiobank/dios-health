import type { Metadata } from 'next'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { PRIVACY_PAGE } from '@/lib/deepdose-marketing/privacy-content'

export const metadata: Metadata = {
  title: `${PRIVACY_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: PRIVACY_PAGE.lede,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Legal</p>
        <h1 className="seco-page__title">{PRIVACY_PAGE.title}</h1>
        <p className="seco-page__lede">{PRIVACY_PAGE.lede}</p>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {PRIVACY_PAGE.updated}</p>

        <div className="mt-8 space-y-6">
          {PRIVACY_PAGE.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-ink-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-muted">
          Questions:{' '}
          <a className="text-accent hover:underline" href={`mailto:${PRIVACY_PAGE.contactEmail}`}>
            {PRIVACY_PAGE.contactEmail}
          </a>
          {' · '}
          <Link href="/terms" className="text-accent hover:underline">
            Terms
          </Link>
          {' · '}
          <Link href="/safety" className="text-accent hover:underline">
            Safety
          </Link>
        </p>
      </div>
    </article>
  )
}
