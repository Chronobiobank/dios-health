import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ResearchPaperTiles } from '@/components/secopeutic/ResearchPaperTiles'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  DEEPDOSE_RESEARCH_INTRO,
  DEEPDOSE_RESEARCH_META,
  DEEPDOSE_RESEARCH_PAPERS,
  DEEPDOSE_RESEARCH_SCHOLARS,
} from '@/lib/secopeutic/research-content'
import type { LandingClinician } from '@/lib/secopeutic/landing-clinicians'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: DEEPDOSE_RESEARCH_META.title,
  description: DEEPDOSE_RESEARCH_META.description,
}

const AVATAR_TONE_CLASS: Record<NonNullable<LandingClinician['tone']>, string> = {
  violet: 'seco-research-scholar__avatar--violet',
  amber: 'seco-research-scholar__avatar--amber',
  teal: 'seco-research-scholar__avatar--teal',
}

function ScholarAvatar({ clinician }: { clinician: LandingClinician }) {
  if (clinician.image) {
    return (
      <Image
        src={clinician.image}
        alt={clinician.imageAlt ?? clinician.name}
        width={40}
        height={40}
        unoptimized
        className="seco-research-scholar__avatar"
      />
    )
  }

  const initials = clinician.initials ?? clinician.name.slice(0, 2).toUpperCase()
  const toneClass = clinician.tone ? AVATAR_TONE_CLASS[clinician.tone] : ''

  return (
    <span
      className={cn('seco-research-scholar__avatar seco-research-scholar__avatar--initials', toneClass)}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export default function ResearchPage() {
  const { lede, cost, consent } = DEEPDOSE_RESEARCH_INTRO

  return (
    <article className="seco-page">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">Research</p>
        <h1 className="seco-page__title">Why timing matters</h1>
        <p className="seco-page__lede">{lede}</p>
        <p className="seco-research-cost text-sm text-ink-muted">
          <a
            href={cost.href}
            className="seco-research-inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {cost.label} ↗
          </a>
        </p>

        <section className="seco-research-scholars mt-10" aria-label="Key researchers">
          <h2 className="seco-app-section-title">Built on chronobiology research</h2>
          <ul className="seco-research-scholars-list">
            {DEEPDOSE_RESEARCH_SCHOLARS.map(({ clinician, cite, href, sourceLabel }) => (
              <li key={clinician.name} className="seco-research-scholar">
                <ScholarAvatar clinician={clinician} />
                <div className="seco-research-scholar__copy">
                  <p className="seco-research-scholar__name">{clinician.name}</p>
                  <p className="seco-research-scholar__cite">{cite}</p>
                  <a
                    href={href}
                    className="seco-research-inline-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sourceLabel} ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="seco-app-section-title">Key papers</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Peer-reviewed sources {DEEPDOSE_NAME} draws on. Click through to read the original
            work.
          </p>
          <ResearchPaperTiles papers={DEEPDOSE_RESEARCH_PAPERS} />
        </section>

        <p className="seco-research-consent mt-10 text-sm text-ink-muted">{consent}</p>

        <div className="mt-10">
          <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
            Start assessment →
          </Link>
        </div>
      </div>
    </article>
  )
}
