import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ResearchPaperTiles } from '@/components/secopeutic/ResearchPaperTiles'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  DEEPDOSE_RESEARCH_INTRO,
  DEEPDOSE_RESEARCH_META,
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
  const { lede, cost, human, consent } = DEEPDOSE_RESEARCH_INTRO

  return (
    <article className="seco-page seco-research">
      <div className="seco-landing__section-inner">
        <header className="seco-research__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">Research</p>
          <h1 className="seco-page__title">Why timing matters</h1>
          <p className="seco-page__lede">{lede}</p>
        </header>

        <section
          className="seco-research__costs seco-reveal seco-reveal--2"
          aria-label="Why timing matters"
        >
          <article className="seco-research__cost seco-research__cost--human">
            <p className="seco-research__cost-eyebrow">The human cost</p>
            <p className="seco-research__cost-figure">21–34% ↑</p>
            <p className="seco-research__cost-lead">higher risk of death with bright nights</p>
            <p className="seco-research__cost-body">
              Your melatonin onset (DLMO) is the nightly signal that switches on cellular repair —
              for brain and body. When it drifts out of sync, repair is blunted, and the damage
              compounds into disease and fewer healthy years. The UK Biobank&rsquo;s 88,905-person
              study found disrupted light&ndash;dark cycles predict higher mortality.
            </p>
            <a
              href={human.href}
              className="seco-research-inline-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {human.label} ↗
            </a>
          </article>
          <article className="seco-research__cost seco-research__cost--nhs">
            <p className="seco-research__cost-eyebrow">The cost to the NHS</p>
            <p className="seco-research__cost-figure">£100s of millions</p>
            <p className="seco-research__cost-lead">avoidable medicines harm each year</p>
            <p className="seco-research__cost-body">
              Much of it because a medicine&rsquo;s timing never matched the person&rsquo;s body
              clock — the same drug, given at the wrong phase, working against the patient instead of
              with them.
            </p>
            <a
              href={cost.href}
              className="seco-research-inline-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cost.label} ↗
            </a>
          </article>
        </section>

        <section
          className="seco-research-scholars seco-reveal seco-reveal--3"
          aria-label="Key researchers"
        >
          <div className="seco-research__section-head">
            <h2 className="seco-research__h2">Built on Halberg</h2>
            <p className="seco-research__section-sub">
              Franz Halberg founded chronobiology decades ago. Today&rsquo;s researchers keep
              proving him right.
            </p>
          </div>
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

        <section className="seco-research-papers seco-reveal seco-reveal--4">
          <div className="seco-research__section-head">
            <h2 className="seco-research__h2">Key papers</h2>
            <p className="seco-research__section-sub">
              Three evidence clusters — foundational science, drug timing, and population scale.
              Click through to read the original work.
            </p>
          </div>
          <ResearchPaperTiles />
        </section>

        <section className="seco-research__close seco-reveal seco-reveal--4">
          <p className="seco-research__close-eyebrow">Decision support, clinician-led</p>
          <h2 className="seco-research__close-title">Put timing to work</h2>
          <p className="seco-research__close-sub">{consent}</p>
          <div className="seco-research__close-actions">
            <Link href="/login" className="seco-landing__btn seco-landing__btn--primary">
              Start free →
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
