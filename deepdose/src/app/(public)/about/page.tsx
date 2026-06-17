import Link from 'next/link'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title">Chronotherapy for everyone</h1>
        <p className="seco-page__lede">
          {DEEPDOSE_NAME} is a patient-owned chronobiobank and precision dosing platform within the
          DIOS Health ecosystem.
        </p>
        <p className="seco-page__lede">
          We combine wearable-ready architecture, validated chronotype assessment, and
          evidence-graded medication timing to help patients and clinicians make better dosing
          decisions. Your data stays under your control through dynamic consent.
        </p>
        <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
          Start onboarding →
        </Link>
      </div>
    </article>
  )
}
