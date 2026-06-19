import Link from 'next/link'

import {
  DOSE_INTELLIGENCE_TAGLINE_SUPPORT,
  DOSE_ZEITGEBER_EDUCATION,
  ZEITGEBER_DOMAINS,
  ZEITGEBER_PLAIN_LIST,
} from '@/lib/chronobiology/zeitgebers'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title">Chronotherapy for everyone</h1>
        <p className="seco-page__lede">
          {DEEPDOSE_NAME} is patient-owned {DEEPDOSE_TAGLINE.toLowerCase()} within the DIOS Health
          ecosystem — timing {ZEITGEBER_PLAIN_LIST} to your body clock.
        </p>
        <p className="seco-page__lede">{DOSE_INTELLIGENCE_TAGLINE_SUPPORT}</p>
        <p className="seco-page__lede">{DOSE_ZEITGEBER_EDUCATION}</p>
        <ul className="mt-6 space-y-3 text-sm text-ink-muted">
          {ZEITGEBER_DOMAINS.map((domain) => (
            <li key={domain.id}>
              <strong className="text-ink">{domain.label}</strong> — {domain.description}
            </li>
          ))}
        </ul>
        <p className="seco-page__lede mt-6">
          We combine home sleep tests, wearables, validated chronotype assessment, and
          evidence-graded timing to help patients and clinicians align daily cues. Your data stays
          under your control through dynamic consent.
        </p>
        <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
          Start onboarding →
        </Link>
      </div>
    </article>
  )
}
