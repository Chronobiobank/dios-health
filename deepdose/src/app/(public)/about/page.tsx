import Link from 'next/link'

import { AboutFounderSection } from '@/components/secopeutic/AboutFounderSection'
import { ZEITGEBER_DOMAINS, ZEITGEBER_PLAIN_LIST } from '@/lib/chronobiology/zeitgebers'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title">Built for patients. Clear for clinicians.</h1>
        <p className="seco-page__lede">
          {DEEPDOSE_NAME} is patient-owned {DEEPDOSE_TAGLINE.toLowerCase()} — timing{' '}
          {ZEITGEBER_PLAIN_LIST} to each person&apos;s body clock, with you in the loop when
          clinical data matters.
        </p>

        <AboutFounderSection />

        <section className="mt-10 space-y-4">
          <h2 className="seco-app-section-title">What we time</h2>
          <ul className="space-y-3 text-sm text-ink-muted">
            {ZEITGEBER_DOMAINS.map((domain) => (
              <li key={domain.id}>
                <strong className="text-ink">{domain.label}</strong> — {domain.description}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-ink-muted">
            Home sleep tests, wearables, and validated chronotype assessment feed a single dose
            dash. Patients see what to do next; clinicians see nights, drift, and when to intervene.
            Data stays under patient control through dynamic consent.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
            Start onboarding →
          </Link>
          <Link href="/research" className="seco-landing__btn seco-landing__btn--secondary">
            Research →
          </Link>
        </div>
      </div>
    </article>
  )
}
