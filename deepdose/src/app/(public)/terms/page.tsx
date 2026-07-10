import type { Metadata } from 'next'
import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  REPORT_PAGE,
  SAFETY_PAGE,
  STATEMENT_2257_PAGE,
  TAKE_IT_DOWN_PAGE,
} from '@/lib/deepdose-marketing/home-gate-content'
import { DEEPDOSE_TERMS_DECISION_SUPPORT } from '@/lib/deepdose-marketing/landing-content'
import { PRIVACY_PAGE } from '@/lib/deepdose-marketing/privacy-content'

export const metadata: Metadata = {
  title: `Terms · ${DEEPDOSE_NAME}`,
  description: `Terms, privacy, and policies for ${DEEPDOSE_NAME}.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Legal</p>
        <h1 className="seco-page__title">Terms</h1>
        <p className="seco-page__lede">
          By entering {DEEPDOSE_NAME}, you agree to these terms and the policies linked below. You
          must be 18 or older.
        </p>

        <section className="seco-app-card mt-8 space-y-3 p-5 md:p-6">
          <h2 className="seco-app-card__title !mb-0">Clinical decision support</h2>
          <p className="text-sm leading-relaxed text-ink-muted">{DEEPDOSE_TERMS_DECISION_SUPPORT}</p>
        </section>

        <nav className="mt-10 space-y-3 text-sm" aria-label="Policies">
          <p className="font-medium text-ink">Policies</p>
          <ul className="space-y-2 text-ink-muted">
            <li>
              <Link className="text-accent hover:underline" href="/privacy">
                {PRIVACY_PAGE.title}
              </Link>
            </li>
            <li>
              <Link className="text-accent hover:underline" href="/safety">
                {SAFETY_PAGE.title}
              </Link>
            </li>
            <li>
              <Link className="text-accent hover:underline" href="/take-it-down">
                {TAKE_IT_DOWN_PAGE.title}
              </Link>
            </li>
            <li>
              <Link className="text-accent hover:underline" href="/report">
                {REPORT_PAGE.title}
              </Link>
            </li>
            <li>
              <Link className="text-accent hover:underline" href="/2257">
                {STATEMENT_2257_PAGE.title}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </article>
  )
}
