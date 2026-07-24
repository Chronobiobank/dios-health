import type { Metadata } from 'next'
import Link from 'next/link'

import { ScienceEvidenceSection } from '@/components/deepdose/ScienceEvidenceSection'
import { ScienceTrustFeatures } from '@/components/deepdose/ScienceTrustFeatures'
import {
  SCIENCE_TRUST_CTA,
  SCIENCE_TRUST_META,
} from '@/lib/deepdose-marketing/science-trust-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: SCIENCE_TRUST_META.title,
  description: SCIENCE_TRUST_META.description,
  alternates: { canonical: '/science' },
}

export default function SciencePage() {
  return (
    <article className="seco-page seco-science seco-chronobiobank seco-mission seco-marketing-page">
      <div className="seco-landing__section-inner">
        <h1 className="sr-only">Science</h1>

        <div className="seco-chronobiobank__mission-stack">
          <ScienceTrustFeatures className="seco-chronobiobank__folds seco-reveal seco-reveal--1" />
        </div>

        <ScienceEvidenceSection className="seco-reveal seco-reveal--2" />

        <div className={marketingCtaClass('seco-science__cta seco-reveal seco-reveal--3')}>
          <Link href={SCIENCE_TRUST_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {SCIENCE_TRUST_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
