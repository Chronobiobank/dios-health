import type { Metadata } from 'next'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_TERMS_DECISION_SUPPORT } from '@/lib/deepdose-marketing/landing-content'

export const metadata: Metadata = {
  title: `Terms of service · ${DEEPDOSE_NAME}`,
  description: `Terms governing use of ${DEEPDOSE_NAME} and clinical decision-support boundaries.`,
}

export default function TermsPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Legal</p>
        <h1 className="seco-page__title">Terms of service</h1>
        <p className="seco-page__lede">
          These terms govern your use of {DEEPDOSE_NAME}. Full legal terms are being prepared; the
          clinical boundary below applies today.
        </p>

        <section className="seco-app-card mt-8 space-y-3 p-5 md:p-6">
          <h2 className="seco-app-card__title !mb-0">Clinical decision support</h2>
          <p className="text-sm leading-relaxed text-ink-muted">{DEEPDOSE_TERMS_DECISION_SUPPORT}</p>
        </section>
      </div>
    </article>
  )
}
