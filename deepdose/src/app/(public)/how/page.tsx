import type { Metadata } from 'next'
import Link from 'next/link'

import { HowLoopDiagram } from '@/components/deepdose/HowLoopDiagram'
import {
  HOW_IT_WORKS_CTA,
  HOW_IT_WORKS_META,
  HOW_IT_WORKS_WHY,
} from '@/lib/deepdose-marketing/how-it-works-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: HOW_IT_WORKS_META.title,
  description: HOW_IT_WORKS_META.description,
  alternates: { canonical: '/how' },
}

export default function HowItWorksPage() {
  return (
    <article className="seco-page seco-science seco-chronobiobank seco-mission seco-marketing-page seco-how-page">
      <div className="seco-landing__section-inner seco-how-page__inner">
        <HowLoopDiagram />

        <header className="seco-how-page__why seco-reveal seco-reveal--2" aria-labelledby="how-why-title">
          <h2 id="how-why-title" className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{HOW_IT_WORKS_WHY.title}</span>
          </h2>
          <p className="seco-page__lede">{HOW_IT_WORKS_WHY.lede}</p>
          <p className="seco-chronobiobank__section-sub">{HOW_IT_WORKS_WHY.invite}</p>
        </header>

        <div className={marketingCtaClass('seco-science__cta seco-chronobiobank__cta seco-how-page__cta seco-reveal seco-reveal--3')}>
          <Link href={HOW_IT_WORKS_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {HOW_IT_WORKS_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
