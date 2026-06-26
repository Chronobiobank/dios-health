import type { Metadata } from 'next'
import Link from 'next/link'

import {
  PROBLEM_PAGE_CASE,
  PROBLEM_PAGE_CLINICIAN,
  PROBLEM_PAGE_CTA,
  PROBLEM_PAGE_INTRO,
  PROBLEM_PAGE_META,
  PROBLEM_PAGE_OUTCOMES,
  PROBLEM_PAGE_SECTIONS,
} from '@/lib/deepdose-marketing/problem-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: PROBLEM_PAGE_META.title,
  description: PROBLEM_PAGE_META.description,
}

export default function ProblemPage() {
  return (
    <article className="seco-page seco-problem seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-problem__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{PROBLEM_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-problem__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {PROBLEM_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {PROBLEM_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-problem__lede">{PROBLEM_PAGE_INTRO.lede}</p>
        </header>

        <ol className="seco-problem__blocks seco-reveal seco-reveal--2">
          {PROBLEM_PAGE_SECTIONS.map((section, index) => (
            <li key={section.id} className="seco-problem__block">
              <span className="seco-problem__rank" aria-hidden>
                {index + 1}
              </span>
              <div className="seco-problem__block-copy">
                <h2 className="seco-problem__block-title">{section.title}</h2>
                <p className="seco-problem__block-body">{section.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="seco-problem__panel seco-reveal seco-reveal--3" aria-labelledby="problem-outcomes">
          <h2 id="problem-outcomes" className="seco-problem__panel-title">
            {PROBLEM_PAGE_OUTCOMES.title}
          </h2>
          <ul className="seco-problem__list">
            {PROBLEM_PAGE_OUTCOMES.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="seco-problem__panel seco-reveal seco-reveal--4" aria-labelledby="problem-clinician">
          <h2 id="problem-clinician" className="seco-problem__panel-title">
            {PROBLEM_PAGE_CLINICIAN.title}
          </h2>
          <ul className="seco-problem__list">
            {PROBLEM_PAGE_CLINICIAN.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="seco-problem__case seco-reveal seco-reveal--5">
          <h2 className="seco-problem__case-title">{PROBLEM_PAGE_CASE.title}</h2>
          <p className="seco-problem__case-body">{PROBLEM_PAGE_CASE.body}</p>
        </aside>

        <div className={marketingCtaClass('seco-problem__cta seco-reveal seco-reveal--6')}>
          <Link href={PROBLEM_PAGE_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {PROBLEM_PAGE_CTA.label} →
          </Link>
          <p className="seco-marketing-cta__note">{PROBLEM_PAGE_CTA.note}</p>
        </div>
      </div>
    </article>
  )
}
